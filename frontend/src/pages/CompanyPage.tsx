import { Building2, Globe, Mail, Send } from 'lucide-react';
import { mockCompany } from '../utils/mockData';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types';
import { Link } from 'react-router-dom';

export default function CompanyPage() {
  const company = mockCompany;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-indigo-600 text-lg">PitchLink</span>
        <a href="#send-pitch" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          資料を送る
        </a>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-gray-200 px-6 py-10">
        <div className="max-w-2xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{company.industry}</p>
            <p className="text-sm text-gray-600 mt-2">{company.description}</p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-600 mt-2 hover:underline">
                <Globe className="w-3.5 h-3.5" /> {company.website}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Departments */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">部署一覧</h2>
          <div className="space-y-3">
            {company.departments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{dept.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[dept.category]}`}>
                      {CATEGORY_LABELS[dept.category]}
                    </span>
                  </div>
                  {dept.contactEmail && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{dept.allowPitches ? '資料受け取り可' : '受け取り停止中'}</span>
                    </div>
                  )}
                </div>
                {dept.allowPitches ? (
                  <a href="#send-pitch" className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> 送付する
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">受け取り停止</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Send Pitch Form */}
        <section id="send-pitch" className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">資料を送付する</h2>
          <p className="text-sm text-gray-500 mb-5">担当部署を選択して、資料とご挨拶を送ってください。</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">送付先部署</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                <option value="">選択してください</option>
                {company.departments.filter(d => d.allowPitches).map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
              <input type="text" placeholder="例：マーケティングツールのご提案" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ご挨拶・概要</label>
              <textarea rows={4} placeholder="会社名・お名前・提案の概要をご記入ください" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">資料の添付（PDF / リンク）</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500 hover:border-indigo-400 transition cursor-pointer">
                クリックしてファイルを選択、またはドラッグ＆ドロップ
              </div>
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> 送付する
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
