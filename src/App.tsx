/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import StudentPortal from './pages/StudentPortal';
import CRM from './pages/CRM';
import Accounting from './pages/Accounting';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Account from './pages/Account';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-black selection:bg-black selection:text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route 
                path="/portal" 
                element={
                  <ProtectedRoute allowedRole="student">
                    <StudentPortal />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/staff-dashboard" 
                element={
                  <ProtectedRoute allowedRole="staff">
                    <StaffDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/crm" 
                element={
                  <ProtectedRoute>
                    <CRM />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/accounting" 
                element={
                  <ProtectedRoute>
                    <Accounting />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          <footer className="mt-32 border-t border-black/5 py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">L</span>
                  </div>
                  <span className="font-bold tracking-tight">LEXORA</span>
                </div>
                <div className="flex gap-8 text-sm text-black/40 font-medium">
                  <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-black transition-colors">Contact Us</a>
                </div>
                <div className="text-sm text-black/40">
                  © 2024 Lexora Academic. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
