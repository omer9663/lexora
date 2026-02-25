import { motion } from 'motion/react';
import { User, Settings, CreditCard, Bell, Shield, LogOut } from 'lucide-react';

export default function Account() {
  return (
    <div className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-black mb-8">Account Settings</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>
            <div>
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-black/40">Graduate Student • University of Oxford</p>
              <button className="mt-2 text-sm font-bold text-black hover:underline">Change Photo</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                defaultValue="John Doe"
                className="w-full px-4 py-3 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                defaultValue="john.doe@example.com"
                className="w-full px-4 py-3 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
              />
            </div>
          </div>
          <button className="mt-8 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/80 transition-all">
            Save Changes
          </button>
        </div>

        {/* Settings Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:bg-black/[0.02] transition-all text-left">
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center text-black">
              <CreditCard size={20} />
            </div>
            <div>
              <div className="font-bold">Billing & Subscription</div>
              <div className="text-xs text-black/40">Manage your plan and invoices</div>
            </div>
          </button>
          <button className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:bg-black/[0.02] transition-all text-left">
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center text-black">
              <Bell size={20} />
            </div>
            <div>
              <div className="font-bold">Notifications</div>
              <div className="text-xs text-black/40">Configure your alert preferences</div>
            </div>
          </button>
          <button className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:bg-black/[0.02] transition-all text-left">
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center text-black">
              <Shield size={20} />
            </div>
            <div>
              <div className="font-bold">Security</div>
              <div className="text-xs text-black/40">Password and 2FA settings</div>
            </div>
          </button>
          <button className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:bg-red-50 transition-all text-left group">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-100">
              <LogOut size={20} />
            </div>
            <div>
              <div className="font-bold text-red-600">Sign Out</div>
              <div className="text-xs text-red-400">Log out of your account</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
