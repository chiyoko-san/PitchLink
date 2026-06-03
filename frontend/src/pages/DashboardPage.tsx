import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Plus, Trash2, Pencil, Check, X,
  Bell, Mail, Slack, Copy, Eye, Settings,
  FileText, ChevronRight, Lock, Search,
  SlidersHorizontal, ChevronUp, ChevronDown,
  ToggleLeft, ToggleRight,
  CreditCard, HelpCircle, PanelLeftClose, PanelLeft, LogOut, Clock
} from 'lucide-react';
import { mockCompany, mockPitches } from '../utils/mockData';
import Footer from '../components/Footer';
import {
  CATEGORY_LABELS, CATEGORY_COLORS,
  type Category, type Department
} from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

type Tab = 'pitches' | 'departments' | 'settings';

// 無料枠で開ける件数（新しい順にこの件数まで無料。それより古い資料はロック）
const FREE_VISIBLE_COUNT = 5;

// 無料版で作れる部署の上限（これ以上は有料版が必要）
const FREE_DEPT_LIMIT = 8;


const ALL_CATEGORIES: { value: Category; label: string }[] = [
  { value: 'marketing', label: 'マーケティング' },
  { value: 'system', label: 'システム' },
  { value: 'hr', label: '人事' },
  { value: 'finance', label: '経理・財務' },
  { value: 'executive', label: '経営' },
  { value: 'other', label: 'その他' },
];

function DeptForm({
  initial, onSave, onCancel,
}: {
  initial?: Partial<Department>;
  onSave: (d: Omit<Department, 'id' | 'companyId'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'other');
  const [email, setEmail] = useState(initial?.contactEmail ?? '');
  const [slack, setSlack] = useState(initial?.slackWebhook ?? '');
  const [allow, setAllow] = useState(initial?.allowPitches ?? true);

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-semibold text-gray-600 mb-1 block">部署名 *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="例：マーケティング部"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">カテゴリ *</label>
          <select value={category} onChange={e => setCategory(e.target.value as Category)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400">
            {ALL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">資料受け取り</label>
          <button type="button" onClick={() => setAllow(!allow)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition ${allow ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
            {allow ? <><ToggleRight className="w-4 h-4" /> 受け取り中</> : <><ToggleLeft className="w-4 h-4" /> 停止中</>}
          </button>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold text-gray-600 mb-1 block">連絡先メール（興味ある際に開示）</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="dept@yourcompany.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Slack Webhook URL（任意）</label>
          <input value={slack} onChange={e => setSlack(e.target.value)} placeholder="https://hooks.slack.com/..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => name && onSave({ name, category, contactEmail: email, slackWebhook: slack, allowPitches: allow })}
          disabled={!name}
          className="flex items-center gap-1 bg-indigo-600 disabled:bg-indigo-300 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
          <Check className="w-3.5 h-3.5" /> 保存
        </button>
        <button onClick={onCancel} className="flex items-center gap-1 bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
          <X className="w-3.5 h-3.5" /> キャンセル
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true); // サイドバーの開閉
  const [tab, setTab] = useState<Tab>('pitches');
  const [pitches, setPitches] = useState(mockPitches);
  const [departments, setDepartments] = useState(mockCompany.departments);
  const [dismissingId, setDismissingId] = useState<string | null>(null); // 却下メモ入力中
  const [reasonDraft, setReasonDraft] = useState('');
  const [showAddDept, setShowAddDept] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'saved' | 'dismissed'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [keyword, setKeyword] = useState('');        // キーワード検索
  const [dateFrom, setDateFrom] = useState('');       // 期間（開始）
  const [dateTo, setDateTo] = useState('');           // 期間（終了）
  const [showFilters, setShowFilters] = useState(false); // フィルターの表示/非表示
  const [isPaid, setIsPaid] = useState(false); // 有料版フラグ（実際はプラン判定に接続）
  // 受け取り条件（売り手向けに公開ページで掲示される）
  const [conditions, setConditions] = useState<string[]>(mockCompany.receivingConditions ?? []);
  const [conditionDraft, setConditionDraft] = useState('');

  const addCondition = () => {
    const v = conditionDraft.trim();
    if (!v) return;
    setConditions(prev => [...prev, v]);
    setConditionDraft('');
  };
  const removeCondition = (i: number) => setConditions(prev => prev.filter((_, idx) => idx !== i));

  const publicUrl = `https://chiyoko-san.github.io/PitchLink/company/${mockCompany.slug}`;
  const unreadCount = pitches.filter(p => p.status === 'unread').length;
  const savedCount = pitches.filter(p => p.status === 'saved').length;

  const filteredPitches = pitches.filter(p => {
    // カテゴリで絞り込み
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;

    // キーワード検索（タイトル・送信者名・会社名）
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      const target = `${p.title} ${p.sender.name} ${p.sender.companyName}`.toLowerCase();
      if (!target.includes(kw)) return false;
    }

    // 期間で絞り込み（受信日）
    const created = new Date(p.createdAt).getTime();
    if (dateFrom && created < new Date(dateFrom).getTime()) return false;
    if (dateTo && created > new Date(dateTo).getTime() + 86400000) return false; // 終了日を含む

    // ステータスで絞り込み
    if (filterStatus === 'unread') return p.status === 'unread';
    if (filterStatus === 'saved') return p.status === 'saved';
    if (filterStatus === 'dismissed') return p.status === 'dismissed';
    return p.status !== 'blocked' && p.status !== 'dismissed';
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // ロック対象の件数（無料枠を超えた古い資料の数）
  // 絞り込み中はロックを適用しない（全件を新着順に見ているときのみ有効）
  const noFilter = filterStatus === 'all' && filterCategory === 'all' && !keyword && !dateFrom && !dateTo;
  const lockedCount = (isPaid || !noFilter) ? 0 : Math.max(0, filteredPitches.length - FREE_VISIBLE_COUNT);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePitchAction = (id: string, action: 'saved' | 'dismissed') => {
    setPitches(prev => prev.map(p => p.id === id ? { ...p, status: action } : p));
  };

  // 却下を確定（理由メモつき）
  const confirmDismiss = (id: string) => {
    setPitches(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'dismissed', dismissReason: reasonDraft.trim() || undefined } : p
    ));
    setDismissingId(null);
    setReasonDraft('');
  };

  const handleAddDept = (data: Omit<Department, 'id' | 'companyId'>) => {
    setDepartments(prev => [...prev, { ...data, id: `d${Date.now()}`, companyId: mockCompany.id }]);
    setShowAddDept(false);
  };

  const handleEditDept = (id: string, data: Omit<Department, 'id' | 'companyId'>) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
    setEditingDeptId(null);
  };

  const handleDeleteDept = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const handleToggleDept = (id: string) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, allowPitches: !d.allowPitches } : d));
  };

  // サイドバーのメニュー定義
  const navItems = [
    { key: 'pitches' as Tab, label: '受信トレイ', icon: Bell, badge: unreadCount },
    { key: 'departments' as Tab, label: '部署設定', icon: Settings },
    { key: 'settings' as Tab, label: '会社設定', icon: Building2 },
  ];
  const linkItems = [
    { label: 'タイムライン', icon: Clock, to: `/company/${mockCompany.slug}/timeline` },
    { label: '料金プラン', icon: CreditCard, to: '/billing' },
    { label: 'ヘルプ', icon: HelpCircle, to: '/faq' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-200 sticky top-0 h-screen`}>
        {/* ロゴ + 開閉ボタン */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {sidebarOpen && <span className="font-bold text-indigo-600 text-lg">PitchLink</span>}
          <button onClick={() => setSidebarOpen(v => !v)}
            className="text-gray-400 hover:text-gray-700 p-1">
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* 会社名 */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400">ログイン中</p>
            <p className="text-sm font-medium text-gray-700 truncate">{mockCompany.name}</p>
          </div>
        )}

        {/* メインメニュー（タブ切替） */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {navItems.map(({ key, label, icon: Icon, badge }) => (
            <button key={key} onClick={() => setTab(key)}
              title={!sidebarOpen ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${tab === key ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'} ${sidebarOpen ? '' : 'justify-center'}`}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="flex-1 text-left">{label}</span>}
              {sidebarOpen && badge != null && badge > 0 && (
                <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{badge}</span>
              )}
              {!sidebarOpen && badge != null && badge > 0 && (
                <span className="absolute right-2 bg-red-500 text-white text-xs w-2 h-2 rounded-full" />
              )}
            </button>
          ))}

          <div className="border-t border-gray-100 my-2" />

          {/* リンクメニュー（別ページ） */}
          {linkItems.map(({ label, icon: Icon, to }) => (
            <Link key={label} to={to}
              title={!sidebarOpen ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition ${sidebarOpen ? '' : 'justify-center'}`}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* 最下部: ログアウト */}
        <div className="px-2 py-3 border-t border-gray-100">
          <Link to="/login"
            title={!sidebarOpen ? 'ログアウト' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition ${sidebarOpen ? '' : 'justify-center'}`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>ログアウト</span>}
          </Link>
        </div>
      </aside>

      {/* 右側: 上部バー + メイン */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-end gap-2">
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}件未読</span>
          )}
          {/* プラン状態。クリックでデモ切替（実際はプラン判定に接続） */}
          <button onClick={() => setIsPaid(v => !v)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full transition ${isPaid ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {isPaid ? '有料版' : '無料版'}
          </button>
          <a href={publicUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition">
            <Eye className="w-3.5 h-3.5" /> 公開ページを見る
          </a>
        </header>

        <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">

        {tab === 'pitches' && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: '未読', value: unreadCount, color: 'text-red-600', bg: 'bg-red-50' },
                { label: '保存済み', value: savedCount, color: 'text-green-600', bg: 'bg-green-50' },
                { label: '全受信', value: pitches.filter(p => p.status !== 'blocked').length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 text-center`}>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* フィルター表示切替 */}
            <button onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-1.5 text-sm text-gray-600 mb-3 hover:text-gray-900">
              <SlidersHorizontal className="w-4 h-4" />
              絞り込み
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFilters && (
            <div>
            <div className="flex gap-2 mb-3">
              {([
                { key: 'all', label: 'すべて' },
                { key: 'unread', label: '未読のみ' },
                { key: 'saved', label: '保存済み' },
                { key: 'dismissed', label: '却下済み' },
              ] as const).map(f => (
                <button key={f.key} onClick={() => setFilterStatus(f.key)}
                  className={`text-sm px-3 py-1.5 rounded-full font-medium transition ${filterStatus === f.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* キーワード・部署・期間で絞り込み */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* キーワード検索 */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="会社名・担当者・タイトルで検索"
                  className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>

              {/* 部署ドロップダウン */}
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value as Category | 'all')}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer">
                <option value="all">すべての部署</option>
                {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>

              {/* 期間指定 */}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700" />
                <span>〜</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700" />
              </div>

              {/* 絞り込みクリア（何か指定があるとき） */}
              {(keyword || dateFrom || dateTo || filterCategory !== 'all') && (
                <button
                  onClick={() => { setKeyword(''); setDateFrom(''); setDateTo(''); setFilterCategory('all'); }}
                  className="text-xs text-gray-500 underline hover:text-gray-700">
                  条件をクリア
                </button>
              )}
            </div>
            </div>
            )}

            {/* 無料枠の案内バナー（古い資料がロックされているとき） */}
            {lockedCount > 0 && (
              <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800 flex-1">
                  無料版では直近{FREE_VISIBLE_COUNT}件まで閲覧できます。古い{lockedCount}件は有料版で閲覧可能です。
                </p>
                <button onClick={() => navigate('/billing')}
                  className="text-xs font-semibold text-white bg-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-700 transition flex-shrink-0">
                  有料版にする
                </button>
              </div>
            )}

            <div className="space-y-2">
              {filteredPitches.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">該当する資料はありません</p>
                </div>
              )}
              {filteredPitches.map((pitch, idx) => {
                const locked = !isPaid && noFilter && idx >= FREE_VISIBLE_COUNT;
                return (
                <div key={pitch.id}
                  className={`bg-white rounded-xl border p-4 transition ${pitch.status === 'unread' ? 'border-indigo-300' : 'border-gray-200'}`}>
                  {locked ? (
                    /* ロック表示（無料枠を超えた古い資料） */
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-400">この資料は有料版で閲覧できます</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDistanceToNow(new Date(pitch.createdAt), { addSuffix: true, locale: ja })}に受信
                        </p>
                      </div>
                      <button onClick={() => navigate('/billing')}
                        className="text-xs font-semibold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition flex-shrink-0">
                        有料版で見る
                      </button>
                    </div>
                  ) : (
                  <>
                  <Link to={`/pitch/${pitch.id}`} className="block hover:opacity-80 transition">
                    <div className="flex items-start gap-3">
                      {pitch.sender.avatarUrl
                        ? <img src={pitch.sender.avatarUrl} className="w-9 h-9 rounded-full flex-shrink-0" alt="" />
                        : <div className="w-9 h-9 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold text-sm">{pitch.sender.name[0]}</div>
                      }
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900">{pitch.sender.name}</span>
                          <span className="text-xs text-gray-400">{pitch.sender.companyName}</span>
                          {pitch.status === 'unread' && <span className="text-xs bg-indigo-600 text-white px-1.5 rounded-full">NEW</span>}
                          {pitch.status === 'saved' && <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded-full">保存済み</span>}
                        </div>
                        <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">{pitch.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[pitch.category]}`}>
                            {CATEGORY_LABELS[pitch.category]}
                          </span>
                          {pitch.attachments.length > 0 && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                              <FileText className="w-3 h-3" /> {pitch.attachments.length}件の資料
                            </span>
                          )}
                          <span className="text-xs text-gray-400 ml-auto">
                            {formatDistanceToNow(new Date(pitch.createdAt), { addSuffix: true, locale: ja })}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                    </div>
                  </Link>

                  {/* 却下理由の表示 */}
                  {pitch.status === 'dismissed' && pitch.dismissReason && (
                    <div className="mt-3 bg-gray-100 rounded-lg px-3 py-2 text-xs text-gray-600">
                      <span className="font-medium text-gray-500">却下理由：</span>{pitch.dismissReason}
                    </div>
                  )}

                  {/* 却下メモ入力欄（却下ボタン押下時に展開） */}
                  {dismissingId === pitch.id ? (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <textarea autoFocus value={reasonDraft} onChange={e => setReasonDraft(e.target.value)}
                        placeholder="何をもって却下したか（例：予算超過 / 要件不一致 / 時期尚早）"
                        rows={2}
                        className="w-full resize-none border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 mb-2" />
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => { setDismissingId(null); setReasonDraft(''); }}
                          className="text-xs font-medium text-gray-500 px-2.5 py-1 rounded-lg hover:bg-gray-100">やめる</button>
                        <button onClick={() => confirmDismiss(pitch.id)}
                          className="text-xs font-medium text-white bg-gray-700 px-2.5 py-1 rounded-lg hover:bg-gray-800">却下する</button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 border-t border-gray-100 pt-3 flex justify-end gap-1.5">
                      <button onClick={() => handlePitchAction(pitch.id, 'saved')}
                        className="text-xs font-medium text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-50">保存</button>
                      <button onClick={() => { setDismissingId(pitch.id); setReasonDraft(pitch.dismissReason ?? ''); }}
                        className="text-xs font-medium text-gray-500 px-2.5 py-1 rounded-lg hover:bg-gray-100">却下</button>
                    </div>
                  )}
                  </>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'departments' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">部署一覧</h2>
                <p className="text-xs text-gray-500 mt-0.5">部署ごとに営業資料の受け取り設定ができます</p>
              </div>
              <button
                onClick={() => {
                  // 無料版で上限に達していたら課金ページへ
                  if (!isPaid && departments.length >= FREE_DEPT_LIMIT) {
                    navigate('/billing');
                  } else {
                    setShowAddDept(true);
                  }
                }}
                className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                <Plus className="w-4 h-4" /> 部署を追加
              </button>
            </div>

            {/* 部署上限の案内（無料版で上限に達したとき） */}
            {!isPaid && departments.length >= FREE_DEPT_LIMIT && (
              <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800 flex-1">
                  無料版で作成できる部署は{FREE_DEPT_LIMIT}個までです。9個目以降は有料版が必要です。
                </p>
                <button onClick={() => navigate('/billing')}
                  className="text-xs font-semibold text-white bg-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-700 transition flex-shrink-0">
                  有料版にする
                </button>
              </div>
            )}

            {showAddDept && (
              <div className="mb-4">
                <DeptForm onSave={handleAddDept} onCancel={() => setShowAddDept(false)} />
              </div>
            )}

            <div className="space-y-3">
              {departments.map(dept => (
                <div key={dept.id}>
                  {editingDeptId === dept.id ? (
                    <DeptForm initial={dept}
                      onSave={(data) => handleEditDept(dept.id, data)}
                      onCancel={() => setEditingDeptId(null)} />
                  ) : (
                    <div className={`bg-white rounded-xl border p-4 ${!dept.allowPitches ? 'opacity-60' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">{dept.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[dept.category]}`}>
                              {CATEGORY_LABELS[dept.category]}
                            </span>
                          </div>
                          {dept.contactEmail && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <Mail className="w-3 h-3" /> {dept.contactEmail}
                            </div>
                          )}
                          {dept.slackWebhook && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <Slack className="w-3 h-3" /> Slack通知あり
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleDept(dept.id)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${dept.allowPitches ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            {dept.allowPitches ? <><ToggleRight className="w-3.5 h-3.5" /> 受付中</> : <><ToggleLeft className="w-3.5 h-3.5" /> 停止中</>}
                          </button>
                          <button onClick={() => setEditingDeptId(dept.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteDept(dept.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-1">あなたの公開URL</h3>
              <p className="text-xs text-gray-500 mb-3">このURLを自社HPに設置してください。営業担当者がここから資料を送ります。</p>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <span className="text-sm text-gray-700 flex-1 truncate">{publicUrl}</span>
                <button onClick={handleCopy}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${copied ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}>
                  {copied ? <><Check className="w-3.5 h-3.5" /> コピー済み</> : <><Copy className="w-3.5 h-3.5" /> コピー</>}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">💡 HPのフッターや問い合わせページへの設置がおすすめです</p>
            </div>

            {/* 受け取り条件の設定 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-1">提案を受け取る条件</h3>
              <p className="text-xs text-gray-500 mb-4">
                ここで設定した条件は公開ページに掲示され、営業担当者が提案を送る前に確認できます。条件を明確にするほど、的外れな提案が減ります。
              </p>

              <div className="space-y-2 mb-3">
                {conditions.length === 0 && (
                  <p className="text-sm text-gray-400">まだ条件が設定されていません。</p>
                )}
                {conditions.map((cond, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700 flex-1">{cond}</span>
                    <button onClick={() => removeCondition(i)}
                      className="text-gray-400 hover:text-red-500 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={conditionDraft}
                  onChange={e => setConditionDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addCondition(); }}
                  placeholder="例：導入実績が3社以上あること"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                <button onClick={addCondition}
                  className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                  <Plus className="w-4 h-4" /> 追加
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">会社情報</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">会社名</label>
                  <input defaultValue={mockCompany.name} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">業種</label>
                  <input defaultValue={mockCompany.industry} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">会社概要</label>
                  <textarea rows={3} defaultValue={mockCompany.description} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">WebサイトURL</label>
                  <input defaultValue={mockCompany.website} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <button className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                  保存する
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">通知設定</h3>
              <div className="space-y-3">
                {[
                  { label: 'メール通知', desc: '新しい資料が届いたらメールで通知', icon: Mail, on: true },
                  { label: 'Slack通知', desc: 'Webhookで指定チャンネルに通知', icon: Slack, on: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full cursor-pointer ${item.on ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
