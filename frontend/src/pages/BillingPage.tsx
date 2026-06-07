import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Lock, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// 価格設定（決まったらここを変更）
const PLAN = {
  name: 'PitchLink 有料プラン',
  monthly: 3000,        // 月額（円・税抜）
  taxRate: 0.1,         // 消費税率
};

const yen = (n: number) => '¥' + n.toLocaleString('ja-JP');

// 有料版でできること
const FEATURES = [
  '過去すべての資料を無制限に閲覧',
  '部署を8個以上に増やせる',
  '資料のページ別閲覧時間の分析',
  '広告の非表示',
];

// 無料版と有料版の比較表
const COMPARISON: { label: string; free: string; paid: string }[] = [
  { label: '資料の閲覧', free: '直近5件まで', paid: '無制限' },
  { label: '部署の作成', free: '8個まで', paid: '無制限' },
  { label: 'ページ別閲覧分析', free: '—', paid: '✓' },
  { label: '広告', free: 'あり', paid: 'なし' },
  { label: '受信トレイ・比較', free: '✓', paid: '✓' },
];

// よくある質問
const FAQ: { q: string; a: string }[] = [
  { q: 'いつでも解約できますか？', a: 'はい、いつでも解約できます。解約後も、その月の請求期間が終わるまでは有料版の機能をご利用いただけます。' },
  { q: '支払い方法は何がありますか？', a: '主要なクレジットカード（VISA / Mastercard / JCB / American Express）に対応しています。' },
  { q: '無料版に戻すとどうなりますか？', a: '直近5件より古い資料は閲覧できなくなり、9個目以降の部署も非表示になります。データ自体は保持され、再度有料版にすると元通り閲覧できます。' },
  { q: '請求のタイミングは？', a: 'お申し込み日を起点に毎月自動で更新・請求されます。' },
];

export default function BillingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' });

  const tax = Math.round(PLAN.monthly * PLAN.taxRate);
  const total = PLAN.monthly + tax;

  const handlePay = () => {
    // 実際の決済はStripeなどに接続する。今はダミー処理。
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // 決済成功後はダッシュボードへ（本来は有料フラグを立てて戻す）
      navigate('/dashboard');
    }, 1000);
  };

  const update = (k: keyof typeof card, v: string) => setCard(prev => ({ ...prev, [k]: v }));

  return (
    <Sidebar footer={<Footer />}>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">有料プランにアップグレード</h1>
        <p className="text-sm text-gray-500 mb-8">使い込むほど価値が増す機能を、すべて解放します。</p>

        {/* 無料版 vs 有料版の比較 */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left font-medium text-gray-500 p-4">機能</th>
                <th className="text-center font-medium text-gray-500 p-4 w-32">無料版</th>
                <th className="text-center font-semibold text-indigo-600 p-4 w-32 bg-indigo-50">有料版</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="p-4 text-gray-700">{row.label}</td>
                  <td className="p-4 text-center text-gray-500">{row.free}</td>
                  <td className="p-4 text-center text-gray-900 font-medium bg-indigo-50/50">{row.paid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* 左: プラン内容と請求額 */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-3">{PLAN.name}</h2>
              <ul className="space-y-2 mb-4">
                {FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 請求額の内訳 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-3">請求額</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>月額料金</span><span>{yen(PLAN.monthly)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>消費税（{Math.round(PLAN.taxRate * 100)}%）</span><span>{yen(tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                  <span>合計（月額）</span><span>{yen(total)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">毎月自動更新されます。いつでも解約できます。</p>
            </div>
          </div>

          {/* 右: 支払い情報 */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-gray-900">支払い情報</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">カード番号</label>
                  <input value={card.number} onChange={e => update('number', e.target.value)}
                    placeholder="1234 5678 9012 3456" inputMode="numeric"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">カード名義</label>
                  <input value={card.name} onChange={e => update('name', e.target.value)}
                    placeholder="TARO YAMADA"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">有効期限</label>
                    <input value={card.expiry} onChange={e => update('expiry', e.target.value)}
                      placeholder="MM / YY"
                      className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">セキュリティコード</label>
                    <input value={card.cvc} onChange={e => update('cvc', e.target.value)}
                      placeholder="CVC" inputMode="numeric"
                      className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                </div>

                <button onClick={handlePay} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {yen(total)}を支払う
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <Lock className="w-3 h-3" /> 決済情報は暗号化されて安全に処理されます
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="font-medium text-gray-900 text-sm mb-1">{item.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
