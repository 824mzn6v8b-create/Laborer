import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, ShieldAlert, DollarSign, HardHat, FileText, Search, Filter, 
  MapPin, CheckSquare, Calendar, ChevronDown, User, Phone, Mail, 
  Settings, Bell, LayoutDashboard, Database, Info, Edit3, Save, X, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { WhistleblowingCase, CaseCategory, CaseStatus, CasePriority } from '../types';
import { getLocalCases, saveLocalCases, updateLocalCaseStatus, CATEGORY_MAP, STATUS_MAP, PRIORITY_MAP } from '../data';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  // Let parent know cases were updated (so other screens reflect updates instantly)
  onCasesUpdated: () => void;
}

export default function AdminDashboard({ onNavigate, onCasesUpdated }: AdminDashboardProps) {
  // Load and local state for cases
  const [cases, setCases] = useState<WhistleblowingCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<WhistleblowingCase | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected row checkboxes
  const [checkedCaseIds, setCheckedCaseIds] = useState<string[]>([]);

  // Editing form inside selected case details
  const [editStatus, setEditStatus] = useState<CaseStatus>('received');
  const [editPriority, setEditPriority] = useState<CasePriority>('medium');
  const [editRemark, setEditRemark] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Initial load
  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = () => {
    setCases(getLocalCases());
  };

  // Synchronize editing states when selectedCase changes
  useEffect(() => {
    if (selectedCase) {
      setEditStatus(selectedCase.status);
      setEditPriority(selectedCase.priority);
      setEditAdminNotes(selectedCase.adminNotes || '');
      setEditRemark(''); // Reset timeline remark
    }
  }, [selectedCase]);

  // Handle Save edits
  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    // Call helper from data.ts to update
    const updated = updateLocalCaseStatus(
      selectedCase.id, 
      editStatus, 
      editRemark.trim() || undefined, 
      editPriority, 
      editAdminNotes.trim() || undefined
    );

    if (updated) {
      loadCases(); // reload list
      setSelectedCase(updated); // update active panel view
      onCasesUpdated(); // notify main App.tsx
      setSuccessToast(`อัปเดตสิทธิและมาตรการของเคส ${selectedCase.id} เรียบร้อยแล้ว!`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  // Toggle checkboxes
  const toggleCheckbox = (caseId: string) => {
    if (checkedCaseIds.includes(caseId)) {
      setCheckedCaseIds(checkedCaseIds.filter(id => id !== caseId));
    } else {
      setCheckedCaseIds([...checkedCaseIds, caseId]);
    }
  };

  const toggleSelectAll = () => {
    const filtered = getFilteredCases();
    const filteredIds = filtered.map(c => c.id);
    const allChecked = filteredIds.every(id => checkedCaseIds.includes(id));

    if (allChecked) {
      setCheckedCaseIds(checkedCaseIds.filter(id => !filteredIds.includes(id)));
    } else {
      // union set
      const newChecked = Array.from(new Set([...checkedCaseIds, ...filteredIds]));
      setCheckedCaseIds(newChecked);
    }
  };

  // Filter cases logic
  const getFilteredCases = () => {
    return cases.filter((c) => {
      // Search text (Business Name or Tracking ID)
      const matchesSearch = 
        c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;

      // Priority filter
      const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  };

  const filteredCasesList = getFilteredCases();

  // Stats calculation
  const totalReportsCount = 1520; // Historical static total
  const inProgressReports = cases.filter(c => c.status === 'verifying' || c.status === 'action_taken').length;
  const criticalReports = cases.filter(c => c.priority === 'high' && c.status !== 'closed').length;

  return (
    <div className="space-y-6 text-left relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 px-6 py-4 bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-3"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-sm font-semibold pr-4">{successToast}</div>
            <button onClick={() => setSuccessToast('')} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Title & Overview banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B] text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/10 text-blue-300 rounded-md text-[10px] font-bold tracking-wider uppercase border border-blue-500/20">
            Admin Access Only
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display">ระบบจัดการหลังบ้าน (Admin Dashboard)</h2>
          <p className="text-slate-400 text-xs">พนักงานตรวจแรงงาน: คุณปิยวัฒน์ ทรัพย์สมบูรณ์ (กลุ่มสืบสวนคดีคุ้มครองสิทธิมนุษยชน)</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadCases}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
          >
            <Database className="w-3.5 h-3.5" />
            รีเฟรชฐานข้อมูล
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total stats */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">สรุปยอดเคสสะสมในระบบ</p>
            <p className="text-2xl font-black text-slate-800 font-mono mt-1">{totalReportsCount + cases.length - 4}</p>
          </div>
          <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
            <LayoutDashboard className="w-5 h-5" />
          </div>
        </div>

        {/* Active tracking cases */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">เคสอยู่ระหว่างการคุ้มครอง</p>
            <p className="text-2xl font-black text-blue-600 font-mono mt-1">{inProgressReports}</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100/40">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* High priority */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">คดีเร่งด่วนขั้นวิกฤต</p>
            <p className="text-2xl font-black text-rose-600 font-mono mt-1">{criticalReports}</p>
          </div>
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 border border-rose-100/40">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Cases Table List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-4 p-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-slate-800 text-lg font-display">รายการเบาะแสที่ได้รับแจ้งเข้ามา</h3>
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="พิมพ์ชื่อสถานประกอบการ หรือ รหัสสืบเพื่อค้นหา..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-slate-300 focus:outline-hidden rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Table filters */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mr-2 uppercase tracking-wide">
              <Filter className="w-3.5 h-3.5" />
              ตัวกรองด่วน:
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <select
                id="admin-category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden appearance-none cursor-pointer"
              >
                <option value="all">ทุกหมวดหมู่ (All Categories)</option>
                {Object.entries(CATEGORY_MAP).map(([key, item]) => (
                  <option key={key} value={key}>{item.label.split('/')[0]}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Priority dropdown */}
            <div className="relative">
              <select
                id="admin-priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden appearance-none cursor-pointer"
              >
                <option value="all">ความเร่งด่วน: ทั้งหมด (All Priority)</option>
                {Object.entries(PRIORITY_MAP).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Status dropdown */}
            <div className="relative">
              <select
                id="admin-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden appearance-none cursor-pointer"
              >
                <option value="all">สถานะคดี: ทั้งหมด (All Statuses)</option>
                {Object.entries(STATUS_MAP).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Cases Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={filteredCasesList.length > 0 && filteredCasesList.every(c => checkedCaseIds.includes(c.id))}
                      className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">ประเภทความผิด (Category)</th>
                  <th className="p-3">สถานะ (Status)</th>
                  <th className="p-3">ความเร่งด่วน (Priority)</th>
                  <th className="p-3">วันที่แจ้ง</th>
                  <th className="p-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCasesList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                      ไม่พบเบาะแสที่ตรงกับเงื่อนไขการค้นหา/ตัวกรอง
                    </td>
                  </tr>
                ) : (
                  filteredCasesList.map((c) => {
                    const isRowSelected = selectedCase?.id === c.id;
                    const catInfo = CATEGORY_MAP[c.category];
                    const statusInfo = STATUS_MAP[c.status];
                    const priorityInfo = PRIORITY_MAP[c.priority];
                    
                    return (
                      <tr 
                        key={c.id} 
                        className={`text-xs hover:bg-slate-50/80 transition-colors ${
                          isRowSelected ? 'bg-blue-50/40 border-l-2 border-blue-600' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={checkedCaseIds.includes(c.id)}
                            onChange={() => toggleCheckbox(c.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* ID */}
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {c.id}
                        </td>

                        {/* Category */}
                        <td className="p-3">
                          <span className="font-semibold text-slate-700 block max-w-[180px] truncate" title={catInfo?.label}>
                            {catInfo?.label?.split('/')[0] || c.category}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">{c.businessName}</span>
                        </td>

                        {/* Status */}
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo?.bg} ${statusInfo?.text}`}>
                            {statusInfo?.label}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityInfo?.bg} ${priorityInfo?.text}`}>
                            {priorityInfo?.label}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="p-3 font-mono text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString('th-TH')}
                        </td>

                        {/* Action */}
                        <td className="p-3 text-right">
                          <button
                            id={`view-details-${c.id}`}
                            onClick={() => setSelectedCase(c)}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            จัดการเคส
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Case Management Panel */}
        <div className="lg:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {selectedCase ? (
              <motion.div
                key="case-editor-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-lg p-5 space-y-5"
              >
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-display">หน้าแผงควบคุมคดีสืบสวน</h3>
                    <p className="text-slate-400 text-[11px] font-mono font-bold mt-0.5">{selectedCase.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Case overview data */}
                <div className="space-y-3 bg-slate-50 p-3 rounded-2xl text-xs border border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">พิกัด GPS</span>
                      <span className="font-mono text-slate-800 text-[10px]">
                        {selectedCase.coordinates.lat}, {selectedCase.coordinates.lng}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">สิทธิรายงานตัวตน</span>
                      <span className="font-semibold text-slate-800">
                        {selectedCase.isAnonymous ? 'ปกปิด (Anonymous)' : 'เปิดเผยนามพยาน'}
                      </span>
                    </div>
                  </div>

                  {!selectedCase.isAnonymous && (
                    <div className="border-t border-slate-200 pt-2 mt-2 space-y-1">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">ข้อมูลผู้แจ้ง:</p>
                      <p className="text-slate-700 font-semibold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {selectedCase.reporterName}
                      </p>
                      {selectedCase.reporterPhone && (
                        <p className="text-slate-600 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {selectedCase.reporterPhone}
                        </p>
                      )}
                      {selectedCase.reporterEmail && (
                        <p className="text-slate-600 flex items-center gap-1.5 overflow-hidden text-ellipsis">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {selectedCase.reporterEmail}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Interactive Triage Editor Form */}
                <form onSubmit={handleSaveEdits} className="space-y-4 text-xs">
                  {/* Select status */}
                  <div>
                    <label htmlFor="admin-status-select" className="block font-bold text-slate-700 mb-1">1. อัปเดตสถานะการสืบสวน (Case Status)</label>
                    <div className="relative">
                      <select
                        id="admin-status-select"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as CaseStatus)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-hidden rounded-xl font-bold text-slate-800 appearance-none cursor-pointer"
                      >
                        {Object.entries(STATUS_MAP).map(([key, item]) => (
                          <option key={key} value={key}>{item.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Select Priority */}
                  <div>
                    <label htmlFor="admin-priority-select" className="block font-bold text-slate-700 mb-1">2. มอบระดับความเร่งด่วน (Priority)</label>
                    <div className="relative">
                      <select
                        id="admin-priority-select"
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as CasePriority)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-hidden rounded-xl font-bold text-slate-800 appearance-none cursor-pointer"
                      >
                        {Object.entries(PRIORITY_MAP).map(([key, item]) => (
                          <option key={key} value={key}>{item.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Status update comment (Adds Timeline event) */}
                  <div>
                    <label htmlFor="admin-remark-input" className="block font-bold text-slate-700 mb-1">
                      3. บันทึกคำอธิบายขั้นตอน / ไทม์ไลน์
                    </label>
                    <textarea
                      id="admin-remark-input"
                      rows={2}
                      value={editRemark}
                      onChange={(e) => setEditRemark(e.target.value)}
                      placeholder="เช่น ออกหมายเรียกพนักงาน ตรวจพบพยานหลักฐานมีมูลสูง หรือ คืนหลักทรัพย์แก่แรงงานเรียบร้อย..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 rounded-xl resize-none"
                    ></textarea>
                    <span className="text-[10px] text-slate-400">คำอธิบายนี้จะถูกนำไปแสดงเป็นขั้นตอนล่าสุดบนไทม์ไลน์ติดตามคดีของผู้ร้องเรียน</span>
                  </div>

                  {/* Direct note message to reporter */}
                  <div>
                    <label htmlFor="admin-direct-notes" className="block font-bold text-slate-700 mb-1">
                      4. ข้อความสื่อสารทางตรงแก่พยาน (Admin Notes)
                    </label>
                    <textarea
                      id="admin-direct-notes"
                      rows={2}
                      value={editAdminNotes}
                      onChange={(e) => setEditAdminNotes(e.target.value)}
                      placeholder="เช่น ข้อมูลของท่านช่วยคนงานได้ 30 คน ทีมกำลังประกบสถานภาพของท่านอย่างลับที่สุด..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 rounded-xl resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    บันทึกข้อมูลและอัปเดตระบบ
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="case-empty-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-3 min-h-[400px] flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">ยังไม่ได้เลือกคดีสืบสวน</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-normal max-w-[200px] mx-auto">
                    คลิกปุ่ม <b>"จัดการเคส"</b> ในรายการซ้ายเพื่อตรวจสอบข้อมูลพยาน พิกัดแผนที่ และเพื่อยื่นคําสั่งทางกฎหมาย
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
