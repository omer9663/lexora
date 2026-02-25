import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  X,
  Send,
  FileSearch,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { cn } from '../lib/utils';
import { RequestStore, AssignmentRequest } from '../lib/requestStore';
import { useAuth } from '../context/AuthContext';

export default function StudentPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'assignments' | 'invoices'>('assignments');
  const [requests, setRequests] = useState<AssignmentRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AssignmentRequest | null>(null);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', type: 'Essay' });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const all = await RequestStore.getRequests({ studentId: user?.id });
      setRequests(all);
    } catch (error) {
      console.error("Failed to load requests:", error);
    }
  };

  const handlePay = async (requestId: string) => {
    try {
      await RequestStore.markAsPaid(requestId);
      await loadRequests();
      alert('Payment successful! You can now download the full assignment.');
    } catch (error) {
      alert('Payment failed. Please try again.');
    }
  };

  const handleDownload = (request: AssignmentRequest) => {
    if (!request.isPaid) {
      alert('Please complete the payment to download the full assignment.');
      return;
    }
    // Simulate download
    alert(`Downloading full assignment: ${request.title}`);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await RequestStore.addRequest({
        ...newRequest,
        studentId: user?.id || '',
        studentName: user?.name || '',
      });
      setIsModalOpen(false);
      setNewRequest({ title: '', description: '', type: 'Essay' });
      await loadRequests();
    } catch (error) {
      alert('Failed to create request. Please try again.');
    }
  };

  const stats = {
    total: requests.length,
    inProgress: requests.filter(r => r.status !== 'APPROVED').length,
    completed: requests.filter(r => r.status === 'APPROVED').length,
  };

  // Generate dynamic invoices based on requests
  const dynamicInvoices = requests.map(r => ({
    id: `INV-${r.id.split('-')[1]}`,
    requestId: r.id,
    amount: r.type === 'PhD Proposal' ? 450.00 : 250.00,
    status: r.isPaid ? 'Paid' : 'Pending',
    date: r.createdAt,
    description: r.title
  }));

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Student Portal</h1>
          <p className="text-black/50">Manage your assignments and academic projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black/80 transition-all"
        >
          <Plus size={20} /> New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <FileText size={20} />
            </div>
            <span className="text-sm font-semibold text-black/40 uppercase tracking-wider">Total Projects</span>
          </div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-sm font-semibold text-black/40 uppercase tracking-wider">Active Tasks</span>
          </div>
          <div className="text-3xl font-bold">{stats.inProgress}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
            <span className="text-sm font-semibold text-black/40 uppercase tracking-wider">Approved</span>
          </div>
          <div className="text-3xl font-bold">{stats.completed}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="border-b border-black/5">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('assignments')}
              className={cn(
                "px-8 py-4 text-sm font-bold transition-all border-b-2",
                activeTab === 'assignments' ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"
              )}
            >
              My Assignments
            </button>
            <button 
              onClick={() => setActiveTab('invoices')}
              className={cn(
                "px-8 py-4 text-sm font-bold transition-all border-b-2",
                activeTab === 'invoices' ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"
              )}
            >
              My Invoices
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">
            {activeTab === 'assignments' ? 'Recent Assignments' : 'Your Invoices'}
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-black/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-black/5 outline-none w-full sm:w-64"
              />
            </div>
            <button className="p-2 bg-black/5 rounded-lg text-black/60 hover:bg-black/10 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'assignments' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/[0.02] text-black/40 text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-black/20 font-medium">No requests found. Start by creating a new request.</td>
                  </tr>
                ) : (
                  requests.map((item) => (
                    <tr key={item.id} className="hover:bg-black/[0.01] transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold">{item.id}</td>
                      <td className="px-6 py-4 font-medium text-black">
                        <div>{item.title}</div>
                        <div className="text-[10px] text-black/40 uppercase tracking-wider font-bold">{item.type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          item.status === 'APPROVED' ? "bg-green-100 text-green-700" :
                          item.status === 'REJECTED' ? "bg-red-100 text-red-700" :
                          item.status === 'UNDER_REVIEW' ? "bg-purple-100 text-purple-700" :
                          "bg-blue-100 text-blue-700"
                        )}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-black/60 text-sm">{item.createdAt}</td>
                      <td className="px-6 py-4 text-right">
                        {item.status === 'APPROVED' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleDownload(item)}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                item.isPaid ? "bg-black text-white hover:bg-black/80" : "bg-black/5 text-black/40 cursor-not-allowed"
                              )}
                              title={item.isPaid ? "Download Report" : "Payment Required to Download"}
                            >
                              <Download size={14} />
                            </button>
                            <button 
                              onClick={() => { setSelectedRequest(item); setIsPreviewOpen(true); }}
                              className="p-2 bg-black/5 text-black rounded-lg hover:bg-black/10 transition-all" 
                              title="Preview"
                            >
                              <FileSearch size={14} />
                            </button>
                          </div>
                        ) : (
                          <button className="text-sm font-bold text-black hover:underline">Details</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/[0.02] text-black/40 text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {dynamicInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-black/20 font-medium">No invoices found.</td>
                  </tr>
                ) : (
                  dynamicInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-black/[0.01] transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold">{inv.id}</td>
                      <td className="px-6 py-4 text-black/60 text-sm">{inv.description}</td>
                      <td className="px-6 py-4 text-black font-bold">${inv.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          inv.status === 'Paid' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-black/60 text-sm">{inv.date}</td>
                      <td className="px-6 py-4 text-right">
                        {inv.status === 'Pending' ? (
                          <button 
                            onClick={() => handlePay(inv.requestId)}
                            className="px-3 py-1.5 bg-black text-white rounded-lg text-xs font-bold hover:bg-black/80 transition-all"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button className="p-2 hover:bg-black/5 rounded-lg transition-all text-black/40 hover:text-black">
                            <Download size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-2xl font-bold">New Assignment Request</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateRequest} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Assignment Title</label>
                  <input 
                    type="text" 
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                    placeholder="e.g. Machine Learning Ethics Essay"
                    className="w-full px-4 py-4 bg-black/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Type</label>
                  <select 
                    value={newRequest.type}
                    onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                    className="w-full px-4 py-4 bg-black/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none appearance-none"
                  >
                    <option>Essay</option>
                    <option>PhD Proposal</option>
                    <option>Research Paper</option>
                    <option>Case Study</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Description & Requirements</label>
                  <textarea 
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    placeholder="Detail your requirements, word count, and specific guidelines..."
                    className="w-full h-32 px-4 py-4 bg-black/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none resize-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-black/80 transition-all flex items-center justify-center gap-2"
                >
                  Submit Request <Send size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-black/5 flex justify-between items-center bg-black/[0.01]">
                <div>
                  <h2 className="text-2xl font-bold">{selectedRequest.title}</h2>
                  <p className="text-sm text-black/40">Assignment Preview • {selectedRequest.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  {!selectedRequest.isPaid && (
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-xl text-xs font-bold border border-orange-100">
                      <AlertCircle size={14} /> Payment Required for Full Access
                    </div>
                  )}
                  <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-all">
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 relative">
                {/* Watermark Overlay */}
                {!selectedRequest.isPaid && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03] select-none rotate-[-30deg]">
                    <div className="text-[200px] font-black tracking-tighter whitespace-nowrap">
                      LEXORA LEXORA LEXORA
                    </div>
                  </div>
                )}
                
                <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-black/80 leading-relaxed font-serif text-lg">
                      {selectedRequest.workContent}
                    </div>
                  </div>
                  
                  {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                    <div className="pt-8 border-t border-black/5">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-4">Attachments</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedRequest.attachments.map((file, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl border border-black/5">
                            <div className="flex items-center gap-3">
                              <FileText className="text-black/40" size={20} />
                              <span className="text-sm font-medium">{file}</span>
                            </div>
                            {selectedRequest.isPaid ? (
                              <button className="p-2 hover:bg-black/10 rounded-lg transition-all">
                                <Download size={16} />
                              </button>
                            ) : (
                              <Clock size={16} className="text-black/20" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 border-t border-black/5 bg-black/[0.01] flex justify-between items-center">
                <div className="text-sm text-black/40">
                  {selectedRequest.isPaid ? 'Full access granted.' : 'Preview mode enabled.'}
                </div>
                <div className="flex gap-3">
                  {!selectedRequest.isPaid && (
                    <button 
                      onClick={() => { setIsPreviewOpen(false); setActiveTab('invoices'); }}
                      className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-black/80 transition-all flex items-center gap-2"
                    >
                      Pay to Unlock <CreditCard size={18} />
                    </button>
                  )}
                  {selectedRequest.isPaid && (
                    <button 
                      onClick={() => handleDownload(selectedRequest)}
                      className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-black/80 transition-all flex items-center gap-2"
                    >
                      Download Full Assignment <Download size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
