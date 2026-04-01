import type { Company, Pitch } from '../types';

export const mockCompany: Company = {
  id: '1',
  slug: 'acme-corp',
  name: 'ACME株式会社',
  description: 'テクノロジーで日本のビジネスをより良くする会社です。',
  industry: 'IT・テクノロジー',
  website: 'https://acme.example.com',
  departments: [
    { id: 'd1', companyId: '1', name: 'マーケティング部', category: 'marketing', contactEmail: 'marketing@acme.example.com', allowPitches: true },
    { id: 'd2', companyId: '1', name: 'システム部', category: 'system', contactEmail: 'system@acme.example.com', allowPitches: true },
    { id: 'd3', companyId: '1', name: '人事部', category: 'hr', contactEmail: 'hr@acme.example.com', allowPitches: true },
    { id: 'd4', companyId: '1', name: '経営企画室', category: 'executive', allowPitches: false },
  ],
  createdAt: '2024-01-01T00:00:00Z',
};

export const mockPitches: Pitch[] = [
  {
    id: 'p1',
    sender: { id: 'u1', name: '田中 太郎', companyName: 'テックソリューションズ株式会社', email: 'tanaka@tech.example.com', avatarUrl: 'https://i.pravatar.cc/40?img=1' },
    companyId: '1',
    departmentId: 'd1',
    title: '広告運用の自動化ツールのご提案',
    body: 'はじめまして。テックソリューションズの田中です。\n\n弊社の広告運用自動化ツール「AdPilot」についてご提案させてください。AIを活用した入札最適化により、広告費を平均30%削減しながらCVRを向上させることができます。\n\n添付資料にて詳細をご確認いただけます。ご興味があればぜひお声がけください。',
    attachments: [
      { id: 'a1', name: 'AdPilot_サービス資料.pdf', type: 'pdf', url: '#', size: 2400000 },
    ],
    category: 'marketing',
    status: 'unread',
    createdAt: '2024-11-20T10:30:00Z',
  },
  {
    id: 'p2',
    sender: { id: 'u2', name: '鈴木 花子', companyName: 'クラウドベース株式会社', email: 'suzuki@cloudbase.example.com', avatarUrl: 'https://i.pravatar.cc/40?img=5' },
    companyId: '1',
    departmentId: 'd2',
    title: 'セキュリティ診断サービスのご案内',
    body: 'お世話になります。クラウドベースの鈴木です。\n\n昨今のサイバー攻撃増加を受け、弊社のセキュリティ診断サービスをご案内します。Webアプリケーションの脆弱性診断から、ネットワーク全体のリスク評価まで対応しております。\n\n初回診断は無料でご提供可能です。',
    attachments: [
      { id: 'a2', name: 'セキュリティ診断_概要.pdf', type: 'pdf', url: '#', size: 1200000 },
      { id: 'a3', name: '導入事例紹介', type: 'link', url: 'https://example.com' },
    ],
    category: 'system',
    status: 'read',
    createdAt: '2024-11-19T14:00:00Z',
  },
  {
    id: 'p3',
    sender: { id: 'u3', name: '伊藤 健一', companyName: 'HRテック合同会社', email: 'ito@hrtech.example.com', avatarUrl: 'https://i.pravatar.cc/40?img=8' },
    companyId: '1',
    departmentId: 'd3',
    title: '採用管理システム「HireFlow」のご提案',
    body: '採用担当者様\n\nHRテックの伊藤です。採用工数を60%削減した実績のある採用管理システム「HireFlow」をご紹介します。\n\nAIによる書類選考、面接日程の自動調整、候補者へのコミュニケーション一元管理など、採用全体をサポートします。',
    attachments: [
      { id: 'a4', name: 'HireFlow_製品動画', type: 'video', url: '#' },
    ],
    category: 'hr',
    status: 'saved',
    createdAt: '2024-11-18T09:15:00Z',
  },
];
