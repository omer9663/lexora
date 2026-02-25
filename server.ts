import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("lexora.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  );

  CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    type TEXT,
    status TEXT,
    studentId TEXT,
    studentName TEXT,
    assignedTo TEXT,
    assignedName TEXT,
    createdAt TEXT,
    completedAt TEXT,
    verifiedAt TEXT,
    comments TEXT,
    plagiarismScore INTEGER,
    aiScore INTEGER,
    reportUrl TEXT,
    workContent TEXT,
    attachments TEXT,
    isPaid INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    email TEXT,
    country TEXT,
    assignmentType TEXT,
    potentialIncome REAL,
    status TEXT,
    assignedTo TEXT,
    assignedName TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS lead_logs (
    id TEXT PRIMARY KEY,
    leadId TEXT,
    userId TEXT,
    userName TEXT,
    action TEXT,
    content TEXT,
    createdAt TEXT
  );
`);

// Seed default admin
const adminExists = db.prepare("SELECT * FROM users WHERE username = 'admin'").get();
if (!adminExists) {
  db.prepare("INSERT INTO users (id, name, username, password, role) VALUES (?, ?, ?, ?, ?)")
    .run('admin_1', 'Arthur Admin', 'admin', 'Omer4all', 'admin');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const { name, username, password, role } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    try {
      const stmt = db.prepare("INSERT INTO users (id, name, username, password, role) VALUES (?, ?, ?, ?, ?)");
      stmt.run(id, name, username, password, role);
      res.json({ id, name, username, role });
    } catch (e) {
      res.status(400).json({ error: "Username already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    if (user) {
      res.json({ id: user.id, name: user.name, username: user.username, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  });

  // User Management Routes
  app.get("/api/users", (req, res) => {
    const role = req.query.role as string;
    let query = "SELECT id, name, username, role FROM users";
    const params: any[] = [];
    
    if (role) {
      query += " WHERE role = ?";
      params.push(role);
    }
    
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Lead Routes
  app.get("/api/leads", (req, res) => {
    const assignedTo = req.query.assignedTo as string;
    let query = "SELECT * FROM leads";
    const params: any[] = [];
    if (assignedTo) {
      query += " WHERE assignedTo = ?";
      params.push(assignedTo);
    }
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  });

  app.post("/api/leads", (req, res) => {
    const { name, phone, email, country, assignmentType, potentialIncome, status, assignedTo, assignedName } = req.body;
    const id = `LEAD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO leads (id, name, phone, email, country, assignmentType, potentialIncome, status, assignedTo, assignedName, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, name, phone, email, country, assignmentType, potentialIncome || 0, status || 'NEW', assignedTo || null, assignedName || null, now, now);
    res.status(201).json({ id });
  });

  app.patch("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates);
    if (fields.length === 0) return res.status(400).json({ error: "No fields to update" });

    updates.updatedAt = new Date().toISOString();
    const finalFields = Object.keys(updates);
    const setClause = finalFields.map(f => `${f} = ?`).join(", ");
    const values = finalFields.map(f => updates[f]);

    const query = `UPDATE leads SET ${setClause} WHERE id = ?`;
    db.prepare(query).run(...values, id);
    res.json({ success: true });
  });

  app.get("/api/leads/:id/logs", (req, res) => {
    const { id } = req.params;
    const rows = db.prepare("SELECT * FROM lead_logs WHERE leadId = ? ORDER BY createdAt DESC").all(id);
    res.json(rows);
  });

  app.post("/api/leads/:id/logs", (req, res) => {
    const { id: leadId } = req.params;
    const { userId, userName, action, content } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO lead_logs (id, leadId, userId, userName, action, content, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, leadId, userId, userName, action, content, now);
    res.status(201).json({ success: true });
  });

  // API Routes
  app.get("/api/requests", (req, res) => {
    const studentId = req.query.studentId as string;
    const assignedTo = req.query.assignedTo as string;
    const status = req.query.status as string;

    let query = "SELECT * FROM requests";
    const params: any[] = [];
    const conditions: string[] = [];

    if (studentId) {
      conditions.push("studentId = ?");
      params.push(studentId);
    }
    if (assignedTo) {
      conditions.push("assignedTo = ?");
      params.push(assignedTo);
    }
    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const rows = db.prepare(query).all(...params);
    res.json(rows.map((row: any) => ({
      ...row,
      attachments: row.attachments ? JSON.parse(row.attachments) : [],
      isPaid: !!row.isPaid
    })));
  });

  app.post("/api/requests", (req, res) => {
    const { 
      id, title, description, type, status, studentId, studentName, createdAt,
      assignedTo, assignedName, completedAt, verifiedAt, comments,
      plagiarismScore, aiScore, reportUrl, workContent, attachments, isPaid
    } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO requests (
        id, title, description, type, status, studentId, studentName, createdAt,
        assignedTo, assignedName, completedAt, verifiedAt, comments,
        plagiarismScore, aiScore, reportUrl, workContent, attachments, isPaid
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id, title, description, type, status, studentId, studentName, createdAt,
      assignedTo || null, assignedName || null, completedAt || null, verifiedAt || null, comments || null,
      plagiarismScore || 0, aiScore || 0, reportUrl || null, workContent || null,
      attachments ? JSON.stringify(attachments) : null,
      isPaid ? 1 : 0
    );
    res.status(201).json({ success: true });
  });

  app.patch("/api/requests/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates);
    if (fields.length === 0) return res.status(400).json({ error: "No fields to update" });

    const setClause = fields.map(f => `${f} = ?`).join(", ");
    const values = fields.map(f => {
      if (f === "attachments") return JSON.stringify(updates[f]);
      if (f === "isPaid") return updates[f] ? 1 : 0;
      return updates[f];
    });

    const query = `UPDATE requests SET ${setClause} WHERE id = ?`;
    db.prepare(query).run(...values, id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
