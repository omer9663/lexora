import { motion } from 'motion/react';
import { Users, UserPlus, Mail, Phone, MoreVertical, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

const leads = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'New', source: 'Website', date: '2024-02-25' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@university.edu', status: 'Contacted', source: 'Referral', date: '2024-02-24' },
  { id: 3, name: 'Michael Brown', email: 'm.brown@college.ac.uk', status: 'Qualified', source: 'LinkedIn', date: '2024-02-23' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@gmail.com', status: 'Closed', source: 'Website', date: '2024-02-22' },
];

export default function CRM() {
  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">CRM Dashboard</h1>
          <p className="text-black/50">Manage student leads and client relationships.</p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black/80 transition-all">
          <UserPlus size={20} /> Add Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-2">New Leads</div>
          <div className="text-3xl font-bold">128</div>
          <div className="mt-2 text-xs text-green-600 font-medium">+12% from last week</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-2">Qualified</div>
          <div className="text-3xl font-bold">45</div>
          <div className="mt-2 text-xs text-green-600 font-medium">+5% from last week</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-2">Conversion</div>
          <div className="text-3xl font-bold">32%</div>
          <div className="mt-2 text-xs text-red-600 font-medium">-2% from last week</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-2">Revenue</div>
          <div className="text-3xl font-bold">$12.4k</div>
          <div className="mt-2 text-xs text-green-600 font-medium">+18% from last week</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Recent Leads</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={18} />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="pl-10 pr-4 py-2 bg-black/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-black/5 outline-none w-full sm:w-64"
              />
            </div>
            <button className="p-2 bg-black/5 rounded-lg text-black/60 hover:bg-black/10 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/[0.02] text-black/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-black">{lead.name}</span>
                      <span className="text-xs text-black/40">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      lead.status === 'New' ? "bg-blue-100 text-blue-700" :
                      lead.status === 'Contacted' ? "bg-orange-100 text-orange-700" :
                      lead.status === 'Qualified' ? "bg-purple-100 text-purple-700" :
                      "bg-green-100 text-green-700"
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-black/60 text-sm">{lead.source}</td>
                  <td className="px-6 py-4 text-black/60 text-sm">{lead.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-black/5 rounded-lg transition-all text-black/40 hover:text-black">
                        <Mail size={18} />
                      </button>
                      <button className="p-2 hover:bg-black/5 rounded-lg transition-all text-black/40 hover:text-black">
                        <Phone size={18} />
                      </button>
                      <button className="p-2 hover:bg-black/5 rounded-lg transition-all text-black/40 hover:text-black">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
