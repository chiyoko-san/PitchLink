import { useState } from 'react';
import {
  Building2, Plus, Trash2, Pencil, Check, X,
  Bell, Mail, Slack, Copy, Eye, Settings,
  FileText, Bookmark, Flag, ChevronRight,
  ToggleLeft, ToggleRight, ExternalLink
} from 'lucide-react';
import { mockCompany, mockPitches } from '../utils/mockData';
import {
  CATEGORY_LABELS, CATEGORY_COLORS,
  type Category, type Department, type Pitch
} from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

type Tab = 'pitches' | 'departments' | 'settings';

const ALL_CATEGORIES: { value: Category; label: string }[] = [
  { value: 'marketing', label: 'マーケティング' },
  { value: 'system', label: 'システム' },
  { value: 'hr', label: '人事' },
  { value: 'finance', label: '経理・財務' },
  { value: 'executive', label: '経営' },
  { value: 'other', label: 'その他' },
];

function PitchModal({ pitch, onClose, onAction }: {
  pitch: Pitch;
  onClose: () => void;
  onAction: (id: string, action: 'saved' | 'dismissed') => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {pitch.sender.avatarUrl
              ? <img src={pitch.sender.avatarUrl} className="w-10 h-10 rounded-full" alt="" />
              : <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">{pitch.sender.name[0]}</div>
            }
            <div>
              <p className="font-semibold text-gray-900 text-sm">{pitch.sender.name}</p>
              <p className="text-xs text-gray-500">{pitch.sender.companyName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[pitch.category]}`}>
              {CATEGORY_LABELS[pitch.category]}
            </span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(pitch.createdAt), { addSuffix: true, locale: ja })}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-3">{pitch.title}</h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{pitch.body}</p>
          {pitch.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">添付資料</p>
              {pitch.attachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-gray-700 flex-1">{att.name}</span>
                  <a href={att.url} className="text-xs text-indigo-600 flex items-center gap-0.5 hover:underline">
                    開く <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mx-6 mb-4 bg-indigo-50 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-indigo-700 mb-2">興味がある場合は連絡先を確認</p>
          <div className="flex items-center gap-2 text-sm text-indigo-800">
            <Mail className="w-3.5 h-3.5" />
            <span>{pitch.sender.email}</span>
          </div>
        </div>
        <div className="flex gap-2 px-6 pb-5">
          <button
            onClick={() => { onAction(pitch.id, 'saved'); onClose(); }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
          >
            <Bookmark className="w-4 h-4" /> 保存する
          </button>
          <button
            onClick={() => { onAction(pitch.id, 'dismissed'); onClose(); }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
          >
            <Trash2 className="w-4 h-4" /> 破棄
          </button>
          <button className="flex items-center justify-center gap-1 bg-red-50 text-red-500 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [tab, setTab] = useState<Tab>('pitches');
  const [pitches, setPitches] = useState(mockPitches);
  const [departments, setDepartments] = useState(mockCompany.departments);
  const [activePitch, setActivePitch] = useState<Pitch | null>(null);
  const [showAddDept, setShowAddDept] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'saved'>('all');

  const publicUrl = `https://chiyoko-san.github.io/PitchLink/company/${mockCompany.slug}`;
  const unreadCount = pitches.filter(p => p.status === 'unread').length;
  const savedCount = pitches.filter(p => p.status === 'saved').length;

  const filteredPitches = pitches.filter(p => {
    if (filterStatus === 'unread') return p.status === 'unread';
    if (filterStatus === 'saved') return p.status === 'saved';
    return p.status !== 'blocked' && p.status !== 'dismissed';
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePitchAction = (id: string, action: 'saved' | 'dismissed') => {
    setPitches(prev => prev.map(p => p.id === id ? { ...p, status: action } : p));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-indigo-600 text-lg">PitchLink</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">{mockCompany.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}件未読</span>
          )}
          <a href={publicUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition">
            <Eye className="w-3.5 h-3.5" /> 公開ページを見る
          </a>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {([
            { key: 'pitches', label: '受信トレイ', icon: Bell },
            { key: 'departments', label: '部署設定', icon: Settings },
            { key: 'settings', label: '会社設定', icon: Building2 },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition ${tab === key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Icon className="w-4 h-4" /> {label}
              {key === 'pitches' && unreadCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

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

            <div className="flex gap-2 mb-4">
              {([
                { key: 'all', label: 'すべて' },
                { key: 'unread', label: '未読のみ' },
                { key: 'saved', label: '保存済み' },
              ] as const).map(f => (
                <button key={f.key} onClick={() => setFilterStatus(f.key)}
                  className={`text-sm px-3 py-1.5 rounded-full font-medium transition ${filterStatus === f.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredPitches.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">該当する資料はありません</p>
                </div>
              )}
              {filteredPitches.map(pitch => (
                <button key={pitch.id} onClick={() => setActivePitch(pitch)}
                  className={`w-full text-left bg-white rounded-xl border p-4 hover:shadow-md transition ${pitch.status === 'unread' ? 'border-indigo-300' : 'border-gray-200'}`}>
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
                </button>
              ))}
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
              <button onClick={() => setShowAddDept(true)}
                className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                <Plus className="w-4 h-4" /> 部署を追加
              </button>
            </div>

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

      {activePitch && (
        <PitchModal pitch={activePitch} onClose={() => setActivePitch(null)} onAction={handlePitchAction} />
      )}
    </div>
  );
}
