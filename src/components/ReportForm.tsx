import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, ShieldAlert, HardHat, Users, MapPin, Upload, Eye, EyeOff, Lock, CheckCircle2, Copy, ArrowLeft, Trash2, FileText, Camera, Video, AlertCircle } from 'lucide-react';
import { CaseCategory, EvidenceFile } from '../types';
import { CATEGORY_MAP, addLocalCase, generateTrackingId, generatePassword } from '../data';

interface ReportFormProps {
  onNavigate: (page: string) => void;
  onSuccess: (caseId: string, passcode: string) => void;
}

export default function ReportForm({ onNavigate, onSuccess }: ReportFormProps) {
  // Form State
  const [category, setCategory] = useState<CaseCategory | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  
  // Interactive simulated map coordinates
  const [coordinates, setCoordinates] = useState({ lat: 13.7563, lng: 100.5018 }); // Default Bangkok
  const [mapClicked, setMapClicked] = useState(false);

  // Evidence Files State
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [mockFileName, setMockFileName] = useState('');
  const [mockFileType, setMockFileType] = useState<'photo' | 'video' | 'document'>('photo');

  // Identity Settings
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isConfidential, setIsConfidential] = useState(true);
  
  // Reporter info (only shown if not anonymous)
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');

  // Error & Status State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Receipt Modal
  const [successData, setSuccessData] = useState<{ id: string; pass: string } | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Simulated Map Click Handler
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click position to simulated Bangkok coordinates
    const lat = 13.7563 + ((rect.height / 2 - y) / rect.height) * 0.15;
    const lng = 100.5018 + ((x - rect.width / 2) / rect.width) * 0.15;
    
    setCoordinates({ 
      lat: parseFloat(lat.toFixed(5)), 
      lng: parseFloat(lng.toFixed(5)) 
    });
    setMapClicked(true);
  };

  // Add Evidence File Helper
  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockFileName.trim()) return;

    let extension = '.jpg';
    if (mockFileType === 'video') extension = '.mp4';
    if (mockFileType === 'document') extension = '.pdf';

    const fullFileName = mockFileName.endsWith(extension) 
      ? mockFileName 
      : `${mockFileName}${extension}`;

    const size = `${(Math.random() * 5 + 0.5).toFixed(1)} MB`;

    const newFile: EvidenceFile = {
      id: `ev-${Math.floor(1000 + Math.random() * 9000)}`,
      name: fullFileName,
      type: mockFileType,
      size
    };

    setEvidenceFiles([...evidenceFiles, newFile]);
    setMockFileName('');
  };

  // Preset sample evidence injectors
  const injectSampleEvidence = (name: string, type: 'photo' | 'video' | 'document', size: string) => {
    const newFile: EvidenceFile = {
      id: `ev-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      type,
      size
    };
    if (!evidenceFiles.some(f => f.name === name)) {
      setEvidenceFiles([...evidenceFiles, newFile]);
    }
  };

  const removeEvidence = (id: string) => {
    setEvidenceFiles(evidenceFiles.filter(f => f.id !== id));
  };

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!category) {
      newErrors.category = 'กรุณาเลือกประเภทการเอาเปรียบแรงงาน';
    }
    if (!businessName.trim()) {
      newErrors.businessName = 'กรุณากรอกชื่อสถานประกอบการหรือร้านค้า';
    }
    if (!locationDesc.trim()) {
      newErrors.locationDesc = 'กรุณากรอกที่อยู่หรือจุดสังเกตเพื่อช่วยให้เจ้าหน้าที่ลงพื้นที่';
    }
    if (!isAnonymous) {
      if (!reporterName.trim()) {
        newErrors.reporterName = 'กรุณากรอกชื่อ-นามสกุลจริงของผู้แจ้ง';
      }
      if (!reporterPhone.trim()) {
        newErrors.reporterPhone = 'กรุณากรอกเบอร์โทรศัพท์ติดต่อกลับ';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Simulate database insertion lag
    setTimeout(() => {
      const trackingId = generateTrackingId();
      const password = generatePassword();

      const newCaseData = {
        id: trackingId,
        password,
        category: category!,
        businessName,
        locationDesc,
        coordinates,
        evidence: evidenceFiles,
        isAnonymous,
        isConfidential,
        ...(isAnonymous ? {} : { reporterName, reporterPhone, reporterEmail })
      };

      addLocalCase(newCaseData);
      setSuccessData({ id: trackingId, pass: password });
      setIsSubmitting(false);
    }, 1200);
  };

  const copyToClipboard = (text: string, type: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <button
        onClick={() => onNavigate('landing')}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        กลับหน้าแรก
      </button>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-10 space-y-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-950 font-display">แบบฟอร์มรายงานการเอาเปรียบแรงงาน</h2>
          <p className="text-slate-500 text-sm mt-1">ข้อมูลของท่านจะได้รับการปกป้องสูงสุดตามมาตรฐานความปลอดภัยและความเป็นส่วนตัว</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* STEP 1: Choose Category */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm font-mono shrink-0">1</span>
              <h3 className="text-lg font-bold text-slate-800">เลือกประเภทความผิดปกติหรือการเอาเปรียบแรงงาน</h3>
            </div>
            
            {errors.category && (
              <p className="text-red-500 text-xs flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.category}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(CATEGORY_MAP).map(([key, item]) => {
                const isSelected = category === key;
                const CatIcon = key === 'wage' ? DollarSign : key === 'forced_labor' ? ShieldAlert : key === 'safety' ? HardHat : Users;
                
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setCategory(key as CaseCategory);
                      setErrors(prev => ({ ...prev, category: '' }));
                    }}
                    className={`group text-left p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/20 shadow-sm ring-2 ring-blue-500/20' 
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <CatIcon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 group-hover:text-blue-950 transition-colors text-sm">
                        {item.label}
                      </p>
                      <p className="text-slate-500 text-xs leading-normal">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* STEP 2: Location Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm font-mono shrink-0">2</span>
              <h3 className="text-lg font-bold text-slate-800">ระบุตำแหน่งสถานที่และสถานประกอบการ</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Map & GPS Pinning */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">พิกัดแผนที่ (Simulated GPS with Map)</label>
                
                {/* Visual interactive simulated map container */}
                <div 
                  onClick={handleMapClick}
                  className="relative w-full aspect-video rounded-2xl bg-sky-50 border border-slate-200 overflow-hidden cursor-crosshair group shadow-inner"
                  title="คลิกบนแผนที่สมมติเพื่อวางพิกัด GPS"
                >
                  {/* Grid Lines for tech map design */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
                  
                  {/* Mock Map Features */}
                  <div className="absolute top-4 left-6 px-3 py-1 bg-white/95 backdrop-blur-xs rounded-lg text-[10px] font-bold text-slate-600 border border-slate-200 shadow-xs uppercase">
                    Bangkok Metro Area Grid
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-2 rounded-xl text-[10px] text-slate-500 border border-slate-200 shadow-xs flex justify-between items-center">
                    <span>พิกัด: {coordinates.lat}, {coordinates.lng}</span>
                    <span className="text-emerald-600 font-semibold">{mapClicked ? '✓ วางหมุดพิกัดแล้ว' : '✦ คลิกเพื่อเลือกพิกัด'}</span>
                  </div>

                  {/* Simulated Rivers / Roads */}
                  <div className="absolute top-[40%] left-0 w-full h-3 bg-blue-100 -rotate-12 opacity-80"></div>
                  <div className="absolute top-0 left-[60%] w-4 h-full bg-slate-200/50 -rotate-45 opacity-50"></div>

                  {/* Red Pulse Pin Marker */}
                  <div 
                    className="absolute transition-all duration-300"
                    style={{ 
                      left: mapClicked ? '50%' : '35%', 
                      top: mapClicked ? '50%' : '45%',
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    <div className="relative flex flex-col items-center">
                      <MapPin className="w-8 h-8 text-red-600 fill-red-100 filter drop-shadow-md animate-bounce" />
                      <div className="w-2.5 h-1 bg-slate-900/30 rounded-full blur-[1px]"></div>
                      <span className="absolute -top-1.5 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75"></span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-xs">คลิกที่พิกัดใดๆ บนตารางเพื่อเปลี่ยนตำแหน่งหมุดส่งสัญญาณ GPS ของเจ้าหน้าที่</p>
              </div>

              {/* Text Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="business-name-input" className="block text-sm font-semibold text-slate-700">ชื่อธุรกิจ / สถานประกอบการ <span className="text-red-500">*</span></label>
                  <input
                    id="business-name-input"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => {
                      setBusinessName(e.target.value);
                      if(e.target.value.trim()) setErrors(prev => ({ ...prev, businessName: '' }));
                    }}
                    placeholder="เช่น โรงงานเย็บผ้า บจก. พลังรุ่งเรือง หรือ ร้านอาหารแซ่บ"
                    className={`mt-1.5 w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
                      errors.businessName ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.businessName}</p>}
                </div>

                <div>
                  <label htmlFor="location-desc-input" className="block text-sm font-semibold text-slate-700">ที่ตั้งโดยละเอียด / จุดสังเกตของพนักงาน <span className="text-red-500">*</span></label>
                  <textarea
                    id="location-desc-input"
                    required
                    rows={3}
                    value={locationDesc}
                    onChange={(e) => {
                      setLocationDesc(e.target.value);
                      if(e.target.value.trim()) setErrors(prev => ({ ...prev, locationDesc: '' }));
                    }}
                    placeholder="เลขที่, ซอย, ถนน, ตำบล, อำเภอ และจุดพิกัดสังเกตเด่นชัดข้างเคียง (เช่น ข้างวัด... หรือ เยื้องเซเว่น...)"
                    className={`mt-1.5 w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none ${
                      errors.locationDesc ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                    }`}
                  ></textarea>
                  {errors.locationDesc && <p className="text-red-500 text-xs mt-1 font-medium">{errors.locationDesc}</p>}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* STEP 3: Evidence */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm font-mono shrink-0">3</span>
              <h3 className="text-lg font-bold text-slate-800">หลักฐานพยานบุคคล / พยานเอกสารพัดถิ่น</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Mock Upload Control Panel */}
              <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-700">จำลองการแนบไฟล์พยานหลักฐาน</p>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="evidence-file-name" className="block text-[11px] font-semibold text-slate-500">ชื่อเอกสารหรือภาพถ่าย</label>
                    <input
                      id="evidence-file-name"
                      type="text"
                      value={mockFileName}
                      onChange={(e) => setMockFileName(e.target.value)}
                      placeholder="เช่น สลิปการโอน หรือ รูปถ่าย"
                      className="mt-1 w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMockFileType('photo')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 ${
                        mockFileType === 'photo' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      รูปถ่าย
                    </button>
                    <button
                      type="button"
                      onClick={() => setMockFileType('video')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 ${
                        mockFileType === 'video' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      วิดีโอ
                    </button>
                    <button
                      type="button"
                      onClick={() => setMockFileType('document')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 ${
                        mockFileType === 'document' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      เอกสาร
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddEvidence}
                    disabled={!mockFileName.trim()}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    + แนบไฟล์หลักฐานเข้าฟอร์ม
                  </button>
                </div>

                <div className="border-t border-slate-200/60 pt-3 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">หรือใช้ตัวอย่างด่วนเพื่อทดสอบระบบ:</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => injectSampleEvidence('รูปแคมป์คนงานชำรุด.jpg', 'photo', '3.5 MB')}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[10px] text-slate-600 cursor-pointer"
                    >
                      📷 รูปหน้างานชำรุด
                    </button>
                    <button
                      type="button"
                      onClick={() => injectSampleEvidence('บัญชีเวลางานนอกเวลาโอที.pdf', 'document', '1.1 MB')}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[10px] text-slate-600 cursor-pointer"
                    >
                      📄 ตารางโอทีพนักงาน
                    </button>
                    <button
                      type="button"
                      onClick={() => injectSampleEvidence('คลิปนายจ้างข่มขู่ยึดพาสปอร์ต.mp4', 'video', '14.2 MB')}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[10px] text-slate-600 cursor-pointer"
                    >
                      🎥 คลิปบังคับใช้แรงงาน
                    </button>
                  </div>
                </div>
              </div>

              {/* Uploaded Files List */}
              <div className="md:col-span-7 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[220px]">
                {evidenceFiles.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <Upload className="w-10 h-10 text-slate-300 animate-pulse" />
                    <p className="text-sm font-bold text-slate-600 mt-2">ยังไม่มีไฟล์แนบหลักฐาน</p>
                    <p className="text-slate-400 text-xs mt-1">ใช้ตัวกรองด้านซ้ายเพื่อกรอกชื่อจำลองหรือเลือกไฟล์สาธิตที่มีความปลอดภัยในการจัดส่ง</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    <p className="text-xs font-bold text-slate-600">ไฟล์ที่เตรียมแนบไปกับรายงาน ({evidenceFiles.length} รายการ):</p>
                    
                    <div className="space-y-1.5">
                      {evidenceFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              file.type === 'photo' ? 'bg-emerald-50 text-emerald-600' : file.type === 'video' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {file.type === 'photo' ? <Camera className="w-4 h-4" /> : file.type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0 text-left">
                              <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
                              <p className="text-[10px] text-slate-400">{file.size}</p>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeEvidence(file.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-3">
                  พนักงานจะเก็บรักษารหัสไฟล์และการเข้าถึงเป็นความลับสุดยอด ป้องกันสิทธิ์และความปลอดภัยสูงสุด
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* STEP 4: Choose Identity setting */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm font-mono shrink-0">4</span>
              <h3 className="text-lg font-bold text-slate-800">เลือกตัวตนและความเป็นความลับ</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Toggles */}
              <div className="space-y-4">
                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">รายงานแบบไม่เปิดเผยตัวตน (Anonymous)</p>
                    <p className="text-slate-500 text-xs mt-0.5">ปิดซ่อนชื่อจริงและช่องทางติดต่อเพื่อความปลอดภัย</p>
                  </div>
                  
                  {/* Toggle Button Switch */}
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      isAnonymous ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      isAnonymous ? 'translate-x-6' : 'translate-x-0'
                    }`}></span>
                  </button>
                </div>

                {/* Confidential Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">ป้องกันขั้นสูง (Confidential)</p>
                    <p className="text-slate-500 text-xs mt-0.5">จำกัดสายงานตรวจสอบแก่พนักงานตรวจแรงงานระดับสูง</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setIsConfidential(!isConfidential)}
                    className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      isConfidential ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      isConfidential ? 'translate-x-6' : 'translate-x-0'
                    }`}></span>
                  </button>
                </div>
              </div>

              {/* Conditional Reporter Form */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {isAnonymous ? (
                    <motion.div
                      key="anon-helper"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 bg-emerald-50/50 border border-dashed border-emerald-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center"
                    >
                      <Lock className="w-8 h-8 text-emerald-600 mb-2" />
                      <p className="text-sm font-bold text-emerald-950">เปิดโหมดรายงานไม่เปิดเผยตัวตน</p>
                      <p className="text-emerald-700 text-xs mt-1 leading-normal max-w-xs">
                        ชื่อและข้อมูลทางติดต่อของคุณจะไม่ถูกเก็บลงระบบ คุณจะใช้เฉพาะ <b>รหัสแจ้งเบาะแส</b> ในการติดตามผล
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="auth-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-3"
                    >
                      <h4 className="text-xs font-bold text-slate-700 uppercase">ข้อมูลพยานผู้แจ้งเบาะแสเพื่อการยืนยัน:</h4>
                      
                      <div>
                        <label htmlFor="reporter-name-input" className="block text-[11px] font-semibold text-slate-500">ชื่อจริง - นามสกุลจริง <span className="text-red-500">*</span></label>
                        <input
                          id="reporter-name-input"
                          type="text"
                          required={!isAnonymous}
                          value={reporterName}
                          onChange={(e) => {
                            setReporterName(e.target.value);
                            if(e.target.value.trim()) setErrors(prev => ({ ...prev, reporterName: '' }));
                          }}
                          placeholder="เช่น นายปรีชา ใจดี"
                          className={`mt-1 w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 ${
                            errors.reporterName ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                          }`}
                        />
                        {errors.reporterName && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.reporterName}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="reporter-phone-input" className="block text-[11px] font-semibold text-slate-500">เบอร์โทรศัพท์ติดต่อ <span className="text-red-500">*</span></label>
                          <input
                            id="reporter-phone-input"
                            type="text"
                            required={!isAnonymous}
                            value={reporterPhone}
                            onChange={(e) => {
                              setReporterPhone(e.target.value);
                              if(e.target.value.trim()) setErrors(prev => ({ ...prev, reporterPhone: '' }));
                            }}
                            placeholder="เช่น 0891234567"
                            className={`mt-1 w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 ${
                              errors.reporterPhone ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                            }`}
                          />
                          {errors.reporterPhone && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.reporterPhone}</p>}
                        </div>

                        <div>
                          <label htmlFor="reporter-email-input" className="block text-[11px] font-semibold text-slate-500">อีเมล (หากมี)</label>
                          <input
                            id="reporter-email-input"
                            type="email"
                            value={reporterEmail}
                            onChange={(e) => setReporterEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              id="report-form-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-3 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังเข้ารหัสความปลอดภัยและส่งรายงาน...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  ส่งข้อมูลเบาะแสและขอรับรหัสลับติดตามเรื่อง
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Success Modal Receipts Overlay */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-8 space-y-6 text-center"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-950 font-display">บันทึกข้อมูลและส่งเรื่องเรียบร้อย!</h3>
              <p className="text-slate-500 text-xs">พยานหลักฐานของท่านถูกบันทึกเข้าระบบราชการส่วนคุ้มครองแรงงานเป็นความลับสูงสุดแล้ว</p>
            </div>

            {/* Tracking credentials panel */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-3">
              <p className="text-xs font-bold text-slate-600">กรุณาจดจำรหัสคดีด้านล่างนี้เพื่อใช้เข้าสู่ระบบตรวจสอบสถานะ:</p>
              
              <div className="space-y-2">
                {/* ID */}
                <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200/80 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">รหัสสืบค้น (Tracking ID)</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{successData.id}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(successData.id, 'id')}
                    className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                  >
                    {copiedId ? <span className="text-[10px] text-emerald-600 font-bold">คัดลอกแล้ว</span> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200/80 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">รหัสผ่าน (Password / Secret Key)</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{successData.pass}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(successData.pass, 'pass')}
                    className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                  >
                    {copiedPass ? <span className="text-[10px] text-emerald-600 font-bold">คัดลอกแล้ว</span> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2 bg-amber-50 text-amber-800 border border-amber-100 rounded-xl text-[10px] leading-relaxed flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span><b>คำแนะนำความมั่นคง:</b> ห้ามแชร์พาสเวิร์ดนี้ให้ใคร และไม่มีบริการกู้คืนหากลืม เนื่องจากระบบปิดตัวตนจะไม่เก็บบทสนทนาทางช่องทางสว่าง</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                id="success-copy-track-btn"
                onClick={() => {
                  onSuccess(successData.id, successData.pass);
                  onNavigate('track');
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                คัดลอกข้อมูล และ ไปยังระบบติดตามสถานะทันที
              </button>
              
              <button
                id="success-dismiss-btn"
                onClick={() => {
                  setSuccessData(null);
                  onNavigate('landing');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold text-xs cursor-pointer"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
