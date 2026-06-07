import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Send, Crown, Layers, TrendingUp, ExternalLink,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { mockAdminCompanies, type AdminCompany } from '../utils/mockData';

// 数値を3桁区切りで表示
const fmt = (n: number) => n.toLocaleString('ja-JP');

// KPIカード1枚
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

// 横棒の分布行
function DistRow({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-sm text-gray-600 truncate">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-semibold text-gray-700">{count}</span>
    </div>
  );
}

type SortKey = 'pitchCount' | 'registeredAt' | 'name';

export default function AdminPage() {
  const companies = mockAdminCompanies;
  const [sortKey, setSortKey] = useState<SortKey>('pitchCount');

  // 集計
  const stats = useMemo(() => {
    const total = companies.length;
    const paid = companies.filter(c => c.plan === 'paid').length;
    const free = total - paid;
    const totalPitches = companies.reduce((s, c) => s + c.pitchCount, 0);
    const totalDepts = companies.reduce((s, c) => s + c.departmentCount, 0);

    // 業種別分布
    const byIndustry = companies.reduce<Record<string, number>>((acc, c) => {
      acc[c.industry] = (acc[c.industry] || 0) + 1;
      return acc;
    }, {});
    const industries = Object.entries(byIndustry).sort((a, b) => b[1] - a[1]);
    const industryMax = Math.max(...industries.map(([, n]) => n), 1);

    return { total, paid, free, totalPitches, totalDepts, industries, industryMax };
  }, [companies]);

  const paidRate = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0;

  // 企業一覧の並び替え
  const sorted = useMemo(() => {
    const arr = [...companies];
    if (sortKey === 'pitchCount') arr.sort((a, b) => b.pitchCount - a.pitchCount);
    if (sortKey === 'name') arr.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    if (sortKey === 'registeredAt') arr.sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
    return arr;
  }, [companies, sortKey]);

  return (
    <Sidebar footer={<Footer />}>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 見出し */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-indigo-600 mb-1">運営管理</p>
          <h1 className="text-2xl font-bold text-gray-900">プラットフォーム全体の状況</h1>
          <p className="text-sm text-gray-500 mt-1">
            登録企業・受信提案の全体集計です。※ 現在はデモデータを表示しています。
          </p>
        </div>

        {/* KPIカード */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard icon={Building2} label="登録企業数" value={fmt(stats.total)} sub={`部署 ${fmt(stats.totalDepts)} 件`} accent="bg-indigo-50 text-indigo-600" />
          <StatCard icon={Send} label="提案（ピッチ）総数" value={fmt(stats.totalPitches)} sub="全企業の受信合計" accent="bg-teal-50 text-teal-600" />
          <StatCard icon={Crown} label="有料プラン企業" value={fmt(stats.paid)} sub={`有料化率 ${paidRate}%`} accent="bg-amber-50 text-amber-600" />
          <StatCard icon={Layers} label="無料プラン企業" value={fmt(stats.free)} sub="アップセル対象" accent="bg-gray-100 text-gray-600" />
        </div>

        {/* 有料 / 無料の内訳バー */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">プラン内訳</h2>
          <div className="flex h-4 rounded-full overflow-hidden mb-3">
            <div className="bg-indigo-600 h-full" style={{ width: `${paidRate}%` }} title={`有料 ${stats.paid}`} />
            <div className="bg-gray-200 h-full" style={{ width: `${100 - paidRate}%` }} title={`無料 ${stats.free}`} />
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" /> 有料 {stats.paid}社（{paidRate}%）
            </span>
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> 無料 {stats.free}社（{100 - paidRate}%）
            </span>
          </div>
        </section>

        {/* 業種別分布 */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
          <div className="flex items-center gap-1.5 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-semibold text-gray-800">業種別の登録企業数</h2>
          </div>
          <div className="space-y-2.5">
            {stats.industries.map(([industry, count]) => (
              <DistRow key={industry} label={industry} count={count} max={stats.industryMax} color="bg-indigo-500" />
            ))}
          </div>
        </section>

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
              <option value="registeredAt">登録が新しい順</option>
              <option value="name">企業名順</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">企業名</th>
                  <th className="px-4 py-3 font-medium">業種</th>
                  <th className="px-4 py-3 font-medium">プラン</th>
                  <th className="px-4 py-3 font-medium text-right">提案数</th>
                  <th className="px-4 py-3 font-medium text-right">部署</th>
                  <th className="px-4 py-3 font-medium">登録日</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c: AdminCompany) => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.industry}</td>
                    <td className="px-4 py-3">
                      {c.plan === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          <Crown className="w-3 h-3" /> 有料
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">無料</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-700">{c.pitchCount}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{c.departmentCount}</td>
                    <td className="px-4 py-3 text-gray-500">{c.registeredAt}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/company/${c.slug}`} className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-xs">
                        公開ページ <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </Sidebar>
  );
}
