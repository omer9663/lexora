import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Menu, X, GraduationCap, LogOut, CreditCard, ShieldCheck, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: GraduationCap, show: true },
    { name: 'Student Portal', path: '/portal', icon: LayoutDashboard, show: user?.role === 'student' },
    { name: 'Staff Dashboard', path: '/staff-dashboard', icon: ClipboardList, show: user?.role === 'staff' },
    { name: 'Admin Panel', path: '/admin-dashboard', icon: ShieldCheck, show: user?.role === 'admin' },
    { name: 'CRM', path: '/crm', icon: Users, show: user?.role === 'staff' || user?.role === 'admin' },
    { name: 'Accounting', path: '/accounting', icon: CreditCard, show: user?.role === 'staff' || user?.role === 'admin' },
    { name: 'Account', path: '/account', icon: UserCircle, show: !!user },
  ];

  const visibleNavItems = navItems.filter(item => item.show);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-black">LEXORA</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-black",
                  location.pathname === item.path ? "text-black" : "text-black/50"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4 border-l border-black/5 pl-8">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-black">{user.name}</span>
                  <span className="text-[10px] text-black/40 uppercase tracking-wider font-bold">{user.role}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-black/40 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-black/5 px-4 pt-2 pb-6"
          >
            <div className="flex flex-col gap-4">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 text-lg font-medium",
                    location.pathname === item.path ? "text-black" : "text-black/50"
                  )}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-4 mt-4 border-t border-black/5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs text-black/40 uppercase tracking-wider">{user.role}</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-xl text-center font-medium flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-black text-white px-4 py-3 rounded-xl text-center font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
