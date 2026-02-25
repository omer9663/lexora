import React from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  Globe, 
  DollarSign, 
  User, 
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Lead, LeadStatus } from '../lib/requestStore';
import { cn } from '../lib/utils';

interface LeadKanbanProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

const COLUMNS: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'NEW', label: 'New Leads', color: 'bg-blue-500' },
  { id: 'CONTACTED', label: 'Contacted', color: 'bg-purple-500' },
  { id: 'FOLLOWUP', label: 'Follow Up', color: 'bg-orange-500' },
  { id: 'CONVERTED', label: 'Converted', color: 'bg-green-500' },
  { id: 'LOST', label: 'Lost', color: 'bg-red-500' }
];

export default function LeadKanban({ leads, onLeadClick, onStatusChange }: LeadKanbanProps) {
  const getLeadsByStatus = (status: LeadStatus) => leads.filter(l => l.status === status);

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px] scrollbar-hide">
      {COLUMNS.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", column.color)} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-black/60">{column.label}</h3>
              <span className="text-[10px] font-bold bg-black/5 px-2 py-0.5 rounded-full text-black/40">
                {getLeadsByStatus(column.id).length}
              </span>
            </div>
          </div>

          <div className="space-y-4 min-h-[200px]">
            {getLeadsByStatus(column.id).map((lead) => (
              <motion.div
                key={lead.id}
                layoutId={lead.id}
                onClick={() => onLeadClick(lead)}
                className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md hover:border-black/10 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono font-bold text-black/30">{lead.id}</span>
                  <button className="p-1 hover:bg-black/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal size={14} className="text-black/40" />
                  </button>
                </div>

                <h4 className="font-bold text-black mb-1">{lead.name}</h4>
                <p className="text-xs text-black/40 mb-4 flex items-center gap-1.5">
                  <Globe size={12} /> {lead.country} • {lead.assignmentType}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black/5 rounded-full flex items-center justify-center text-[10px] font-bold text-black/40">
                      {lead.assignedName ? lead.assignedName.charAt(0) : '?'}
                    </div>
                    <span className="text-[10px] font-bold text-black/40">
                      {lead.assignedName || 'Unassigned'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-black flex items-center gap-1">
                    <DollarSign size={12} className="text-green-600" />
                    {lead.potentialIncome.toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", column.color)} 
                      style={{ width: column.id === 'CONVERTED' ? '100%' : column.id === 'LOST' ? '100%' : column.id === 'FOLLOWUP' ? '75%' : column.id === 'CONTACTED' ? '50%' : '25%' }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 pt-4 border-t border-black/5">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onLeadClick(lead); }}
                    className="flex-1 py-2 bg-black/5 hover:bg-black/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                  >
                    <Phone size={12} /> Call
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onLeadClick(lead); }}
                    className="flex-1 py-2 bg-black/5 hover:bg-black/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                  >
                    <Mail size={12} /> Msg
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onLeadClick(lead); }}
                    className="flex-1 py-2 bg-black/5 hover:bg-black/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                  >
                    <Clock size={12} /> Follow
                  </button>
                </div>
              </motion.div>
            ))}

            {getLeadsByStatus(column.id).length === 0 && (
              <div className="h-32 border-2 border-dashed border-black/5 rounded-2xl flex items-center justify-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/10">No leads</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
