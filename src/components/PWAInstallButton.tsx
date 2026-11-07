import React, { useState } from 'react';
import { Download, Share, X, CheckCircle2, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full' | 'hero';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedNotice, setInstalledNotice] = useState(false);

  // If already running as installed PWA standalone mode
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstalledNotice(true);
        setTimeout(() => setInstalledNotice(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General instructions for browser add to home screen
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-2 rounded-xl transition-all cursor-pointer font-semibold shadow-md ${
          variant === 'hero'
            ? 'px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs sm:text-sm'
            : variant === 'full'
            ? 'w-full justify-center px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold'
            : 'px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs'
        }`}
        title="አፕሊኬሽኑን ስልክዎ ወይም ኮምፒውተርዎ ላይ ይጫኑ (Install App)"
      >
        <Download className="w-4 h-4 text-amber-950 shrink-0" />
        <span className="whitespace-nowrap">
          {variant === 'hero' ? 'አፑን በስልክዎ/ኮምፒውተርዎ ላይ ይጫኑ (Install)' : 'አፑን ጫን (Install)'}
        </span>
      </button>

      {/* Installed notification feedback */}
      {installedNotice && (
        <div className="fixed bottom-20 right-6 z-50 p-4 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-200 text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>አፕሊኬሽኑ በተሳካ ሁኔታ ተጭኗል! ከዋናው ማያዎ (Home Screen) በቀላሉ ማግኘት ይችላሉ።</span>
        </div>
      )}

      {/* Guide Modal for iOS / Non-Chromium */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-stone-950 border border-amber-900/50 rounded-2xl p-6 text-stone-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h4 className="font-serif-sacred font-bold text-amber-100 text-base">
                  አፕሊኬሽኑን በስልክዎ ላይ መጫን
                </h4>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-stone-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs leading-relaxed text-stone-300">
              <p className="font-semibold text-amber-300">
                ይህን አፕሊኬሽን ልክ እንደ ማንኛውም የሞባይል አፕሊኬሽን ወደ ስልክዎ ለማስገባት፡
              </p>
              
              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>በአሳሽዎ (Browser/Safari/Chrome) ታች ወይም ላይ ያለውን የ <strong>Share (አጋራ)</strong> ወይም <strong>ሦስት ነጥብ (⋮)</strong> ምልክት ይንኩ።</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>ዝርዝሩን ወደ ታች በማውረድ <strong>"Add to Home Screen" (ወደ ዋና ማያ አክል)</strong> ወይም <strong>"Install App"</strong> የሚለውን ይምረጡ።</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <span>ከዚያ <strong>"Add" (አክል)</strong> ወይም <strong>"Install"</strong> የሚለውን ይጫኑ። አፑ በቀጥታ በስልክዎ ላይ ተጭኖ ይቀመጣል!</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              ተረድቻለሁ (Done)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
