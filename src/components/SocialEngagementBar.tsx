import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Send, Check } from 'lucide-react';
import { EngagementComment } from '../types';

interface SocialEngagementBarProps {
  itemId: string;
  initialLikes?: number;
  initialComments?: EngagementComment[];
  initialShares?: number;
  titleForShare?: string;
  targetTitle?: string;
  variant?: 'compact' | 'standard';
}

export const SocialEngagementBar: React.FC<SocialEngagementBarProps> = ({
  itemId,
  initialLikes = 48,
  initialComments = [
    { id: 'c-1', author: 'ዲ/ን ዳዊት', text: 'ቃለ ሕይወትን ያሰማልን አሜን።', time: 'ከ1 ሰዓት በፊት' },
    { id: 'c-2', author: 'እኅት ማርታ', text: 'በረከታቸው ይደርብን! ትልቅ መንፈሳዊ ትምህርት ነው።', time: 'ከ35 ደቂቃ በፊት' }
  ],
  initialShares = 14,
  titleForShare,
  targetTitle,
  variant = 'standard'
}) => {
  const shareHeading = targetTitle || titleForShare || 'የኦርቶዶክስ ተዋሕዶ መንፈሳዊ ትምህርት';
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [shares, setShares] = useState(initialShares);
  const [hasShared, setHasShared] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<EngagementComment[]>(initialComments);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = async () => {
    setShares((prev) => prev + 1);
    setHasShared(true);

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareHeading,
          text: 'ይህን የተቀደሰ የኦርቶዶክስ ተዋሕዶ ትምህርት ተመልከቱ፡',
          url: window.location.href
        });
      } catch {
        // Fallback to clipboard
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }

    setTimeout(() => setHasShared(false), 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newC: EngagementComment = {
      id: `c-${Date.now()}`,
      author: newCommentAuthor.trim() || 'ምእመን (Faithful)',
      text: newCommentText.trim(),
      time: 'አሁን (Just now)'
    };

    setComments([...comments, newC]);
    setNewCommentText('');
  };

  return (
    <div className="w-full pt-3 border-t border-stone-800/80">
      {/* 3 Actions Row: Like, Comment, Share */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              hasLiked
                ? 'text-red-400 bg-red-500/15 font-bold scale-105'
                : 'text-stone-300 hover:text-red-400 hover:bg-stone-900'
            }`}
            title="ተወዳጅ (Like)"
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500 animate-pulse' : ''}`} />
            <span className="font-mono tabular-nums">{likes}</span>
            <span className="hidden sm:inline">ላይክ</span>
          </button>

          {/* Comment Toggle Button */}
          <button
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isCommentsOpen
                ? 'text-amber-300 bg-amber-500/15 font-bold'
                : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900'
            }`}
            title="አስተያየቶች (Comments)"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="font-mono tabular-nums">{comments.length}</span>
            <span className="hidden sm:inline">አስተያየት</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
            hasShared
              ? 'text-emerald-300 bg-emerald-500/20'
              : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900'
          }`}
          title="አጋራ (Share)"
        >
          {hasShared ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
          <span>{hasShared ? 'ተቀድቷል ↗' : 'አጋራ (Share)'}</span>
          <span className="text-stone-500 font-mono text-xs hidden sm:inline">({shares})</span>
        </button>
      </div>

      {/* Expandable Comments Section */}
      {isCommentsOpen && (
        <div className="mt-4 pt-3 border-t border-stone-800 space-y-3 bg-stone-950/70 p-4 rounded-xl">
          <h5 className="font-serif-sacred font-bold text-amber-200 text-xs sm:text-sm">
            አስተያየቶች ({comments.length})
          </h5>

          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCommentAuthor}
                onChange={(e) => setNewCommentAuthor(e.target.value)}
                placeholder="ስምዎ (ለምሳሌ፡ ዘበነ)..."
                className="w-1/3 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-medium"
              />
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="መንፈሳዊ አስተያየትዎን እዚህ ይጻፉ..."
                className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-medium"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* List of comments */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {comments.map((c) => (
              <div key={c.id} className="p-2.5 bg-stone-900/60 rounded-lg border border-stone-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-300 font-serif-sacred">{c.author}</span>
                  <span className="text-[10px] text-stone-500 font-mono">{c.time}</span>
                </div>
                <p className="text-stone-200 font-medium leading-relaxed font-sans">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
