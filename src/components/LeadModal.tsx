import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Phone, 
  Mail, 
  Globe, 
  DollarSign, 
  User, 
  MessageSquare, 
  History,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Lead, LeadLog, LeadStore, LeadStatus } from '../lib/requestStore';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface LeadModalProps {
  lead: Partial<Lead> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  staffUsers: any[];
}

export default function LeadModal({ lead, isOpen, onClose, onSave, staffUsers }: LeadModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    phone: '',
    email: '',
    country: '',
    assignmentType: 'Essay',
    potentialIncome: 0,
    status: 'NEW',
    assignedTo: '',
    assignedName: ''
  });
  const [logs, setLogs] = useState<LeadLog[]>([]);
  const [newLog, setNewLog] = useState({ action: 'NOTE', content: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData(lead);
      if (lead.id) {
        loadLogs(lead.id);
      }
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        country: '',
        assignmentType: 'Essay',
        potentialIncome: 0,
        status: 'NEW',
        assignedTo: '',
        assignedName: ''
      });
      setLogs([]);
    }
  }, [lead]);

  const loadLogs = async (id: string) => {
    try {
      const data = await LeadStore.getLogs(id);
      setLogs(data);
    } catch (error) {
      console.error("Failed to load logs:", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (formData.id) {
        await LeadStore.updateLead(formData.id, formData);
      } else {
        await LeadStore.addLead(formData as any);
      }
      onSave();
      onClose();
    } catch (error) {
      alert("Failed to save lead");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLog = async () => {
    if (!formData.id || !newLog.content) return;
    try {
      await LeadStore.addLog(formData.id, {
        userId: user?.id || '',
        userName: user?.name || '',
        action: newLog.action,
        content: newLog.content
      });
      setNewLog({ action: 'NOTE', content: '' });
      loadLogs(formData.id);
    } catch (error) {
      alert("Failed to add log");
    }
  };

  const statusColors: Record<LeadStatus, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    CONTACTED: 'bg-purple-100 text-purple-700',
    FOLLOWUP: 'bg-orange-100 text-orange-700',
    CONVERTED: 'bg-green-100 text-green-700',
    LOST: 'bg-red-100 text-red-700'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-black/5 flex justify-between items-center bg-black/[0.01]">
            <div>
              <h2 className="text-2xl font-bold">{formData.id ? 'Edit Lead' : 'Add New Lead'}</h2>
              {formData.id && <p className="text-xs text-black/40 font-mono">{formData.id}</p>}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form Section */}
              <form id="lead-form" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                      <input 
                        type="text" 
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Assignment Type</label>
                    <select 
                      value={formData.assignmentType}
                      onChange={(e) => setFormData({...formData, assignmentType: e.target.value})}
                      className="w-full px-4 py-3 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none appearance-none"
                    >
                      <option>Essay</option>
                      <option>PhD Proposal</option>
                      <option>Research Paper</option>
                      <option>Case Study</option>
                      <option>Thesis</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Potential Income ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                      <input 
                        type="number" 
                        value={formData.potentialIncome}
                        onChange={(e) => setFormData({...formData, potentialIncome: parseFloat(e.target.value)})}
                        className="w-full pl-10 pr-4 py-3 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as LeadStatus})}
                      className={cn(
                        "w-full px-4 py-3 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none appearance-none",
                        statusColors[formData.status as LeadStatus]
                      )}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="FOLLOWUP">FOLLOWUP</option>
                      <option value="CONVERTED">CONVERTED</option>
                      <option value="LOST">LOST</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Assigned To</label>
                    <select 
                      value={formData.assignedTo || ''}
                      onChange={(e) => {
                        const selected = staffUsers.find(u => u.id === e.target.value);
                        setFormData({
                          ...formData, 
                          assignedTo: e.target.value,
                          assignedName: selected ? selected.name : ''
                        });
                      }}
                      className="w-full px-4 py-3 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none appearance-none"
                    >
                      <option value="">Unassigned</option>
                      {staffUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>

              {/* Activity Log Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <History size={20} className="text-black/40" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Activity Log</h3>
                </div>

                {formData.id ? (
                  <>
                    <div className="bg-black/[0.02] rounded-2xl p-4 border border-black/5 space-y-4">
                      <div className="flex gap-2">
                        <select 
                          value={newLog.action}
                          onChange={(e) => setNewLog({...newLog, action: e.target.value})}
                          className="px-3 py-2 bg-white border border-black/5 rounded-lg text-xs font-bold outline-none"
                        >
                          <option value="NOTE">NOTE</option>
                          <option value="CALL">CALL</option>
                          <option value="MESSAGE">MESSAGE</option>
                          <option value="FOLLOWUP">FOLLOWUP</option>
                        </select>
                        <input 
                          type="text"
                          value={newLog.content}
                          onChange={(e) => setNewLog({...newLog, content: e.target.value})}
                          placeholder="Add an update..."
                          className="flex-1 px-4 py-2 bg-white border border-black/5 rounded-lg text-xs outline-none"
                        />
                        <button 
                          onClick={handleAddLog}
                          disabled={!newLog.content}
                          className="p-2 bg-black text-white rounded-lg hover:bg-black/80 disabled:opacity-50 transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {logs.length === 0 ? (
                          <p className="text-center py-8 text-black/20 text-xs font-medium">No activity logged yet.</p>
                        ) : (
                          logs.map((log) => (
                            <div key={log.id} className="flex gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                log.action === 'CALL' ? "bg-blue-50 text-blue-600" :
                                log.action === 'MESSAGE' ? "bg-green-50 text-green-600" :
                                log.action === 'FOLLOWUP' ? "bg-orange-50 text-orange-600" :
                                "bg-black/5 text-black/40"
                              )}>
                                {log.action === 'CALL' ? <Phone size={14} /> :
                                 log.action === 'MESSAGE' ? <MessageSquare size={14} /> :
                                 log.action === 'FOLLOWUP' ? <Clock size={14} /> :
                                 <MessageSquare size={14} />}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-xs font-bold">{log.userName}</span>
                                  <span className="text-[10px] text-black/30">{new Date(log.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-black/60 leading-relaxed">{log.content}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center bg-black/[0.01] rounded-2xl border border-dashed border-black/10">
                    <History className="text-black/10 mb-4" size={48} />
                    <p className="text-black/40 text-xs font-medium px-8 text-center">Save the lead first to start logging activities.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-black/5 bg-black/[0.01] flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-white border border-black/10 rounded-xl text-sm font-bold hover:bg-black/5 transition-all"
            >
              Cancel
            </button>
            <button 
              form="lead-form"
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-black/80 transition-all flex items-center gap-2"
            >
              {isSaving ? 'Saving...' : 'Save Lead'} <Save size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
