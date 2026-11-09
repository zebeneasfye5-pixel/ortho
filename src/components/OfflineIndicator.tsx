import React, { useState } from 'react';
import { WifiOff, Wifi, CheckCircle2, BookOpen, ShieldCheck, Music, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isOnline) {
    return null;
  }

  if (dismissed && !isExpanded) {
    return (
      <button
        onClick={() => {
          setDismissed(false);
          setIsExpanded(true);
        }}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3 py-2 bg-amber-950/90 hover:bg-amber-900 border border-amber-500/50 rounded-full text-amber-200 text-xs font-bold shadow-xl transition-all cursor-pointer animate-pulse"
        title="ከመስመር ውጭ ሁኔታ (Offline Mode Active)"
      >
        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        <span>ከመስመር ውጭ (Offline)</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm sm:max-w-md w-full transition-all animate-in slide-in-from-bottom duration-300">
      <div className="bg-stone-950/95 border-2 border-amber-500/60 rounded-2xl p-4 text-stone-200 shadow-2xl backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-sacred font-bold text-sm text-amber-200">
                  ከመስመር ውጭ (Offline Mode)
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  PWA Active
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5 font-medium">
                ኢንተርኔት ባይኖርም ድህረገጹ በሙሉ አቅም እየሰራ ነው።
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-stone-400 hover:text-amber-300 rounded-lg transition-colors cursor-pointer"
              title={isExpanded ? 'አሳንስ' : 'ዝርዝር እይ'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="አስቀምጥ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Detailed list of features operating offline */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-amber-900/40 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-amber-400 block font-serif-sacred uppercase tracking-wider">
              ያለ ኢንተርኔት የሚሰሩ አገልግሎቶች፦
            </span>
            <ul className="space-y-1.5 text-stone-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>የዕለቱ ስንክሳርና ቅዱሳት ንባባት (ሙሉ በሙሉ ተቀምጠዋል)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>የቅዱስ ያሬድ ዜማዎችና መንፈሳዊ መዝሙራት ማጫወቻ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>የምእመንነት ዲጂታል መታወቂያ ካርድ (Offline ID Badge)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>የነገረ መለኮት ትምህርቶች፣ የካህናት ታሪክና የቀኖና መከታተያ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>የቀጥታ ካሜራና የድምፅ ማስተላለፊያ የውስጥ ሲስተም</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
