import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  FileSearch
} from 'lucide-react';
import { cn } from '../lib/utils';
import { RequestStore, AssignmentRequest } from '../lib/requestStore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [requests, setRequests] = useState<AssignmentRequest[]>([]);
  const [historyRequests, setHistoryRequests] = useState<AssignmentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AssignmentRequest | null>(null);
  const [comments, setComments] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [staffFilter, setStaffFilter] = useState('');

  useEffect(() => {
    loadRequests();
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
        </div>
      </div>

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
    </div>
  );
}
