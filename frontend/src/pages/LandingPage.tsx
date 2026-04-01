import { Link } from 'react-router-dom';
import { PhoneOff, Send, FileText, Shield, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="px-8 py-5 flex items-center justify-between border-b border-gray-100">
        <span className="font-bold text-indigo-600 text-xl">PitchLink</span>
        <div className="flex items-center gap-4">
          <Link to="/company/acme-corp" className="text-sm text-gray-600 hover:text-gray-900">デモを見る</Link>
          <button className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            無料で始める
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
          <PhoneOff className="w-4 h-4" /> 営業電話をゼロにする
        </div>
        <h1 className="text-5xl font-black text-gray-900 leading-tight">
          資料で伝える。<br />
          <span className="text-indigo-600">電話はもういらない。</span>
        </h1>
        <p className="text-lg text-gray-600 mt-6 leading-relaxed">
          PitchLinkは企業に専用URLを発行し、<br />
          営業連絡をすべてテキストと資料に置き換えるプラットフォームです。
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-lg">
            無料で始める
          </button>
          <Link to="/company/acme-corp" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 font-medium transition">
            デモを見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">両サイドにメリット</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📤 営業する側</h3>
              <ul className="space-y-3 text-gray-600">
                {['電話アポのストレスがなくなる', '資料のクオリティで差をつけられる', 'いつでもどこでもアプローチ可能', '開封・反応率がトラッキングできる'].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📥 受け取る側</h3>
              <ul className="space-y-3 text-gray-600">
                {['業務中に電話が来なくなる', '資料を先に読んで判断できる', '興味ある会社にだけ返信できる', '部署ごとに管理・フィルタリング'].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">使い方</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, step: '01', title: 'URLを発行', desc: '企業専用のURLを発行して自社HPに掲載するだけ。' },
            { icon: Send, step: '02', title: '資料が届く', desc: '営業担当者がURLから資料と挨拶を送付。電話は一切なし。' },
            { icon: FileText, step: '03', title: '判断して返信', desc: '資料を読んで興味があれば連絡先を開示して連絡。' },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-sm font-bold text-indigo-400">STEP {step}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
        © 2024 PitchLink. All rights reserved.
      </footer>
    </div>
  );
}
