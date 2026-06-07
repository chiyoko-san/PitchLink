import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Send, Crown, Activity, AlertTriangle, BookmarkCheck,
  TrendingUp, ExternalLink,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  mockAdminCompanies, mockMonthlySignups, mockDismissReasons,
  type AdminCompany,
} from '../utils/mockData';

const fmt = (n: number) => n.toLocaleString('ja-JP');

// アクティブ判定の閾値（最終受信からの日数）
const ACTIVE_DAYS = 30;

// 業種ごとのドーナツ色（navy/indigo/teal系を基調に展開）
const DONUT_COLORS = [
  '#4338CA', '#0F9488', '#6366F1', '#14B8A6', '#818CF8',
  '#2DD4BF', '#1E2761', '#0D9488', '#A5B4FC', '#5EEAD4',
];

function StatCard({
  icon: Icon, label, value, sub, accent,
}: {
  icon: typeof Building2; label: string; value: string; sub?: string; accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-9 h-9 rounded-lg grid place-items-center ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-3xl font-black text-gray-900 leading-none">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-2">{sub}</p>}
    </div>
  );
}

// 累計登録社数の折れ線（SVG自作）
function GrowthChart({ data }: { data: { month: string; cumulative: number }[] }) {
  const W = 640, H = 200, PAD = 28;
  const max = Math.max(...data.map(d => d.cumulative), 1);
  const stepX = (W - PAD * 2) / (data.length - 1);
  const pts = data.map((d, i) => {
    const x = PAD + i * stepX;
    const y = H - PAD - ((d.cumulative / max) * (H - PAD * 2));
    return { x, y, ...d };
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${H - PAD} L${pts[0].x.toFixed(1)},${H - PAD} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="月次累計登録企業数の推移">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4338CA" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4338CA" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 横グリッド */}
      {[0, 0.5, 1].map(f => {
        const y = H - PAD - f * (H - PAD * 2);
        return (
          <g key={f}>
            <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#F3F4F6" strokeWidth="1" />
            <text x={PAD - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#9CA3AF">{Math.round(max * f)}</text>
          </g>
        );
      })}
      <path d={area} fill="url(#grad)" />
      <path d={line} fill="none" stroke="#4338CA" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#4338CA" />
      ))}
      {/* x軸ラベル（隔月） */}
      {pts.map((p, i) => i % 3 === 0 ? (
        <text key={i} x={p.x} y={H - PAD + 14} textAnchor="middle" fontSize="9" fill="#9CA3AF">
          {p.month.slice(2)}
        </text>
      ) : null)}
    </svg>
  );
}

// 業種別ドーナツ（SVG自作）
function Donut({ data }: { data: { label: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const R = 70, STROKE = 28, C = 90;
  const circ = 2 * Math.PI * R;
  let offset = 0;
  const segs = data.map((d, i) => {
    const frac = d.count / total;
    const seg = {
      dash: frac * circ,
      gap: circ - frac * circ,
      offset: -offset * circ,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
      ...d,
    };
    offset += frac;
    return seg;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 180 180" className="w-44 h-44 shrink-0" role="img" aria-label="業種別の登録企業構成比">
        <g transform="rotate(-90 90 90)">
          {segs.map((s, i) => (
            <circle
              key={i} cx={C} cy={C} r={R} fill="none"
              stroke={s.color} strokeWidth={STROKE}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.offset}
            />
          ))}
        </g>
        <text x="90" y="86" textAnchor="middle" fontSize="22" fontWeight="800" fill="#111827">{total}</text>
        <text x="90" y="104" textAnchor="middle" fontSize="10" fill="#9CA3AF">社</text>
      </svg>
      <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-sm">
        {segs.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
            <span className="text-gray-600 truncate">{s.label}</span>
            <span className="text-gray-400 ml-auto">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type SortKey = 'pitchCount' | 'registeredMonth' | 'name';

export default function AdminPage() {
  const companies = mockAdminCompanies;
  const [sortKey, setSortKey] = useState<SortKey>('pitchCount');

  const stats = useMemo(() => {
    const total = companies.length;
    const paid = companies.filter(c => c.plan === 'paid').length;
    const totalPitches = companies.reduce((s, c) => s + c.pitchCount, 0);
    const zeroPitch = companies.filter(c => c.pitchCount === 0).length;
    const active = companies.filter(c => c.daysSinceLastPitch <= ACTIVE_DAYS).length;
    const totalSaved = companies.reduce((s, c) => s + c.savedCount, 0);
    const totalDismissed = companies.reduce((s, c) => s + c.dismissedCount, 0);

    const byIndustry = companies.reduce<Record<string, number>>((acc, c) => {
      acc[c.industry] = (acc[c.industry] || 0) + 1;
      return acc;
    }, {});
    const industries = Object.entries(byIndustry)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }));

    return { total, paid, totalPitches, zeroPitch, active, totalSaved, totalDismissed, industries };
  }, [companies]);

  const paidRate = stats.total ? Math.round((stats.paid / stats.total) * 100) : 0;
  const activeRate = stats.total ? Math.round((stats.active / stats.total) * 100) : 0;
  const avgPitch = stats.total ? (stats.totalPitches / stats.total).toFixed(1) : '0';
  // 保存率: 選別された提案（保存+却下）のうち保存された割合 = マッチング品質
  const decided = stats.totalSaved + stats.totalDismissed;
  const saveRate = decided ? Math.round((stats.totalSaved / decided) * 100) : 0;
  const dismissMax = Math.max(...mockDismissReasons.map(r => r.count), 1);

  const sorted = useMemo(() => {
    const arr = [...companies];
    if (sortKey === 'pitchCount') arr.sort((a, b) => b.pitchCount - a.pitchCount);
    if (sortKey === 'name') arr.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    if (sortKey === 'registeredMonth') arr.sort((a, b) => b.registeredMonth.localeCompare(a.registeredMonth));
    return arr;
  }, [companies, sortKey]);

  return (
    <Sidebar footer={<Footer />}>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-xs font-semibold text-indigo-600 mb-1">運営管理</p>
          <h1 className="text-2xl font-bold text-gray-900">プラットフォーム全体の状況</h1>
          <p className="text-sm text-gray-500 mt-1">
            登録企業・受信提案・マッチング品質の全体集計です。※ 現在はデモデータを表示しています。
          </p>
        </div>

        {/* KPIカード（2行） */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          <StatCard icon={Building2} label="登録企業数" value={fmt(stats.total)} sub={`今月 +${mockMonthlySignups[mockMonthlySignups.length - 1].newCount} 社`} accent="bg-indigo-50 text-indigo-600" />
          <StatCard icon={Send} label="提案（ピッチ）総数" value={fmt(stats.totalPitches)} sub={`1社あたり平均 ${avgPitch} 件`} accent="bg-teal-50 text-teal-600" />
          <StatCard icon={Crown} label="有料転換率" value={`${paidRate}%`} sub={`有料 ${stats.paid} 社 / 無料 ${stats.total - stats.paid} 社`} accent="bg-amber-50 text-amber-600" />
          <StatCard icon={Activity} label="アクティブ企業率" value={`${activeRate}%`} sub={`直近${ACTIVE_DAYS}日に受信 ${stats.active} 社`} accent="bg-green-50 text-green-600" />
          <StatCard icon={AlertTriangle} label="提案ゼロ企業" value={fmt(stats.zeroPitch)} sub="離脱リスク・要フォロー" accent="bg-rose-50 text-rose-500" />
          <StatCard icon={BookmarkCheck} label="提案の保存率" value={`${saveRate}%`} sub="選別された提案のうち保存" accent="bg-indigo-50 text-indigo-600" />
        </div>

        {/* 成長グラフ */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-semibold text-gray-800">登録企業数の推移（累計）</h2>
          </div>
          <p className="text-xs text-gray-400 mb-3">受け手企業が増えるほど売り手も集まる自己強化型の成長を確認できます。</p>
          <GrowthChart data={mockMonthlySignups} />
        </section>

        {/* 業種別ドーナツ + プラン内訳 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <section className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">業種別の登録企業構成</h2>
            <Donut data={stats.industries} />
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-1">却下理由の分布</h2>
            <p className="text-xs text-gray-400 mb-4">どんな提案が買い手に響かないか。売り手の改善材料になります。</p>
            <div className="space-y-2.5">
              {mockDismissReasons.map(r => {
                const pct = Math.round((r.count / dismissMax) * 100);
                return (
                  <div key={r.reason} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-sm text-gray-600 truncate">{r.reason}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-10 shrink-0 text-right text-sm font-semibold text-gray-700">{r.count}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* 企業一覧 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">登録企業一覧</h2>
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-white"
            >
              <option value="pitchCount">提案数が多い順</option>
              <option value="registeredMonth">登録が新しい順</option>
              <option value="name">企業名順</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">企業名</th>
                  <th className="px-4 py-3 font-medium">業種</th>
                  <th className="px-4 py-3 font-medium">プラン</th>
                  <th className="px-4 py-3 font-medium text-right">提案数</th>
                  <th className="px-4 py-3 font-medium text-right">保存</th>
                  <th className="px-4 py-3 font-medium">状態</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 30).map((c: AdminCompany) => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.industry}</td>
                    <td className="px-4 py-3">
                      {c.plan === 'paid'
                        ? <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><Crown className="w-3 h-3" /> 有料</span>
                        : <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">無料</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-700">{c.pitchCount}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{c.savedCount}</td>
                    <td className="px-4 py-3">
                      {c.pitchCount === 0
                        ? <span className="text-xs text-rose-500">提案ゼロ</span>
                        : c.daysSinceLastPitch <= ACTIVE_DAYS
                          ? <span className="text-xs text-green-600">アクティブ</span>
                          : <span className="text-xs text-gray-400">休眠ぎみ</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/company/${c.slug}`} className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-xs whitespace-nowrap">
                        公開ページ <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">上位30社を表示しています（全{stats.total}社）。</p>
        </section>
      </main>
    </Sidebar>
  );
}
