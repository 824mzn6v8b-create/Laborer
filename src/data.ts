import { WhistleblowingCase, CaseCategory, CaseStatus, CasePriority } from './types';

export const CATEGORY_MAP: Record<CaseCategory, { label: string; iconName: string; color: string; description: string }> = {
  wage: {
    label: 'ค่าแรง / ไม่ได้รับความเป็นธรรมด้านค่าจ้าง',
    iconName: 'DollarSign',
    color: 'emerald',
    description: 'จ่ายค่าจ้างต่ำกว่าอัตราขั้นต่ำ ค้างจ่ายค่าแรง ไม่จ่ายค่าล่วงเวลา (OT) หรือหักเงินโดยมิชอบ'
  },
  forced_labor: {
    label: 'บังคับใช้แรงงาน / กักขังหน่วงเหนี่ยว',
    iconName: 'ShieldAlert',
    color: 'rose',
    description: 'บังคับทำงานเกินเวลา ยึดเอกสารประจำตัว กักขังบริเวณ หรือข่มขู่คุกคามให้จำยอมทำงาน'
  },
  safety: {
    label: 'ความปลอดภัยและสุขอนามัยต่ำ',
    iconName: 'HardHat',
    color: 'amber',
    description: 'ไม่มีอุปกรณ์ป้องกันอันตราย สภาพแวดล้อมเสี่ยงภัย สุขอนามัยในโรงงานหรือแคมป์คนงานไม่ได้มาตรฐาน'
  },
  child_labor: {
    label: 'การใช้แรงงานเด็กผิดกฎหมาย',
    iconName: 'Users',
    color: 'purple',
    description: 'จ้างแรงงานเด็กอายุต่ำกว่าเกณฑ์ ทำงานในสถานที่อันตราย หรือทำงานเกินเวลาที่กฎหมายกำหนด'
  }
};

export const STATUS_MAP: Record<CaseStatus, { label: string; color: string; bg: string; text: string; step: number }> = {
  received: { label: 'รับเรื่องแล้ว', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', step: 1 },
  verifying: { label: 'กำลังตรวจสอบ', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', step: 2 },
  action_taken: { label: 'กำลังดำเนินการ', color: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-700', step: 3 },
  closed: { label: 'ปิดเคสเสร็จสิ้น', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', step: 4 }
};

export const PRIORITY_MAP: Record<CasePriority, { label: string; bg: string; text: string; ring: string }> = {
  high: { label: 'วิกฤต / สูงมาก', bg: 'bg-rose-100', text: 'text-rose-800', ring: 'ring-rose-200' },
  medium: { label: 'ปานกลาง', bg: 'bg-amber-100', text: 'text-amber-800', ring: 'ring-amber-200' },
  low: { label: 'ทั่วไป', bg: 'bg-slate-100', text: 'text-slate-800', ring: 'ring-slate-200' }
};

// Generates a random Tracking ID (e.g., CASE-84729)
export function generateTrackingId(): string {
  return `CASE-${Math.floor(100000 + Math.random() * 900000)}`;
}

// Generates a random Password (e.g., 482915)
export function generatePassword(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const INITIAL_CASES: WhistleblowingCase[] = [
  {
    id: 'CASE-723910',
    password: 'auth99',
    category: 'forced_labor',
    businessName: 'โรงงานสิ่งทอ เจริญพาณิชย์',
    locationDesc: 'ซอยสุขสวัสดิ์ 74 อำเภอพระประแดง สมุทรปราการ',
    coordinates: { lat: 13.6215, lng: 100.5283 },
    evidence: [
      { id: 'ev-1', name: 'working_hours_log.jpg', type: 'photo', size: '2.4 MB' },
      { id: 'ev-2', name: 'contract_withheld.pdf', type: 'document', size: '1.2 MB' }
    ],
    isAnonymous: true,
    isConfidential: true,
    status: 'verifying',
    priority: 'high',
    createdAt: '2026-06-25T08:30:00Z',
    adminNotes: 'เจ้าหน้าที่กำลังรวบรวมหลักฐานและประสานงานกับกรมสวัสดิการและคุ้มครองแรงงานจังหวัดสมุทรปราการเพื่อเข้าตรวจสอบสถานที่จริงในสัปดาห์หน้า',
    timeline: [
      {
        id: 't-1',
        status: 'received',
        date: '2026-06-25T08:35:00Z',
        title: 'รับเรื่องแจ้งเบาะแส',
        description: 'ระบบได้รับข้อมูลเบาะแส บัญชีการทำงานล่วงเวลาที่ถูกบังคับ และข้อมูลการยึดเอกสารหนังสือเดินทางแล้ว'
      },
      {
        id: 't-2',
        status: 'verifying',
        date: '2026-06-26T10:00:00Z',
        title: 'เริ่มต้นการตรวจสอบเอกสารขั้นต้น',
        description: 'เจ้าหน้าที่กลุ่มงานคุ้มครองแรงงานได้วิเคราะห์พยานหลักฐานเบื้องต้น พบว่ามีน้ำหนักน่าเชื่อถือและเข้าข่ายการเอาเปรียบแรงงานอย่างรุนแรง'
      }
    ]
  },
  {
    id: 'CASE-492015',
    password: 'pass12',
    category: 'wage',
    businessName: 'ร้านอาหารอีสาน แซ่บอีหลีสาขา 3',
    locationDesc: 'ถนนพหลโยธิน แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพมหานคร',
    coordinates: { lat: 13.8732, lng: 100.5968 },
    evidence: [
      { id: 'ev-3', name: 'bank_statement_unpaid.png', type: 'photo', size: '1.8 MB' }
    ],
    isAnonymous: false,
    reporterName: 'สมชาย รักดี',
    reporterPhone: '0812345678',
    reporterEmail: 'somchai.r@gmail.com',
    isConfidential: true,
    status: 'action_taken',
    priority: 'medium',
    createdAt: '2026-06-28T14:15:00Z',
    adminNotes: 'ออกหนังสือเตือนนายจ้างให้ชำระค่าจ้างส่วนที่ค้างจ่าย ภายใน 15 วัน นายจ้างตอบรับแล้วและแจ้งว่าจะโอนเงินให้พนักงานทั้งหมดภายในวันที่ 5 กรกฎาคมนี้',
    timeline: [
      {
        id: 't-3',
        status: 'received',
        date: '2026-06-28T14:15:00Z',
        title: 'รับเรื่องแจ้งเบาะแส',
        description: 'ได้รับเรื่องร้องเรียนกรณีค้างจ่ายค่าแรงพนักงานพาร์ทไทม์จำนวน 8 ราย เป็นเวลารวม 2 เดือน'
      },
      {
        id: 't-4',
        status: 'verifying',
        date: '2026-06-29T09:00:00Z',
        title: 'ติดต่อผู้แจ้งและนัดสอบถ้อยคำ',
        description: 'เจ้าหน้าที่โทรสัมภาษณ์ผู้ร้องเรียนเพื่อยืนยันพยานหลักฐานสลิปและสเตทเมนต์ธนาคาร'
      },
      {
        id: 't-5',
        status: 'action_taken',
        date: '2026-06-30T11:30:00Z',
        title: 'ออกคำสั่งพนักงานตรวจแรงงาน',
        description: 'ส่งหนังสือเชิญนายจ้างเข้าพบคณะพนักงานตรวจแรงงาน และออกหนังสือแจ้งเตือนบังคับชำระหนี้ค่าจ้างตามกฎหมายสวัสดิการแรงงาน'
      }
    ]
  },
  {
    id: 'CASE-108422',
    password: 'safe55',
    category: 'safety',
    businessName: 'แคมป์คนงานก่อสร้าง คอนโดแกรนด์วิว',
    locationDesc: 'ถนนพระราม 9 ซอย 13 เขตห้วยขวาง กรุงเทพมหานคร',
    coordinates: { lat: 13.7548, lng: 100.5822 },
    evidence: [
      { id: 'ev-4', name: 'scaffolding_unsafe.mp4', type: 'video', size: '15.4 MB' },
      { id: 'ev-5', name: 'no_safety_helmets.jpg', type: 'photo', size: '3.1 MB' }
    ],
    isAnonymous: true,
    isConfidential: false,
    status: 'closed',
    priority: 'high',
    createdAt: '2026-06-15T11:00:00Z',
    adminNotes: 'ได้เข้าตรวจร่วมกับวิศวกรเขตห้วยขวาง สั่งปรับผู้รับเหมาและให้หยุดงานก่อสร้างชั่วคราวจนกว่าจะปรับปรุงนั่งร้านและแจกจ่ายอุปกรณ์ PPE ครบถ้วน ล่าสุดตรวจสอบซ้ำผ่านเกณฑ์ความปลอดภัยแล้ว จึงปิดเคส',
    timeline: [
      {
        id: 't-6',
        status: 'received',
        date: '2026-06-15T11:00:00Z',
        title: 'รับเรื่องแจ้งเบาะแส',
        description: 'รับแจ้งเบาะแสนั่งร้านชำรุดไม่มีที่กั้นตกลงมา และคนงานมากกว่า 30 คนต้องทำงานบนความสูงโดยไม่มีสายรัดนิรภัยและหมวกนิรภัย'
      },
      {
        id: 't-7',
        status: 'verifying',
        date: '2026-06-16T13:45:00Z',
        title: 'เข้าตรวจสอบพื้นที่ฉุกเฉิน',
        description: 'พนักงานตรวจความปลอดภัยและโยธาธิการเขตลงพื้นที่สืบสวนหน้างาน และถ่ายภาพนั่งร้านที่มีสภาพชำรุดจริง'
      },
      {
        id: 't-8',
        status: 'action_taken',
        date: '2026-06-18T10:00:00Z',
        title: 'สั่งระงับการก่อสร้างชั่วคราว',
        description: 'ออกคำสั่งระงับการต่อเติมในจุดที่อันตราย และให้บริษัทผู้รับเหมาปรับปรุงโครงสร้างติดตั้งเน็ตกันตกให้เสร็จสิ้น'
      },
      {
        id: 't-9',
        status: 'closed',
        date: '2026-06-25T16:00:00Z',
        title: 'ปรับปรุงเรียบร้อยและปิดเคส',
        description: 'ผู้รับเหมาได้ดำเนินการแก้ไขสภาพแวดล้อม ติดตั้งราวกั้น ลวดสลิง และแจกอุปกรณ์นิรภัยใหม่ทั้งหมด เจ้าหน้าที่ตรวจรับงานประเมินผลผ่านเกณฑ์มาตรฐาน'
      }
    ]
  },
  {
    id: 'CASE-331048',
    password: 'child7',
    category: 'child_labor',
    businessName: 'ลานแกะเปลือกหอยเจ้หมวย',
    locationDesc: 'ท่าเทียบเรือประมง ตำบลมหาชัย อำเภอเมือง สมุทรสาคร',
    coordinates: { lat: 13.5412, lng: 100.2743 },
    evidence: [
      { id: 'ev-6', name: 'minor_workers.jpg', type: 'photo', size: '2.9 MB' }
    ],
    isAnonymous: true,
    isConfidential: true,
    status: 'received',
    priority: 'high',
    createdAt: '2026-07-01T06:45:00Z',
    adminNotes: 'รับรายงานด่วนเกี่ยวกับการจ้างเด็กต่างด้าวอายุ 11-13 ปี ทำงานลอกเปลือกอาหารทะเลแช่แข็ง สภาพหลังคุดคู้ สูดดมสารเคมีฟอร์มาลีน ได้ส่งข้อมูลประสานชุดเฉพาะกิจปราบปรามการค้ามนุษย์แรงงานเด็กเข้าจับกุมสายฟ้าแลบในอีก 2 วันข้างหน้า',
    timeline: [
      {
        id: 't-10',
        status: 'received',
        date: '2026-07-01T06:45:00Z',
        title: 'รับเรื่องแจ้งเบาะแส',
        description: 'ได้รับแจ้งเรื่องการจ้างแรงงานเด็กผิดกฎหมาย ไม่ได้รับสิทธิ์การศึกษา ทำงานตั้งแต่ตี 4 ถึงบ่ายโมง แลกค่าจ้างเพียงวันละ 150 บาท'
      }
    ]
  }
];

export function getLocalCases(): WhistleblowingCase[] {
  const data = localStorage.getItem('whistleblowing_cases');
  if (!data) {
    localStorage.setItem('whistleblowing_cases', JSON.stringify(INITIAL_CASES));
    return INITIAL_CASES;
  }
  return JSON.parse(data);
}

export function saveLocalCases(cases: WhistleblowingCase[]) {
  localStorage.setItem('whistleblowing_cases', JSON.stringify(cases));
}

export function addLocalCase(newCase: Omit<WhistleblowingCase, 'status' | 'priority' | 'createdAt' | 'timeline'>): WhistleblowingCase {
  const cases = getLocalCases();
  
  const createdCase: WhistleblowingCase = {
    ...newCase,
    status: 'received',
    priority: 'medium', // Default priority, admin will triage
    createdAt: new Date().toISOString(),
    timeline: [
      {
        id: `t-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'received',
        date: new Date().toISOString(),
        title: 'ส่งคำร้องแจ้งเบาะแสแล้ว',
        description: 'ระบบได้รับข้อมูลเบาะแสของท่านเรียบร้อยแล้ว เจ้าหน้าที่ฝ่ายคุ้มครองสิทธิ์แรงงานจะเข้าตรวจสอบเพื่อประเมินระดับความรุนแรงและดำเนินการในลำดับถัดไป'
      }
    ]
  };
  
  cases.unshift(createdCase);
  saveLocalCases(cases);
  return createdCase;
}

export function updateLocalCaseStatus(caseId: string, status: CaseStatus, remark?: string, priority?: CasePriority, adminNotes?: string): WhistleblowingCase | null {
  const cases = getLocalCases();
  const caseIndex = cases.findIndex(c => c.id === caseId);
  if (caseIndex === -1) return null;
  
  const currentCase = cases[caseIndex];
  
  // Create a new timeline event
  const statusTitles: Record<CaseStatus, string> = {
    received: 'รับเรื่องแจ้งเบาะแสใหม่',
    verifying: 'ปรับสถานะ: เริ่มดำเนินการตรวจสอบข้อเท็จจริง',
    action_taken: 'ปรับสถานะ: ดำเนินมาตรการทางกฎหมาย / ประสานหน่วยงาน',
    closed: 'ปรับสถานะ: สรุปมาตรการและปิดกรณีเสร็จสมบูรณ์'
  };
  
  const statusDescriptions: Record<CaseStatus, string> = {
    received: 'พนักงานตรวจแรงงานเริ่มรับเคสเข้าระบบเพื่อเตรียมการลงทะเบียนจัดหมวดหมู่',
    verifying: 'กำลังประสานพนักงานตรวจคุ้มครองแรงงานจังหวัดเพื่อจัดกำลังลงพื้นที่พิสูจน์พยานหลักฐาน',
    action_taken: 'ส่งมอบหลักฐานแก่ตำรวจหรือพนักงานฝ่ายปกครอง ออกคำบังคับทางปกครองแก่เจ้าของกิจการ',
    closed: 'พนักงานตรวจคุ้มครองแรงงานสรุปผลคดี นายจ้างปรับปรุงมาตรฐานหรือชำระส่วนต่างค่าชดเชยครบถ้วน สิทธิประโยชน์ผู้ร้องเรียนได้รับการคุ้มครองอย่างปลอดภัย'
  };

  const newEvent = {
    id: `t-${Math.floor(100000 + Math.random() * 900000)}`,
    status,
    date: new Date().toISOString(),
    title: statusTitles[status],
    description: statusDescriptions[status],
    remark: remark || ''
  };
  
  currentCase.status = status;
  currentCase.timeline.push(newEvent);
  if (priority) {
    currentCase.priority = priority;
  }
  if (adminNotes !== undefined) {
    currentCase.adminNotes = adminNotes;
  }
  
  cases[caseIndex] = currentCase;
  saveLocalCases(cases);
  return currentCase;
}
