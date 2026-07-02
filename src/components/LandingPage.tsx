import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CalendarClock, Globe, ArrowRight, MessageSquareWarning, ChevronRight, Lock, EyeOff, Users, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  stats: {
    total: number;
    resolvedPercent: number;
    speedPercent: number;
  };
}

export default function LandingPage({ onNavigate, stats }: LandingPageProps) {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-blue-50/20 to-transparent -z-10"></div>
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold tracking-wide border border-blue-100 uppercase">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></span>
            คุ้มครองสิทธิมนุษยชนแรงงานสากล
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E293B] font-display leading-tight tracking-tight">
            ระบบแจ้งเบาะแส<br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
              และช่วยเหลือสิทธิ์แรงงาน
            </span>
          </h1>
          
          <p className="text-slate-600 text-base leading-relaxed max-w-xl">
            ร่วมหยุดยั้งการค้ามนุษย์ด้านแรงงาน การกักขังหน่วงเหนี่ยว ค้างจ่ายค่าแรงอันมิชอบ สภาพแวดล้อมเสี่ยงอันตราย และการใช้แรงงานเด็กผิดกฎหมายอย่างปลอดภัย ไร้กังวลเรื่องความปลอดภัยทางตัวตน
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              id="hero-report-btn"
              onClick={() => onNavigate('report')}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <MessageSquareWarning className="w-5 h-5" />
              แจ้งเบาะแสทันที (Report Immediately)
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              id="hero-track-btn"
              onClick={() => onNavigate('track')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl font-semibold border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
            >
              ติดตามสถานะคดี
            </button>
          </div>
        </div>

        {/* Hero Illustration / Graphical Shield UI */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center bg-white rounded-2xl shadow-md border border-slate-200 p-8">
            <div className="absolute inset-0 bg-radial from-blue-50/30 to-transparent rounded-2xl -z-10"></div>
            
            <div className="w-full h-full flex flex-col justify-between">
              {/* Visual Graphic */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/60">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                </div>
              </div>

              {/* Graphic Elements mimicking a report status */}
              <div className="my-6 space-y-4">
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold border border-blue-100/50">W</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">ค้างจ่ายค่าแรงพนักงานพาร์ทไทม์</p>
                    <p className="text-[10px] text-slate-500 truncate">สมุทรปราการ • กำลังดำเนินการ</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full shrink-0">กำลังดำเนินการ</span>
                </div>

                <div className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/30">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-400 truncate">บังคับใช้แรงงานเย็บผ้า 14 ชม.</p>
                    <p className="text-[10px] text-slate-300">รอดำเนินการ</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full shrink-0">รับเรื่องแล้ว</span>
                </div>
              </div>

              {/* Secure Trust Stamp */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-emerald-900">ฐานข้อมูลผ่านการเข้ารหัส 256-bit</p>
                  <p className="text-[9px] text-emerald-600">สิทธิ์พนักงานจะได้รับการคุ้มครองอย่างเป็นความลับที่สุด</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-5 hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100/40">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">เคสสะสมทั้งหมด (Total Cases)</p>
            <p className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-0.5">
              {stats.total.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-5 hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100/40">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">ปิดเคสแล้วสำเร็จ (Resolved Rate)</p>
            <p className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-0.5">
              {stats.resolvedPercent}%
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-5 hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 border border-amber-100/40">
            <CalendarClock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">ปิดเคสไวดั่งใจ (Speed Rate)</p>
            <p className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-0.5">
              {stats.speedPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 font-display">ระบบนี้ช่วยอะไรคุณได้บ้าง?</h2>
          <p className="text-slate-500 text-sm">เราออกแบบระบบที่ยึดหลักความปลอดภัย ความรวดเร็ว และความเป็นธรรมสูงสุดสำหรับทุกคน</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-center space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100/50">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">ความปลอดภัยสูงเป็นเลิศ</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              มั่นใจด้วยการเข้ารหัสข้อมูลในระบบ และทางเลือกการปิดบังชื่อสกุลจริง (Anonymous) ข้อมูลสถานที่จะถูกพรางพิกัดเพื่อป้องกันพนักงานจากการถูกกลั่นแกล้งหรือข่มขู่
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-center space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100/50">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">ติดตามสถานะง่าย ทุกเวลา</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              หลังจากแจ้งเรื่อง ระบบจะจัดส่งรหัสและพาสเวิร์ดลับให้ท่าน เพื่อใช้ติดตามการอัปเดตของเจ้าหน้าที่ตั้งแต่ขั้นตอนรับเรื่อง ตรวจสอบ ลงพื้นที่ และปิดเคสแบบเรียลไทม์
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100/50">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">เข้าถึงทุกคน เท่าเทียมกัน</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              ระบบใช้งานง่ายทั้งบนคอมพิวเตอร์และมือถือ มีแบบฟอร์มคัดกรองเบื้องต้น มีการซัพพอร์ตภาษาที่เข้าใจง่าย เพื่อลดช่องว่างและให้โอกาสแรงงานทุกคนเข้าถึงความช่วยเหลืออย่างเสมอภาค
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
