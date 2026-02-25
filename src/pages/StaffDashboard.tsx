import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search, 
  Filter,
  ArrowRight,
  Send,
  MessageSquare,
  Plus,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { RequestStore, AssignmentRequest } from '../lib/requestStore';
import { useAuth } from '../context/AuthContext';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AssignmentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AssignmentRequest | null>(null);
  const [workContent, setWorkContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRequests();
  }, [user]);

  const loadRequests = async () => {
    if (!user?.id) return;
    try {
      const all = await RequestStore.getRequests();
      // Staff sees requests assigned to them or pending assignment
      setRequests(all.filter(r => r.assignedTo === user.id || r.status === 'PENDING_ASSIGNMENT' || r.status === 'REJECTED'));
    } catch (error) {
      console.error("Failed to load requests:", error);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((f: any) => f.name);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAssign = async (id: string) => {
    try {
      await RequestStore.updateRequest(id, { 
        assignedTo: user?.id, 
        assignedName: user?.name,
        status: 'IN_PROGRESS' 
      });
      await loadRequests();
    } catch (error) {
      alert("Failed to claim task.");
    }
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    
    try {
      await RequestStore.updateRequest(selectedRequest.id, {
        workContent,
        attachments,
        status: 'UNDER_REVIEW',
        completedAt: new Date().toISOString().split('T')[0]
      });
      
      setSelectedRequest(null);
      setWorkContent('');
      setAttachments([]);
      await loadRequests();
    } catch (error) {
      alert("Failed to submit work.");
    }
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Staff Dashboard</h1>
          <p className="text-black/50">Manage and complete assigned academic tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={16} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-black/5 outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredRequests.map((req) => (
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
                  <span className={cn(
                    "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                    req.status === 'PENDING_ASSIGNMENT' ? "bg-orange-100 text-orange-700" :
                    req.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-700" :
                    req.status === 'REJECTED' ? "bg-red-100 text-red-700" :
                    "bg-green-100 text-green-700"
                  )}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-sm mb-1 line-clamp-1">{req.title}</h3>
                <p className={cn("text-xs mb-3", selectedRequest?.id === req.id ? "text-white/60" : "text-black/40")}>
                  {req.type} • {req.studentName}
                </p>
                {req.status === 'PENDING_ASSIGNMENT' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAssign(req.id); }}
                    className="w-full py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-white/90 transition-all"
                  >
                    Claim Task
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 bg-black/[0.01]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{selectedRequest.title}</h2>
                  <span className="text-xs font-mono bg-black/5 px-3 py-1 rounded-full">{selectedRequest.id}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-black/40 uppercase font-bold block mb-1">Student</span>
                    <span className="font-medium">{selectedRequest.studentName}</span>
                  </div>
                  <div>
                    <span className="text-black/40 uppercase font-bold block mb-1">Type</span>
                    <span className="font-medium">{selectedRequest.type}</span>
                  </div>
                  <div>
                    <span className="text-black/40 uppercase font-bold block mb-1">Created</span>
                    <span className="font-medium">{selectedRequest.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-black/40 uppercase font-bold block mb-1">Status</span>
                    <span className="font-medium">{selectedRequest.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-3">Description</h3>
                  <p className="text-sm text-black/70 leading-relaxed bg-black/[0.02] p-4 rounded-xl">
                    {selectedRequest.description}
                  </p>
                </div>

                {selectedRequest.comments && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <MessageSquare size={16} />
                      <h3 className="text-sm font-bold">Admin Feedback</h3>
                    </div>
                    <p className="text-sm text-red-700">{selectedRequest.comments}</p>
                  </div>
                )}

                {selectedRequest.status === 'IN_PROGRESS' || selectedRequest.status === 'REJECTED' ? (
                  <form onSubmit={handleSubmitWork}>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-3">Your Work</h3>
                    <textarea 
                      value={workContent}
                      onChange={(e) => setWorkContent(e.target.value)}
                      placeholder="Start writing the academic content here..."
                      className="w-full h-64 p-4 bg-black/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none mb-6 resize-none"
                      required
                    />

                    <div className="mb-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-3">Attachments</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-lg text-xs font-medium">
                            <span>{file}</span>
                            <button type="button" onClick={() => removeAttachment(index)} className="text-black/40 hover:text-red-500">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 hover:bg-black/10 rounded-xl text-xs font-bold cursor-pointer transition-all">
                        <Plus size={14} /> Upload File
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-black/80 transition-all flex items-center gap-2"
                      >
                        Submit for Verification <Send size={18} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12 bg-black/[0.01] rounded-2xl border border-dashed border-black/10">
                    <CheckCircle className="mx-auto text-black/20 mb-4" size={48} />
                    <p className="text-black/40 font-medium">Work submitted and awaiting review.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-black/5 border-dashed">
              <ClipboardList className="text-black/10 mb-4" size={64} />
              <h2 className="text-xl font-bold text-black/20">Select a request to start working</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
