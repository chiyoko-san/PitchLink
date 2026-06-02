import { Link } from 'react-router-dom';

// フッターのリンク定義。リンク先ページは順次用意する想定。
const LINK_GROUPS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'プロダクト',
    links: [
      { label: '料金プラン', to: '/billing' },
      { label: '公開ページデモ', to: '/company/acme-corp' },
      { label: '管理画面デモ', to: '/dashboard' },
    ],
  },
  {
    title: 'サポート',
    links: [
      { label: 'お問い合わせ', to: '/contact' },
      { label: 'よくある質問', to: '/faq' },
      { label: '使い方ガイド', to: '/guide' },
    ],
  },
  {
    title: '法的情報',
    links: [
      { label: '利用規約', to: '/terms' },
      { label: 'プライバシーポリシー', to: '/privacy' },
      { label: '特定商取引法に基づく表記', to: '/legal' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* 会社・サービス情報 */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 grid place-items-center text-white font-bold">P</div>
              <span className="text-lg font-bold text-white">PitchLink</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              営業電話をなくし、必要な会社に必要なツールが届く世界をつくります。
            </p>
          </div>

          {/* リンク群 */}
          {LINK_GROUPS.map(group => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white mb-3">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 区切りとコピーライト */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© {year} PitchLink. All rights reserved.</p>
          <p className="text-xs text-gray-500">
            運営：（事業者名を記載）／お問い合わせ：support@pitchlink.example.com
          </p>
        </div>
      </div>
    </footer>
  );
}
