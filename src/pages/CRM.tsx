import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MoreVertical, 
  Search, 
  Filter,
  TrendingUp,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Lead, LeadStore } from '../lib/requestStore';
import LeadKanban from '../components/LeadKanban';
import LeadModal from '../components/LeadModal';
import { useAuth } from '../context/AuthContext';

export default function CRM() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<Partial<Lead> | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeads();
    loadUsers();
  }, [user]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const filters = user?.role === 'staff' ? { assignedTo: user.id } : {};
      const data = await LeadStore.getLeads(filters);
      setLeads(data);
    } catch (error) {
      console.error("Failed to load leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users?role=staff");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const totalPotential = leads.reduce((sum, l) => sum + (l.potentialIncome || 0), 0);

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">CRM Pipeline</h1>
          <p className="text-black/50">
            {user?.role === 'admin' ? 'Manage all student leads and sales pipeline.' : 'Manage your assigned leads.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-green-100">
            <TrendingUp size={16} /> Potential: ${totalPotential.toLocaleString()}
          </div>
          <button 
            onClick={() => { setSelectedLead(null); setIsLeadModalOpen(true); }}
            className="bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black/80 transition-all"
          >
            <Plus size={20} /> Add Lead
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <LeadKanban 
          leads={leads} 
          onLeadClick={(lead) => { setSelectedLead(lead); setIsLeadModalOpen(true); }}
          onStatusChange={async (id, status) => {
            await LeadStore.updateLead(id, { status });
            loadLeads();
          }}
        />
      )}

      <LeadModal 
        isOpen={isLeadModalOpen}
        lead={selectedLead}
        onClose={() => setIsLeadModalOpen(false)}
        onSave={loadLeads}
        staffUsers={users}
      />
    </div>
  );
}
