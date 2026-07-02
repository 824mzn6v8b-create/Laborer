export type CaseCategory = 'wage' | 'forced_labor' | 'safety' | 'child_labor';

export type CaseStatus = 'received' | 'verifying' | 'action_taken' | 'closed';

export type CasePriority = 'high' | 'medium' | 'low';

export interface EvidenceFile {
  id: string;
  name: string;
  type: 'photo' | 'video' | 'document';
  size: string;
  url?: string;
}

export interface CaseTimelineEvent {
  id: string;
  status: CaseStatus;
  date: string;
  title: string;
  description: string;
  remark?: string;
}

export interface WhistleblowingCase {
  id: string;
  password: string;
  category: CaseCategory;
  businessName: string;
  locationDesc: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  evidence: EvidenceFile[];
  isAnonymous: boolean;
  isConfidential: boolean;
  reporterName?: string;
  reporterPhone?: string;
  reporterEmail?: string;
  status: CaseStatus;
  priority: CasePriority;
  createdAt: string;
  timeline: CaseTimelineEvent[];
  adminNotes?: string;
}
