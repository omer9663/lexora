export type RequestStatus = 
  | 'PENDING_ASSIGNMENT' 
  | 'IN_PROGRESS' 
  | 'UNDER_REVIEW' 
  | 'REJECTED' 
  | 'APPROVED';

export interface AssignmentRequest {
  id: string; // REQ-000001
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  type: string;
  status: RequestStatus;
  createdAt: string;
  assignedTo?: string; // staffId
  assignedName?: string;
  completedAt?: string;
  verifiedAt?: string;
  comments?: string;
  plagiarismScore?: number;
  aiScore?: number;
  reportUrl?: string;
  workContent?: string;
  attachments?: string[];
  isPaid?: boolean;
}

// Simple store using backend API
export const RequestStore = {
  getRequests: async (filters?: { studentId?: string; assignedTo?: string; status?: string }): Promise<AssignmentRequest[]> => {
    const params = new URLSearchParams(filters as any);
    const response = await fetch(`/api/requests?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch requests");
    return response.json();
  },
  addRequest: async (request: Omit<AssignmentRequest, 'id' | 'status' | 'createdAt'>) => {
    const all = await RequestStore.getRequests();
    const nextId = all.length + 1;
    const newRequest: AssignmentRequest = {
      ...request,
      id: `REQ-${nextId.toString().padStart(6, '0')}`,
      status: 'PENDING_ASSIGNMENT',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest)
    });
    if (!response.ok) throw new Error("Failed to add request");
    return newRequest;
  },
  updateRequest: async (id: string, updates: Partial<AssignmentRequest>) => {
    const response = await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error("Failed to update request");
  },
  markAsPaid: async (requestId: string) => {
    await RequestStore.updateRequest(requestId, { isPaid: true });
  }
};

export type LeadStatus = 'NEW' | 'CONTACTED' | 'FOLLOWUP' | 'CONVERTED' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  assignmentType: string;
  potentialIncome: number;
  status: LeadStatus;
  assignedTo?: string;
  assignedName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadLog {
  id: string;
  leadId: string;
  userId: string;
  userName: string;
  action: string;
  content: string;
  createdAt: string;
}

export const LeadStore = {
  getLeads: async (filters?: { assignedTo?: string }): Promise<Lead[]> => {
    const params = new URLSearchParams(filters as any);
    const response = await fetch(`/api/leads?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch leads");
    return response.json();
  },
  addLead: async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    });
    if (!response.ok) throw new Error("Failed to add lead");
    return response.json();
  },
  updateLead: async (id: string, updates: Partial<Lead>) => {
    const response = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error("Failed to update lead");
  },
  getLogs: async (leadId: string): Promise<LeadLog[]> => {
    const response = await fetch(`/api/leads/${leadId}/logs`);
    if (!response.ok) throw new Error("Failed to fetch logs");
    return response.json();
  },
  addLog: async (leadId: string, log: Omit<LeadLog, 'id' | 'leadId' | 'createdAt'>) => {
    const response = await fetch(`/api/leads/${leadId}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log)
    });
    if (!response.ok) throw new Error("Failed to add log");
  }
};
