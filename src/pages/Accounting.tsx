import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Download, 
  Plus, 
  Search, 
  Filter,
  CreditCard,
  Users,
  Wallet
} from 'lucide-react';
import { cn } from '../lib/utils';
import { RequestStore, AssignmentRequest } from '../lib/requestStore';

export default function Accounting() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses'>('invoices');
  const [requests, setRequests] = useState<AssignmentRequest[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const all = await RequestStore.getRequests();
      setRequests(all);
    } catch (error) {
      console.error("Failed to load accounting data:", error);
    }
  };

  // Map requests to invoices
  const dynamicInvoices = requests.map(r => ({
    id: `INV-${r.id.split('-')[1]}`,
    student: r.studentName,
    amount: r.type === 'PhD Proposal' ? 450.00 : 250.00,
    status: r.isPaid ? 'Paid' : 'Pending',
    date: r.createdAt
  }));

  const expenses = [
    { id: 'EXP-001', type: 'Salary', recipient: 'Jane Staff', amount: 3500.00, date: '2024-02-01' },
    { id: 'EXP-002', type: 'Commission', recipient: 'Mark Agent', amount: 450.00, date: '2024-02-15' },
    { id: 'EXP-003', type: 'Salary', recipient: 'Bob Writer', amount: 2800.00, date: '2024-02-01' },
  ];

  const totalRevenue = dynamicInvoices.reduce((acc, inv) => acc + (inv.status === 'Paid' ? inv.amount : 0), 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Accounting & Finance</h1>
          <p className="text-black/50">Track revenue, expenses, and generate financial reports.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-black/5 text-black px-4 py-2 rounded-xl font-medium hover:bg-black/10 transition-all flex items-center gap-2">
            <Download size={18} /> Export Report
          </button>
          <button className="bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black/80 transition-all">
            <Plus size={20} /> New Entry
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+15.4%</span>
          </div>
          <div className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-1">Total Revenue</div>
          <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">+2.1%</span>
          </div>
          <div className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-1">Total Expenses</div>
          <div className="text-3xl font-bold">${totalExpenses.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-1">Net Profit</div>
          <div className={cn("text-3xl font-bold", netProfit >= 0 ? "text-black" : "text-red-600")}>
            ${netProfit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="border-b border-black/5">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('invoices')}
              className={cn(
                "px-8 py-4 text-sm font-bold transition-all border-b-2",
                activeTab === 'invoices' ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"
              )}
            >
              Student Invoices
            </button>
            <button 
              onClick={() => setActiveTab('expenses')}
              className={cn(
                "px-8 py-4 text-sm font-bold transition-all border-b-2",
                activeTab === 'expenses' ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"
              )}
            >
              Salaries & Commissions
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">
            {activeTab === 'invoices' ? 'Recent Invoices' : 'Expense Log'}
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
          {activeTab === 'invoices' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/[0.02] text-black/40 text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Student</th>
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
                      <td className="px-6 py-4 font-medium text-black">{inv.student}</td>
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
                        <button className="p-2 hover:bg-black/5 rounded-lg transition-all text-black/40 hover:text-black">
                          <Download size={18} />
                        </button>
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
                  <th className="px-6 py-4">Expense ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold">{exp.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {exp.type === 'Salary' ? <Wallet size={14} className="text-blue-500" /> : <Users size={14} className="text-purple-500" />}
                        <span className="text-sm font-medium">{exp.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-black">{exp.recipient}</td>
                    <td className="px-6 py-4 text-red-600 font-bold">-${exp.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-black/60 text-sm">{exp.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-black/5 rounded-lg transition-all text-black/40 hover:text-black">
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
