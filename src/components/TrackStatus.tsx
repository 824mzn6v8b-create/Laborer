import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, KeyRound, Eye, EyeOff, CheckCircle2, Circle, AlertCircle, ArrowRight, Clipboard, LogOut, ChevronRight, FileText, MapPin, Map, Building2, User } from 'lucide-react';
import { WhistleblowingCase } from '../types';
import { getLocalCases, CATEGORY_MAP, STATUS_MAP } from '../data';

interface TrackStatusProps {
  onNavigate: (page: string) => void;
  prefilledId?: string;
  prefilledPass?: string;
}

export default function TrackStatus({ onNavigate, prefilledId = '', prefilledPass = '' }: TrackStatusProps) {
  // Login State
  const [trackingId, setTrackingId] = useState(prefilledId);
  const [password, setPassword] = useState(prefilledPass);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Logged-in Case State
  const [activeCase, setActiveCase] = useState<WhistleblowingCase | null>(null);

  // Prefill check on mount
  useEffect(() => {
    if (prefilledId && prefilledPass) {
      setTrackingId(prefilledId);
      setPassword(prefilledPass);
      handleLogin(null, prefilledId, prefilledPass);
    }
  }, [prefilledId, prefilledPass]);

  // Handle Login action
  const handleLogin = (e: React.FormEvent | null, idToUse?: string, passToUse?: string) => {
    if (e) e.preventDefault();
    
    const id = idToUse || trackingId.trim();
    const pass = passToUse || password.trim();

    if (!id || !pass) {
      setLoginError('กรุณากรอกรหัสสืบและรหัสผ่านเพื่อตรวจสอบสถานะ');
      return;
    }

    const cases = getLocalCases();
    const matchedCase = cases.find(
      c => c.id.toLowerCase() === id.toLowerCase() && c.password === pass
    );

    if (matchedCase) {
      setActiveCase(matchedCase);
      setLoginError('');
    } else {
      setLoginError('ไม่พบรหัสสืบค้น หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบข้อมูล');
    }
  };

  // Logout
  const handleLogout = () => {
    setActiveCase(null);
    setTrackingId('');
    setPassword('');
  };

  // Determine Timeline classes
  const getTimelineStepStatus = (itemStep: number, activeStatusStep: number) => {
    if (itemStep < activeStatusStep) return 'completed';
    if (itemStep === activeStatusStep) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <AnimatePresence mode="wait">
        {!activeCase ? (
          /* SECTION A: SECURE LOGIN FORM */
          <motion.div
            key="login-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-10 max-w-md mx-auto space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100/50">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">ระบบติดตามสถานะคดี</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                กรอกรหัสแจ้งเบาะแส (Tracking ID) และรหัสความปลอดภัยที่ได้รับเพื่อดูผลคดีของท่าน
              </p>
            </div>

            <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label htmlFor="tracking-id-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">รหัสสืบ (Tracking ID)</label>
                <input
                  id="tracking-id-input"
                  type="text"
                  placeholder="เช่น CASE-492015"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="mt-1.5 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm font-mono font-bold"
                />
              </div>

              <div className="relative">
                <label htmlFor="tracking-password-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">รหัสผ่าน (Password)</label>
                <div className="relative mt-1.5">
                  <input
                    id="tracking-password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="รหัสผ่านตัวเลข 6 หลัก"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="track-login-btn"
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                เข้าสู่ระบบตรวจสอบข้อมูล
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">ยังไม่ได้แจ้งเบาะแส?</span>
              <button
                onClick={() => onNavigate('report')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer mt-1 hover:underline"
              >
                คลิกที่นี่เพื่อไปฟอร์มส่งข้อมูลด่วน
              </button>
            </div>
          </motion.div>
        ) : (
          /* SECTION B: DETAILED STATUS TIMELINE & DETAILS */
          <motion.div
            key="status-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-mono font-bold">
                  ID
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    {activeCase.id}
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-md border border-blue-100 uppercase font-mono">CONFIDENTIAL</span>
                  </h3>
                  <p className="text-slate-400 text-xs">แจ้งเมื่อ: {new Date(activeCase.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                ออกจากระบบติดตาม
              </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Interactive Status Timeline */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">ไทม์ไลน์ติดตามสถานะ (Timeline ติดตามสถานะ)</h3>
                  <p className="text-slate-400 text-xs mt-0.5">การอัปเดตกระบวนการสืบสวนและมาตรการของเจ้าหน้าที่ต่อสถานประกอบการ</p>
                </div>

                {/* Timeline Visual Progress */}
                <div className="relative pl-6 border-l-2 border-slate-100 ml-3 space-y-8 py-2">
                  
                  {/* Step 1: รับเรื่อง (Received) */}
                  {(() => {
                    const stepStatus = getTimelineStepStatus(1, STATUS_MAP[activeCase.status].step);
                    const event = activeCase.timeline.find(t => t.status === 'received');
                    return (
                      <div className="relative">
                        {/* Bullet Marker */}
                        <div className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 ${
                          stepStatus === 'completed' || stepStatus === 'active'
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>

                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800">1. รับเรื่อง (Received)</span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-semibold rounded-md border border-emerald-100">Green Check</span>
                          </div>
                          <p className="text-slate-400 text-[10px] font-mono">
                            {event ? new Date(event.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'รอดำเนินการ'}
                          </p>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            {event ? event.description : 'ยื่นข้อมูลเบาะแสข้อเท็จจริงเข้าสู่ระบบตรวจสอบของพนักงานตรวจแรงงานแล้ว'}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Step 2: ตรวจสอบ (Verifying) */}
                  {(() => {
                    const stepStatus = getTimelineStepStatus(2, STATUS_MAP[activeCase.status].step);
                    const event = activeCase.timeline.find(t => t.status === 'verifying');
                    return (
                      <div className="relative">
                        {/* Bullet Marker */}
                        <div className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 ${
                          stepStatus === 'completed'
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : stepStatus === 'active'
                            ? 'bg-amber-400 border-amber-400 text-white animate-pulse'
                            : 'bg-white border-slate-200 text-slate-300'
                        }`}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>

                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${stepStatus === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                              2. ตรวจสอบ (In Progress)
                            </span>
                            {stepStatus === 'active' && (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-semibold rounded-md border border-amber-100">กำลังสืบสวน</span>
                            )}
                          </div>
                          {event && (
                            <p className="text-slate-400 text-[10px] font-mono">
                              {new Date(event.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                          <p className={`text-xs leading-relaxed ${stepStatus === 'pending' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {event ? event.description : 'พนักงานเจ้าหน้าที่วิเคราะห์หลักฐานและจัดเตรียมกําลังลงพื้นที่ตรวจสอบพฤติการณ์ความผิดปกติ'}
                          </p>
                          {event?.remark && (
                            <div className="p-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-amber-900 text-xs mt-1">
                              <b>หมายเหตุเจ้าหน้าที่:</b> {event.remark}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Step 3: ดำเนินการ (Action Taken) */}
                  {(() => {
                    const stepStatus = getTimelineStepStatus(3, STATUS_MAP[activeCase.status].step);
                    const event = activeCase.timeline.find(t => t.status === 'action_taken');
                    return (
                      <div className="relative">
                        {/* Bullet Marker */}
                        <div className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 ${
                          stepStatus === 'completed'
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : stepStatus === 'active'
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-white border-slate-200 text-slate-300'
                        }`}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>

                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${stepStatus === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                              3. ดำเนินการ (Action Taken)
                            </span>
                            {stepStatus === 'active' && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-semibold rounded-md border border-blue-100">ออกคำสั่งการ</span>
                            )}
                          </div>
                          {event && (
                            <p className="text-slate-400 text-[10px] font-mono">
                              {new Date(event.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                          <p className={`text-xs leading-relaxed ${stepStatus === 'pending' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {event ? event.description : 'บังคับใช้มาตรการทางกฎหมาย ออกคําเตือน สั่งปรับคดี หรือส่งเรื่องดำเนินคดีอาญาการละเมิดสิทธิมนุษยชน'}
                          </p>
                          {event?.remark && (
                            <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-900 text-xs mt-1">
                              <b>มาตรการเชิงกฎหมาย:</b> {event.remark}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Step 4: ปิดเคส (Closed) */}
                  {(() => {
                    const stepStatus = getTimelineStepStatus(4, STATUS_MAP[activeCase.status].step);
                    const event = activeCase.timeline.find(t => t.status === 'closed');
                    return (
                      <div className="relative">
                        {/* Bullet Marker */}
                        <div className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 ${
                          stepStatus === 'active'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-white border-slate-200 text-slate-300'
                        }`}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>

                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${stepStatus !== 'active' ? 'text-slate-400' : 'text-emerald-700 font-extrabold'}`}>
                              4. ปิดเคส (Closed Case)
                            </span>
                            {stepStatus === 'active' && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-semibold rounded-md border border-emerald-100">เสร็จสิ้นสมบูรณ์</span>
                            )}
                          </div>
                          {event && (
                            <p className="text-slate-400 text-[10px] font-mono">
                              {new Date(event.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                          <p className={`text-xs leading-relaxed ${stepStatus !== 'active' ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                            {event ? event.description : 'ผู้ประกอบการปรับปรุงสภาพแวดล้อม หรือชำระส่วนที่ขาดทั้งหมดเสร็จสิ้น และการคุ้มครองพยานพ้นภัยอันตราย'}
                          </p>
                          {event?.remark && (
                            <div className="p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 text-xs mt-1">
                              <b>สรุปปิดเคส:</b> {event.remark}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>

              {/* Right Column: Case Report Summary Card */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Status Indicator Banner */}
                <div className={`p-4 rounded-3xl border text-center space-y-1.5 ${
                  activeCase.status === 'closed'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-900'
                    : activeCase.status === 'action_taken'
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-900'
                    : activeCase.status === 'verifying'
                    ? 'bg-amber-50 border-amber-100 text-amber-900'
                    : 'bg-blue-50 border-blue-100 text-blue-900'
                }`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">สถานะคดีปัจจุบัน (Current Status)</p>
                  <p className="text-xl font-black font-display">{STATUS_MAP[activeCase.status].label}</p>
                  <p className="text-[10px] leading-relaxed opacity-80">
                    {activeCase.status === 'closed' 
                      ? 'สิทธิแรงงานของท่านได้รับการเยียวยาและคุ้มครองอย่างสมบูรณ์แล้ว' 
                      : 'เจ้าหน้าที่กำลังเร่งผลักดันตามมาตรการคุ้มครองสิทธิ์ทางกฎหมาย'}
                  </p>
                </div>

                {/* Case Metadata Details */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-left">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">สรุปข้อมูลรายละเอียดเรื่องร้องเรียน</h4>
                  
                  <div className="space-y-3">
                    {/* Category */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">หมวดหมู่เบาะแส</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {CATEGORY_MAP[activeCase.category]?.label || activeCase.category}
                      </span>
                    </div>

                    {/* Business Name */}
                    <div className="flex items-start gap-2.5">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">ชื่อธุรกิจ/สถานประกอบการ</span>
                        <span className="text-xs font-semibold text-slate-800">{activeCase.businessName}</span>
                      </div>
                    </div>

                    {/* Location Desc */}
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">ที่อยู่ตามรับแจ้ง</span>
                        <span className="text-xs text-slate-600 leading-relaxed block">{activeCase.locationDesc}</span>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">GPS: {activeCase.coordinates.lat}, {activeCase.coordinates.lng}</span>
                      </div>
                    </div>

                    {/* Anonymous identity */}
                    <div className="flex items-start gap-2.5">
                      <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">ตัวตนผู้แจ้งเบาะแส</span>
                        <span className="text-xs font-semibold text-slate-800">
                          {activeCase.isAnonymous ? '✓ ปกปิดตัวตนเป็นความลับ (Anonymous)' : `เปิดเผยตัวตนเพื่อร่วมนำจับ (${activeCase.reporterName})`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Attachments Panel */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3 text-left">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">หลักฐานที่ใช้สืบ ({activeCase.evidence.length})</h4>
                  
                  {activeCase.evidence.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-2">ไม่มีไฟล์หลักฐานแนบมาด้วย</p>
                  ) : (
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                      {activeCase.evidence.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                          <span className="font-medium text-slate-700 truncate max-w-[150px]">{file.name}</span>
                          <span className="text-[10px] text-slate-400">{file.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin notes overall */}
                {activeCase.adminNotes && (
                  <div className="bg-blue-50/40 p-4 rounded-3xl border border-dashed border-blue-200 text-left space-y-1.5">
                    <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      ข้อความสื่อสารโดยตรงจากพนักงานสอบสวน:
                    </p>
                    <p className="text-xs text-blue-950 leading-relaxed font-medium">
                      "{activeCase.adminNotes}"
                    </p>
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
