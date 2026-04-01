import { useState } from 'react';
import { Bookmark, Trash2, Flag, FileText, Link as LinkIcon, Video, Bell, Filter } from 'lucide-react';
import { mockPitches } from '../utils/mockData';
import { CATEGORY_LABELS, CATEGORY_COLORS, type Category, type Pitch } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

const ALL_CATEGORIES: Category[] = ['marketing', 'system', 'hr', 'finance', 'executive', 'other'];

export default function TimelinePage() {
  const [pitches, setPitches] = useState<Pitch[]>(mockPitches);
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [activePitch, setActivePitch] = useState<Pitch | null>(null);

  const filtered = filter === 'all' ? pitches : pitches.filter(p => p.category === filter);

  const handleAction = (id: string, action: 'saved' | 'dismissed' | 'blocked') => {
    setPitches(prev => prev.map(p => p.id === id ? { ...p, status: action } : p));
    setActivePitch(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-bold text-indigo-600 text-lg">PitchLink</span>
          <span className="ml-2 text-sm text-gray-500">ACME株式会社</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto w-full px-4 py-6 flex-1">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => setFilter('all')}
            className={`text-sm px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            すべて
          </button>
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-sm px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${filter === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Pitch List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>まだ届いた資料はありません</p>
            </div>
          )}
          {filtered.map(pitch => (
            <div
              key={pitch.id}
              onClick={() => setActivePitch(pitch)}
              className={`bg-white rounded-xl border cursor-pointer transition hover:shadow-md ${
                pitch.status === 'unread' ? 'border-indigo-200 shadow-sm' : 'border-gray-200'
              } ${activePitch?.id === pitch.id ? 'ring-2 ring-indigo-400' : ''}`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {pitch.sender.avatarUrl ? (
                    <img src={pitch.sender.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm">{pitch.sender.name}</span>
                      <span className="text-xs text-gray-500">{pitch.sender.companyName}</span>
                      {pitch.status === 'unread' && (
                        <span className="text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">新着</span>
                      )}
                      {pitch.status === 'saved' && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">保存済み</span>
                      )}
                    </div>
                    <p className="font-semibold text-gray-800 mt-1 text-sm">{pitch.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{pitch.body}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[pitch.category]}`}>
                        {CATEGORY_LABELS[pitch.category]}
                      </span>
                      {pitch.attachments.map(att => (
                        <span key={att.id} className="text-xs text-gray-400 flex items-center gap-0.5">
                          {att.type === 'pdf' && <FileText className="w-3 h-3" />}
                          {att.type === 'link' && <LinkIcon className="w-3 h-3" />}
                          {att.type === 'video' && <Video className="w-3 h-3" />}
                          {att.name}
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 ml-auto">
                        {formatDistanceToNow(new Date(pitch.createdAt), { addSuffix: true, locale: ja })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              {activePitch?.id === pitch.id && (
                <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2 bg-gray-50 rounded-b-xl">
                  <p className="text-xs text-gray-500 flex-1 line-clamp-3 leading-relaxed">{pitch.body}</p>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAction(pitch.id, 'saved'); }}
                      className="flex items-center gap-1 text-xs text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition"
                    >
                      <Bookmark className="w-3.5 h-3.5" /> 保存
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAction(pitch.id, 'dismissed'); }}
                      className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 破棄
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAction(pitch.id, 'blocked'); }}
                      className="flex items-center gap-1 text-xs text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition"
                    >
                      <Flag className="w-3.5 h-3.5" /> 報告
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
