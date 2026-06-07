import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

// 公開・集客系ページ（Landing / Company / Timeline）で共通利用するレイアウト。
// ヘッダー（ロゴ）とフッターをここに集約し、各ページは中身だけを children で渡す。
//
// headerActions : ヘッダー右側に差し込む要素（ページごとに異なる。任意）
// subtitle      : ロゴ横に出す補助テキスト（例: 会社名。任意）
// bg            : 最上位の背景クラス（既定は bg-gray-50）
export default function PublicLayout({
  children,
  headerActions,
  subtitle,
  bg = 'bg-gray-50',
}: {
  children: ReactNode;
  headerActions?: ReactNode;
  subtitle?: ReactNode;
  bg?: string;
}) {
  return (
    <div className={`min-h-screen ${bg} flex flex-col`}>
      {/* 共通ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-indigo-600 text-lg">PitchLink</Link>
          {subtitle && <span className="ml-2 text-sm text-gray-500">{subtitle}</span>}
        </div>
        {headerActions && <div className="flex items-center gap-3">{headerActions}</div>}
      </header>

      {/* 各ページの中身 */}
      <main className="flex-1">{children}</main>

      {/* 共通フッター */}
      <Footer />
    </div>
  );
}
