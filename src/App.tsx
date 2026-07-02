import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, MessageSquareWarning, KeyRound, LayoutDashboard, Menu, X, Users, AlertOctagon } from 'lucide-react';
import LandingPage from './components/LandingPage';
import ReportForm from './components/ReportForm';
import TrackStatus from './components/TrackStatus';
import AdminDashboard from './components/AdminDashboard';
import { getLocalCases, saveLocalCases } from './data';
import { WhistleblowingCase } from './types';

export default function App() {
  // Navigation State: 'landing' | 'report' | 'track' | 'admin'
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prefilled credentials for instant tracking after report submission
  const [prefilledCreds, setPrefilledCreds] = useState<{ id: string; pass: string } | null>(null);

  // Dynamic state for statistics calculation
  const [cases, setCases] = useState<WhistleblowingCase[]>([]);

  // Load initial cases on mount to set stats
  useEffect(() => {
    setCases(getLocalCases());
  }, []);

  // Callback when database is modified in any page
  const handleDatabaseUpdate = () => {
    setCases(getLocalCases());
  };

  // Callback when a report is successfully submitted
  const handleReportSuccess = (caseId: string, passcode: string) => {
    setPrefilledCreds({ id: caseId, pass: passcode });
    handleDatabaseUpdate();
  };

  // Stats calculation
  const getStats = () => {
    const totalCount = 1520 + (cases.length - 4);
    
    // Dynamically calculate resolved % from local storage cases
    const totalLocal = cases.length;
    const closedLocal = cases.filter(c => c.status === 'closed').length;
    
    // Blend with historical 95% baseline
    const resolvedPercent = totalLocal > 0 
      ? Math.round(((closedLocal + 3.8) / (totalLocal + 4)) * 100) 
      : 95;

    return {
      total: totalCount,
      resolvedPercent: resolvedPercent > 100 ? 100 : resolvedPercent,
      speedPercent: 95
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and App Title */}
            <button 
              id="nav-logo-btn"
              onClick={() => { setCurrentPage('landing'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer group text-left"
            >
              <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-600/10 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-[#1E293B] font-display text-sm tracking-tight block">
                  SafeWork System
                </span>
                <span className="text-[10px] text-slate-400 font-bold block -mt-1 uppercase tracking-wider">
                  Whistleblowing Guard
                </span>
              </div>
            </button>

            {/* Desktop Navigation Menu */}
            <nav className="hidden md:flex items-center gap-1.5">
              <button
                id="nav-link-landing"
                onClick={() => setCurrentPage('landing')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === 'landing' 
                    ? 'bg-blue-50 text-blue-600 border border-blue-100/40' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                หน้าแรก (Landing)
              </button>
              <button
                id="nav-link-report"
                onClick={() => setCurrentPage('report')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === 'report' 
                    ? 'bg-blue-50 text-blue-600 border border-blue-100/40' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                แจ้งเบาะแส (Report)
              </button>
              <button
                id="nav-link-track"
                onClick={() => setCurrentPage('track')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === 'track' 
                    ? 'bg-blue-50 text-blue-600 border border-blue-100/40' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                ติดตามสถานะ (Track)
              </button>
              <button
                id="nav-link-admin"
                onClick={() => setCurrentPage('admin')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === 'admin' 
                    ? 'bg-[#1E293B] text-white shadow-md shadow-slate-900/10' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                จัดการหลังบ้าน (Admin)
              </button>
            </nav>

            {/* CTA action or Quick Login */}
            <div className="hidden md:flex items-center gap-3">
              <button
                id="nav-cta-btn"
                onClick={() => {
                  if (currentPage === 'admin') {
                    setCurrentPage('landing');
                  } else {
                    setCurrentPage('admin');
                  }
                }}
                className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {currentPage === 'admin' ? 'ออกจากหน้าแอดมิน' : 'แผงควบคุมเจ้าหน้าที่'}
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-500 hover:text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-1">
                <button
                  onClick={() => { setCurrentPage('landing'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  หน้าแรก (Landing Page)
                </button>
                <button
                  onClick={() => { setCurrentPage('report'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  แจ้งเบาะแสทันที (Report Form)
                </button>
                <button
                  onClick={() => { setCurrentPage('track'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  ติดตามสถานะ (Track Status)
                </button>
                <button
                  onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-[#1E293B] text-white"
                >
                  แผงจัดการหลังบ้าน (Admin Panel)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Stage container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentPage === 'landing' && (
              <LandingPage onNavigate={setCurrentPage} stats={stats} />
            )}
            
            {currentPage === 'report' && (
              <ReportForm onNavigate={setCurrentPage} onSuccess={handleReportSuccess} />
            )}
            
            {currentPage === 'track' && (
              <TrackStatus 
                onNavigate={setCurrentPage} 
                prefilledId={prefilledCreds?.id} 
                prefilledPass={prefilledCreds?.pass} 
              />
            )}
            
            {currentPage === 'admin' && (
              <AdminDashboard onNavigate={setCurrentPage} onCasesUpdated={handleDatabaseUpdate} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Trust Stamp Alert and Footers */}
      <footer className="bg-white border-t border-slate-200 py-10 text-center text-slate-500 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-[10px]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              ความมั่นคงปลอดภัยสูงสุด
            </span>
            <span className="hidden sm:inline text-slate-200">|</span>
            <span className="flex items-center gap-1.5 text-[10px]">
              <Users className="w-4 h-4 text-blue-500" />
              ช่วยเหลือแรงงานพัดถิ่นและแรงงานไทย
            </span>
            <span className="hidden sm:inline text-slate-200">|</span>
            <span className="flex items-center gap-1.5 text-[10px]">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              ศูนย์ป้องกันการค้ามนุษย์ด้านแรงงาน
            </span>
          </div>
          <p className="max-w-xl mx-auto leading-relaxed text-slate-400">
            ความปลอดภัยและความเป็นส่วนตัวของคุณคือภารกิจสำคัญที่สุดของเรา | ระบบดิจิทัลสากลสำหรับการร้องเรียนสิทธิและพยานบุคคล บันทึกข้อมูลและเข้ารหัสเพื่อความปลอดภัยสากล
          </p>
          <div className="pt-2 text-slate-300 font-mono text-[9px]">
            &copy; {new Date().getFullYear()} SafeWork Reporting System. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
