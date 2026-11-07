import React, { useState, useRef } from 'react';
import { Music, Play, Pause, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { SacredHymn } from '../types';
import { SACRED_HYMNS } from '../data/orthodoxData';

interface HymnsPlayerProps {
  isGlobalPlaying: boolean;
  onToggleGlobalPlay: () => void;
}

export const HymnsPlayer: React.FC<HymnsPlayerProps> = ({
  isGlobalPlaying,
  onToggleGlobalPlay
}) => {
  const [selectedHymn, setSelectedHymn] = useState<SacredHymn>(SACRED_HYMNS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMode, setActiveMode] = useState<'all' | 'ግዕዝ' | 'ዕዝል' | 'አራራይ'>('all');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startChantSynth = (freq: number = 220) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Stop existing if any
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(0.01, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, audioCtxRef.current.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
      setIsPlaying(true);
    }
  };

  const stopChantSynth = () => {
    if (gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.8);
        setTimeout(() => {
          if (oscRef.current) {
            oscRef.current.stop();
            oscRef.current.disconnect();
            oscRef.current = null;
          }
        }, 800);
      } catch {
        // cleanup
      }
    }
    setIsPlaying(false);
  };

  const togglePlayHymn = (hymn: SacredHymn) => {
    if (selectedHymn.id === hymn.id && isPlaying) {
      stopChantSynth();
    } else {
      setSelectedHymn(hymn);
      startChantSynth(hymn.audioFrequency || 220);
    }
  };

  const filteredHymns = activeMode === 'all'
    ? SACRED_HYMNS
    : SACRED_HYMNS.filter(h => h.mode === activeMode);

  return (
    <section id="hymns" className="py-16 bg-stone-900/60 text-stone-100 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Curatorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider mb-2">
              <Music className="w-3.5 h-3.5" />
              <span>የቅዱስ ያሬድ ዜማዎች · SACRED ETHIOPIAN CHANTS & HYMNODY</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-sacred font-bold text-amber-100">
              የያሬዳዊ ዜማና የቅዳሴ ምስጋና ማዕከል
            </h2>
            <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
              በ6ኛው መቶ ክፍለ ዘመን በቅዱስ ያሬድ የተደረሱት ሦስቱ ቅዱሳት ስልቶች (ግዕዝ፣ ዕዝልና አራራይ) ከግዕዝ ጽሑፍና ከትርጉማቸው ጋር።
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-950 border border-stone-800 rounded-xl text-xs">
            <button
              onClick={() => setActiveMode('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMode === 'all' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              ሁሉም ዜማዎች
            </button>
            <button
              onClick={() => setActiveMode('ግዕዝ')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMode === 'ግዕዝ' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              ግዕዝ (Ge'ez)
            </button>
            <button
              onClick={() => setActiveMode('ዕዝል')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMode === 'ዕዝል' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              ዕዝል (Ezel)
            </button>
            <button
              onClick={() => setActiveMode('አራራይ')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMode === 'አራራይ' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              አራራይ (Araray)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Hymns Playlist (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {filteredHymns.map((hymn) => (
              <div
                key={hymn.id}
                onClick={() => togglePlayHymn(hymn)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedHymn.id === hymn.id
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-md'
                    : 'bg-stone-950/70 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedHymn.id === hymn.id && isPlaying
                      ? 'bg-amber-500 text-stone-950 shadow-sm animate-pulse'
                      : 'bg-stone-900 text-amber-400'
                  }`}>
                    {selectedHymn.id === hymn.id && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif-sacred font-bold text-sm text-amber-100">
                      {hymn.title}
                    </h4>
                    <p className="text-xs text-stone-400">
                      ዜማ: <span className="text-amber-400 font-medium">{hymn.mode}</span> · {hymn.occasion}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-stone-500">
                  {hymn.duration}
                </span>
              </div>
            ))}
          </div>

          {/* Hymn Lyrics & Theological Translation Display (7 cols) */}
          <div className="lg:col-span-7 bg-stone-950/90 border border-amber-900/30 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 text-xs">
              <span className="text-amber-400 font-serif-sacred font-semibold">
                ስልተ ዜማ: {selectedHymn.mode}
              </span>
              <span className="text-stone-400 font-mono">
                ደርሳኝ: {selectedHymn.composer}
              </span>
            </div>

            <div className="my-6">
              <h3 className="text-2xl font-serif-sacred font-bold text-amber-100 mb-2">
                {selectedHymn.title}
              </h3>
              <p className="text-xs text-amber-400/90">
                የበዓሉ ምክንያት: {selectedHymn.occasion}
              </p>
            </div>

            {/* Ge'ez Original Chanting Text */}
            <div className="p-5 bg-stone-900/80 rounded-2xl border border-stone-800 my-4">
              <span className="text-xs text-amber-400 font-semibold block mb-2 font-mono">
                የግዕዝ ዜማ ጽሑፍ (Sacred Ge'ez Notation):
              </span>
              <p className="text-lg sm:text-xl font-serif-sacred text-amber-100 font-bold leading-relaxed">
                "{selectedHymn.lyricsGeez}"
              </p>
            </div>

            {/* Translation Text */}
            <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-500/20 text-xs">
              <span className="text-amber-300 font-semibold block mb-1">
                ትርጓሜ (Liturgical Translation):
              </span>
              <p className="text-stone-300 leading-relaxed font-sans">
                "{selectedHymn.lyricsTranslation}"
              </p>
            </div>

            {/* Chanting Control Action */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                onClick={() => togglePlayHymn(selectedHymn)}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'ዜማውን አቁም' : 'ዜማውን አድምጥ'}</span>
              </button>

              <span className="text-xs text-stone-400 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>የቅዱስ ያሬድ ዜማ ሞገድ (220 Hz Resonant)</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
