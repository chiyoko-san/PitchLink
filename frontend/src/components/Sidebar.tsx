import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Clock, CreditCard, HelpCircle,
  LogOut, PanelLeftClose, PanelLeft, ShieldCheck,
} from 'lucide-react';
import { mockCompany } from '../utils/mockData';

// 管理画面系ページで共通利用するサイドバー付きレイアウト。
// children に各ページの中身を渡す。
// header に各ページ独自の上部バー要素を渡せる（任意）。
export default function Sidebar({ children, header, footer }: { children: ReactNode; header?: ReactNode; footer?: ReactNode }) {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  // ページ遷移リンク。現在地はハイライトする。
  const links = [
    { label: 'ダッシュボード', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'タイムライン', icon: Clock, to: `/company/${mockCompany.slug}/timeline` },
    { label: '料金プラン', icon: CreditCard, to: '/billing' },
    { label: '運営管理', icon: ShieldCheck, to: '/admin' },
    { label: 'ヘルプ', icon: HelpCircle, to: '/faq' },
  ];

  const isActive = (to: string) => location.pathname === to.split('?')[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 上段: サイドバー + 中身（横並び） */}
      <div className="flex flex-1 min-h-0">
      {/* サイドバー */}
      <aside className={`${open ? 'w-60' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-200 sticky top-0 h-screen self-start shrink-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {open && <Link to="/dashboard" className="font-bold text-indigo-600 text-lg">PitchLink</Link>}
          <button onClick={() => setOpen(v => !v)} className="text-gray-400 hover:text-gray-700 p-1">
            {open ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400">ログイン中</p>
            <p className="text-sm font-medium text-gray-700 truncate">{mockCompany.name}</p>
          </div>
        )}

        <nav className="flex-1 px-2 py-3 space-y-1">
          {links.map(({ label, icon: Icon, to }) => (
            <Link key={label} to={to}
              title={!open ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive(to) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'} ${open ? '' : 'justify-center'}`}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {open && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-gray-100">
          <Link to="/login"
            title={!open ? 'ログアウト' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition ${open ? '' : 'justify-center'}`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {open && <span>ログアウト</span>}
          </Link>
        </div>
      </aside>

      {/* 右側: 上部バー + 中身 */}
      <div className="flex-1 min-w-0 flex flex-col">
        {header && (
          <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-end gap-2">
            {header}
          </header>
        )}
        <div className="flex-1">{children}</div>
      </div>
      </div>

      {/* 下段: フッター（サイドバー幅を含めた画面全幅） */}
      {footer}
    </div>
  );
}
