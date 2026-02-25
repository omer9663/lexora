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
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
    const { id, title, description, type, status, studentId, studentName, createdAt } = req.body;
    const stmt = db.prepare(`
      INSERT INTO requests (id, title, description, type, status, studentId, studentName, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, title, description, type, status, studentId, studentName, createdAt);
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
