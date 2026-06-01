import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Mail, FileText, Video, Link as LinkIcon,
  Bookmark, Trash2, Flag, Star, Lock, ExternalLink,
} from 'lucide-react';
import { mockPitches } from '../utils/mockData';
import { CATEGORY_LABELS, CATEGORY_COLORS, type Attachment } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

// 添付の種類に応じたアイコン
function AttachmentIcon({ type }: { type: Attachment['type'] }) {
  if (type === 'pdf') return <FileText className="w-5 h-5 text-rose-500" />;
  if (type === 'video') return <Video className="w-5 h-5 text-indigo-500" />;
  if (type === 'image') return <FileText className="w-5 h-5 text-emerald-500" />;
  return <LinkIcon className="w-5 h-5 text-gray-400" />;
}

const TYPE_LABEL: Record<Attachment['type'], string> = {
  pdf: 'PDF', video: '動画', link: 'リンク', image: '画像',
};

export default function PitchDetailPage() {
  const { id } = useParams();
  const pitch = mockPitches.find(p => p.id === id);

  // 有料版判定（実際はプラン判定に接続）。デモ用にトグルで切替。
  const [isPaid, setIsPaid] = useState(false);

  if (!pitch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-3">提案が見つかりませんでした</p>
          <Link to="/dashboard" className="text-indigo-600 text-sm hover:underline">受信トレイに戻る</Link>
        </div>
      </div>
    );
  }

  const maxSec = pitch.reading
    ? Math.max(...pitch.reading.pages.map(p => p.seconds))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" /> 受信トレイに戻る
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* 送信者 */}
        <div className="flex items-center gap-3 mb-4">
          {pitch.sender.avatarUrl
            ? <img src={pitch.sender.avatarUrl} className="w-11 h-11 rounded-full" alt="" />
            : <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">{pitch.sender.name[0]}</div>
          }
          <div>
            <p className="font-semibold text-gray-900 text-sm">{pitch.sender.name}</p>
            <p className="text-xs text-gray-500">{pitch.sender.companyName}</p>
          </div>
          <span className="text-xs text-gray-400 ml-auto">
            {formatDistanceToNow(new Date(pitch.createdAt), { addSuffix: true, locale: ja })}
          </span>
        </div>

        {/* タイトル */}
        <div className="mb-6">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[pitch.category]}`}>
            {CATEGORY_LABELS[pitch.category]}
          </span>
          <h1 className="mt-2 text-xl font-bold text-gray-900">{pitch.title}</h1>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{pitch.body}</p>
        </div>

        {/* 御社オリジナル セクション */}
        {pitch.original && (
          <section className="mb-6 rounded-2xl overflow-hidden border border-indigo-200">
            <div className="bg-indigo-600 px-5 py-2.5 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-white fill-white" />
              <h2 className="text-sm font-semibold text-white">御社オリジナル</h2>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-white p-5">
              <p className="font-medium text-gray-900 mb-3">{pitch.original.headline}</p>
              <ul className="space-y-2">
                {pitch.original.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-indigo-600 mt-0.5">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* 資料・動画 セクション */}
        {pitch.attachments.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">資料・動画</h2>
            <div className="space-y-2">
              {pitch.attachments.map(att => (
                <a key={att.id} href={att.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3 hover:border-indigo-300 hover:shadow-sm transition">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <AttachmentIcon type={att.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{att.name}</p>
                    <p className="text-xs text-gray-400">{TYPE_LABEL[att.type]}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300 shrink-0" />
                </a>
              ))}
            </div>
            {/* 受け手への透明性の明示（信頼維持のため） */}
            <p className="mt-3 text-xs text-gray-400">※ 資料の閲覧状況は提案元に共有されます</p>
          </section>
        )}

        {/* 有料版: 読まれたページ分析 */}
        {pitch.reading && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                読まれたページ分析
                <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-xs font-medium normal-case">有料版</span>
              </h2>
              <button onClick={() => setIsPaid(v => !v)} className="text-xs text-gray-400 underline hover:text-gray-600">
                {isPaid ? '無料版で見る' : '有料版プレビュー'}
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-600 mb-4">
                「{pitch.reading.materialName}」で、どのページが長く読まれたか
              </p>
              <div className={`space-y-2 ${isPaid ? '' : 'blur-sm select-none'}`}>
                {pitch.reading.pages.map(p => (
                  <div key={p.page} className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-xs text-gray-500">P.{p.page}</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: `${(p.seconds / maxSec) * 100}%` }} />
                    </div>
                    <span className="w-12 shrink-0 text-right text-xs text-gray-500">{p.seconds}秒</span>
                  </div>
                ))}
              </div>

              {!isPaid && (
                <div className="absolute inset-0 grid place-items-center bg-white/60">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 text-center">
                    <Lock className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
                    <p className="text-sm font-medium text-gray-900">どこが刺さったかが分かります</p>
                    <p className="text-xs text-gray-500 mt-1">有料版で各ページの閲覧時間を確認できます</p>
                    <button className="mt-3 bg-indigo-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                      有料版にする
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 連絡先 */}
        <div className="bg-indigo-50 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs font-semibold text-indigo-700 mb-2">興味がある場合は連絡先を確認</p>
          <div className="flex items-center gap-2 text-sm text-indigo-800">
            <Mail className="w-3.5 h-3.5" />
            <span>{pitch.sender.email}</span>
          </div>
        </div>

        {/* アクション */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
            <Bookmark className="w-4 h-4" /> 保存する
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
            <Trash2 className="w-4 h-4" /> 破棄
          </button>
          <button className="flex items-center justify-center bg-red-50 text-red-500 px-3 py-2.5 rounded-xl hover:bg-red-100 transition">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
