import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2, Loader2 } from 'lucide-react';

type Mode = 'login' | 'signup';

// Googleアイコン（lucide-reactにブランドロゴが無いためSVGで用意）
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.22V7.04H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 実際の認証はバックエンド or Clerk/Auth.js に接続する。
  // 今はUIの流れを確認するためのダミー処理。
  const handleSubmit = () => {
    setError('');
    if (!email || !password || (mode === 'signup' && !companyName)) {
      setError('必要な項目を入力してください');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard'); // 認証成功後はダッシュボードへ
    }, 800);
  };

  const handleSocial = (_provider: 'google') => {
    // 実際はClerk/Auth.jsのソーシャルログインに接続
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 grid place-items-center text-white font-bold">P</div>
          <span className="text-xl font-bold text-indigo-600">PitchLink</span>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {/* タブ */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {([
              { key: 'login', label: 'ログイン' },
              { key: 'signup', label: '新規登録' },
            ] as const).map(t => (
              <button key={t.key}
                onClick={() => { setMode(t.key); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === t.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <h1 className="text-lg font-bold text-gray-900 mb-1">
            {mode === 'login' ? 'おかえりなさい' : 'アカウントを作成'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login' ? 'PitchLinkにログインします' : '営業電話のない世界をはじめましょう'}
          </p>

          {/* ソーシャルログイン */}
          <button onClick={() => handleSocial('google')} disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
            <GoogleIcon /> Googleで{mode === 'login' ? 'ログイン' : '登録'}
          </button>

          {/* 区切り */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">または</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* フォーム */}
          <div className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">会社名</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                    placeholder="株式会社サンプル"
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">メールアドレス</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">パスワード</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button className="text-xs text-indigo-600 hover:underline">パスワードをお忘れですか？</button>
              </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'ログイン' : 'アカウントを作成'}
            </button>
          </div>

          {/* 新規登録時の規約同意（情報発信のための匿名化利用をここで明示） */}
          {mode === 'signup' && (
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              登録すると<button className="text-indigo-600 hover:underline">利用規約</button>および<button className="text-indigo-600 hover:underline">プライバシーポリシー</button>に同意したものとみなされます。サービス内の行動データは個社が特定できない形に集計・匿名化したうえで、業界傾向の把握に利用されることがあります。
            </p>
          )}
        </div>

        {/* 下部の切り替え誘導 */}
        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === 'login' ? (
            <>アカウントをお持ちでないですか？{' '}
              <button onClick={() => setMode('signup')} className="text-indigo-600 font-medium hover:underline">新規登録</button>
            </>
          ) : (
            <>すでにアカウントをお持ちですか？{' '}
              <button onClick={() => setMode('login')} className="text-indigo-600 font-medium hover:underline">ログイン</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
