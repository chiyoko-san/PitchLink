import type { Company, Pitch } from '../types';

// 整理番号をランダム生成（順序・件数が推測できないように）。
// 紛らわしい文字（0/O, 1/I/L など）を除いた英数字8桁。
const REF_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function generateRefNumber(): string {
  let s = '';
  for (let i = 0; i < 8; i++) {
    s += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return 'PL-' + s;
}

export const mockCompany: Company = {
  id: '1',
  slug: 'acme-corp',
  name: 'ACME株式会社',
  description: 'テクノロジーで日本のビジネスをより良くする会社です。',
  industry: 'IT・テクノロジー',
  website: 'https://acme.example.com',
  receivingConditions: [
    '導入実績が3社以上あるサービス',
    '初期費用と月額費用が資料に明記されていること',
    '無料トライアルまたはデモが可能なもの',
    '中小企業向けの料金プランがあること',
  ],
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
    refNumber: generateRefNumber(),
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
    original: {
      headline: '貴社のマーケティング体制に合わせた運用プランをご用意しました',
      points: [
        '現在ご利用中の広告媒体に追加導入できる構成',
        '繁忙期を避けた段階的な導入スケジュール案つき',
        'マーケティング部の運用工数を想定した初期設定の代行',
      ],
    },
    reading: {
      materialName: 'AdPilot_サービス資料.pdf',
      pages: [
        { page: 1, seconds: 8 },
        { page: 2, seconds: 14 },
        { page: 3, seconds: 47 },
        { page: 4, seconds: 12 },
        { page: 5, seconds: 92 },
        { page: 6, seconds: 22 },
        { page: 7, seconds: 6 },
      ],
    },
  },
  {
    id: 'p2',
    refNumber: generateRefNumber(),
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
    refNumber: generateRefNumber(),
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
  {
    id: 'p4',
    refNumber: generateRefNumber(),
    sender: { id: 'u4', name: '山本 三郎', companyName: 'オフィスサプライ株式会社', email: 'yamamoto@office.example.com', avatarUrl: 'https://i.pravatar.cc/40?img=12' },
    companyId: '1', departmentId: 'd4',
    title: 'オフィス備品の定期配送サービス',
    body: '消耗品の発注業務を自動化するサービスのご案内です。',
    attachments: [{ id: 'a5', name: 'サービス概要.pdf', type: 'pdf', url: '#', size: 900000 }],
    category: 'other', status: 'read', createdAt: '2024-08-10T09:00:00Z',
  },
  {
    id: 'p5',
    refNumber: generateRefNumber(),
    sender: { id: 'u5', name: '中村 四郎', companyName: 'リーガルテック株式会社', email: 'nakamura@legal.example.com', avatarUrl: 'https://i.pravatar.cc/40?img=15' },
    companyId: '1', departmentId: 'd4',
    title: '契約書管理システムのご提案',
    body: '契約書の電子化と期限管理を一元化するシステムです。',
    attachments: [{ id: 'a6', name: '製品資料.pdf', type: 'pdf', url: '#', size: 1500000 }],
    category: 'executive', status: 'read', createdAt: '2024-06-22T11:00:00Z',
  },
  {
    id: 'p6',
    refNumber: generateRefNumber(),
    sender: { id: 'u6', name: '小林 五郎', companyName: 'グロースマーケ株式会社', email: 'kobayashi@growth.example.com', avatarUrl: 'https://i.pravatar.cc/40?img=20' },
    companyId: '1', departmentId: 'd1',
    title: 'SNS運用代行のご案内',
    body: 'SNSアカウントの運用を月額制で代行いたします。',
    attachments: [{ id: 'a7', name: '実績資料.pdf', type: 'pdf', url: '#', size: 1100000 }],
    category: 'marketing', status: 'read', createdAt: '2024-03-15T13:30:00Z',
  },
  {
    id: 'p7',
    refNumber: generateRefNumber(),
    sender: { id: 'u7', name: '加藤 六子', companyName: 'クラウド会計株式会社', email: 'kato@account.example.com', avatarUrl: 'https://i.pravatar.cc/40?img=25' },
    companyId: '1', departmentId: 'd4',
    title: 'クラウド会計ソフトの乗り換え提案',
    body: '会計業務を効率化するクラウドソフトへの乗り換えをご提案します。',
    attachments: [{ id: 'a8', name: '比較資料.pdf', type: 'pdf', url: '#', size: 1300000 }],
    category: 'finance', status: 'read', createdAt: '2023-12-05T10:00:00Z',
  },
  {
    id: 'p8',
    refNumber: generateRefNumber(),
    sender: { id: 'u8', name: '吉田 七海', companyName: 'タレントマネジメント株式会社', email: 'yoshida@talent.example.com', avatarUrl: 'https://i.pravatar.cc/40?img=30' },
    companyId: '1', departmentId: 'd3',
    title: '人材育成研修プログラムのご案内',
    body: '管理職向けの研修プログラムをご提案します。',
    attachments: [{ id: 'a9', name: '研修概要.pdf', type: 'pdf', url: '#', size: 800000 }],
    category: 'hr', status: 'read', createdAt: '2023-09-18T14:00:00Z',
  },
];
