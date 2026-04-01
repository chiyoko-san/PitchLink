export type Category = 'marketing' | 'system' | 'hr' | 'finance' | 'executive' | 'other';

export type PitchStatus = 'unread' | 'read' | 'saved' | 'dismissed' | 'blocked';

export interface Company {
  id: string;
  slug: string;
  name: string;
  description: string;
  logoUrl?: string;
  industry: string;
  website?: string;
  departments: Department[];
  createdAt: string;
}

export interface Department {
  id: string;
  companyId: string;
  name: string;
  category: Category;
  contactEmail?: string;
  slackWebhook?: string;
  allowPitches: boolean;
}

export interface User {
  id: string;
  name: string;
  companyName: string;
  email: string;
  avatarUrl?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'image';
  url: string;
  size?: number;
}

export interface Pitch {
  id: string;
  sender: User;
  companyId: string;
  departmentId?: string;
  title: string;
  body: string;
  attachments: Attachment[];
  category: Category;
  status: PitchStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  pitchId: string;
  pitch: Pitch;
  type: 'new_pitch' | 'pitch_opened';
  read: boolean;
  createdAt: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  marketing: 'マーケティング',
  system: 'システム',
  hr: '人事',
  finance: '経理・財務',
  executive: '経営',
  other: 'その他',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  marketing: 'bg-pink-100 text-pink-700',
  system: 'bg-blue-100 text-blue-700',
  hr: 'bg-green-100 text-green-700',
  finance: 'bg-yellow-100 text-yellow-700',
  executive: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};
