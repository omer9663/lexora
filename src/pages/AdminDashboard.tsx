import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  FileSearch,
  Users,
  UserPlus,
  Trash2,
  Mail,
  Key
} from 'lucide-react';
import { cn } from '../lib/utils';
import { RequestStore, AssignmentRequest } from '../lib/requestStore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'users'>('pending');
  const [requests, setRequests] = useState<AssignmentRequest[]>([]);
  const [historyRequests, setHistoryRequests] = useState<AssignmentRequest[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AssignmentRequest | null>(null);
  const [comments, setComments] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [staffFilter, setStaffFilter] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'student' });

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else {
      loadRequests();
    }
  }, [activeTab]);

  const loadRequests = async () => {
    try {
      const all = await RequestStore.getRequests();
      if (activeTab === 'pending') {
        setRequests(all.filter(r => r.status === 'UNDER_REVIEW'));
      } else {
        setHistoryRequests(all.filter(r => r.status === 'APPROVED'));
      }
    } catch (error) {
      console.error("Failed to load requests:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      if (response.ok) {
        setIsUserModalOpen(false);
        setNewUser({ name: '', username: '', password: '', role: 'student' });
        loadUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create user");
      }
    } catch (error) {
      alert("Error creating user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (response.ok) {
        loadUsers();
      }
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const filteredHistory = historyRequests.filter(r => 
    r.assignedName?.toLowerCase().includes(staffFilter.toLowerCase()) ||
    r.id.toLowerCase().includes(staffFilter.toLowerCase())
  );

  const handleVerify = async (id: string, approved: boolean) => {
    setIsVerifying(true);
    
    try {
      // Simulate automatic checks
      if (approved) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate scanning
        await RequestStore.updateRequest(id, {
          status: 'APPROVED',
          verifiedAt: new Date().toISOString().split('T')[0],
          plagiarismScore: Math.floor(Math.random() * 5), // Mock low score
          aiScore: Math.floor(Math.random() * 10), // Mock low score
          reportUrl: 'https://lexora.com/reports/REQ-123.pdf',
          comments: 'Verified and approved. High quality work.'
        });
      } else {
        await RequestStore.updateRequest(id, {
          status: 'REJECTED',
          comments: comments || 'Needs more depth and better citations.'
        });
      }

      setIsVerifying(false);
      setSelectedRequest(null);
      setComments('');
      await loadRequests();
    } catch (error) {
      alert("Failed to verify request.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Admin Verification</h1>
          <p className="text-black/50">Review, verify, and approve academic content.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-black/5 shadow-sm">
          <button 
            onClick={() => { setActiveTab('pending'); setSelectedRequest(null); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'pending' ? "bg-black text-white" : "text-black/40 hover:text-black"
            )}
          >
            Pending Review
          </button>
          <button 
            onClick={() => { setActiveTab('history'); setSelectedRequest(null); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'history' ? "bg-black text-white" : "text-black/40 hover:text-black"
            )}
          >
            Past Work
          </button>
          <button 
            onClick={() => { setActiveTab('users'); setSelectedRequest(null); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'users' ? "bg-black text-white" : "text-black/40 hover:text-black"
            )}
          >
            User Management
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">System Users</h2>
            <button 
              onClick={() => setIsUserModalOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-black/80 transition-all"
            >
              <UserPlus size={20} /> Add User
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/[0.02] text-black/40 text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4 text-black/60 text-sm">{u.username}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        u.role === 'admin' ? "bg-purple-100 text-purple-700" :
                        u.role === 'staff' ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Review List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={16} />
              <input 
                type="text" 
                placeholder={activeTab === 'pending' ? "Search pending..." : "Search history by staff/ID..."}
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-black/5 outline-none"
              />
            </div>
            
            <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">
              {activeTab === 'pending' ? 'Pending Review' : 'Approved Work History'}
            </h2>
            
            <div className="space-y-3">
              {activeTab === 'pending' ? (
                requests.length === 0 ? (
                  <p className="text-center py-8 text-black/20 text-sm font-medium">No requests pending review</p>
                ) : (
                  requests.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all",
                        selectedRequest?.id === req.id 
                          ? "bg-black text-white border-black shadow-lg" 
                          : "bg-white border-black/5 hover:border-black/20"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[10px] font-bold opacity-60">{req.id}</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          Reviewing
                        </span>
                      </div>
                      <h3 className="font-bold text-sm mb-1 line-clamp-1">{req.title}</h3>
                      <p className={cn("text-xs", selectedRequest?.id === req.id ? "text-white/60" : "text-black/40")}>
                        By {req.assignedName} • {req.type}
                      </p>
                    </button>
                  ))
                )
              ) : (
                filteredHistory.length === 0 ? (
                  <p className="text-center py-8 text-black/20 text-sm font-medium">No past work found</p>
                ) : (
                  filteredHistory.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all",
                        selectedRequest?.id === req.id 
                          ? "bg-black text-white border-black shadow-lg" 
                          : "bg-white border-black/5 hover:border-black/20"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[10px] font-bold opacity-60">{req.id}</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          Approved
                        </span>
                      </div>
                      <h3 className="font-bold text-sm mb-1 line-clamp-1">{req.title}</h3>
                      <p className={cn("text-xs", selectedRequest?.id === req.id ? "text-white/60" : "text-black/40")}>
                        By {req.assignedName} • {req.verifiedAt}
                      </p>
                    </button>
                  ))
                )
              )}
            </div>
          </div>
        </div>

        {/* Review Workspace */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{selectedRequest.title}</h2>
                  <p className="text-xs text-black/40">Submitted by {selectedRequest.assignedName} on {selectedRequest.completedAt}</p>
                </div>
                <div className="flex gap-2">
                  {selectedRequest.status === 'UNDER_REVIEW' && (
                    <>
                      <button 
                        onClick={() => handleVerify(selectedRequest.id, false)}
                        disabled={isVerifying}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                        title="Reject"
                      >
                        <XCircle size={20} />
                      </button>
                      <button 
                        onClick={() => handleVerify(selectedRequest.id, true)}
                        disabled={isVerifying}
                        className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all"
                        title="Approve"
                      >
                        <CheckCircle size={20} />
                      </button>
                    </>
                  )}
                  {selectedRequest.status === 'APPROVED' && (
                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-2">
                      <CheckCircle size={14} /> Approved
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {isVerifying ? (
                  <div className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-lg font-bold">Running Security Checks...</h3>
                    <p className="text-black/40 text-sm">Scanning for plagiarism and AI-generated content.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="p-4 bg-black/[0.02] rounded-2xl border border-black/5">
                        <div className="flex items-center gap-2 mb-4">
                          <FileSearch size={18} className="text-black/40" />
                          <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Content Preview</h3>
                        </div>
                        <div className="text-sm text-black/70 leading-relaxed h-48 overflow-y-auto pr-2 mb-4">
                          {selectedRequest.workContent}
                        </div>
                        {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                          <div className="pt-4 border-t border-black/5">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Attachments</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedRequest.attachments.map((file, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-white border border-black/5 px-2 py-1 rounded text-[10px] font-medium">
                                  <FileText size={10} />
                                  <span>{file}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600/60 mb-2">Automated Checks</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Plagiarism Scan</span>
                              <span className="text-xs font-bold text-blue-600">Pending Approval</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">AI Content Detection</span>
                              <span className="text-xs font-bold text-blue-600">Pending Approval</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Feedback / Comments</label>
                          <textarea 
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Add rejection reasons or approval notes..."
                            className="w-full h-24 p-4 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-black/5 border-dashed">
              <ShieldCheck className="text-black/10 mb-4" size={64} />
              <h2 className="text-xl font-bold text-black/20">Select a submission to verify</h2>
            </div>
          )}
        </div>
      </div>
    )}

      {/* Add User Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-black/5 flex justify-between items-center bg-black/[0.01]">
                <h2 className="text-2xl font-bold">Add New User</h2>
                <button onClick={() => setIsUserModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-all">
                  <XCircle size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-4 bg-black/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                      required
                    />
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Username</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      placeholder="john_doe"
                      className="w-full pl-10 pr-4 py-4 bg-black/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                      required
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-4 bg-black/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                      required
                    />
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Role</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-4 py-4 bg-black/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none appearance-none"
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff / Employee</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-black/80 transition-all flex items-center justify-center gap-2"
                >
                  Create User Account <UserPlus size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
