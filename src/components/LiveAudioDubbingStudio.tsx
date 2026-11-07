import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Mic, MicOff, Globe, 
  ArrowRightLeft, Sparkles, Headphones, Radio, Play, Pause, Sliders
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/orthodoxData';

interface LiveAudioDubbingStudioProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
}

export const LiveAudioDubbingStudio: React.FC<LiveAudioDubbingStudioProps> = ({
  currentLang,
  onSelectLang
}) => {
  const [speakerLang, setSpeakerLang] = useState<LanguageCode>('am');
  const [listenerLang, setListenerLang] = useState<LanguageCode>('en');
  const [inputText, setInputText] = useState('ሰላመ ክርስቶስ በሁላችሁ ልቡና ይንገሥ። በኦርቶዶክስ ተዋሕዶ እምነት ጸንታችሁ ቁሙ።');
  const [translatedText, setTranslatedText] = useState('May the peace of Christ reign in all your hearts. Stand firm in the Orthodox Tewahedo faith.');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [volume, setVolume] = useState(1);
  const [autoPlayVoice, setAutoPlayVoice] = useState(true);

  const sampleVoiceDialogues = [
    {
      title: 'የሊቀ ጳጳሱ ቃለ ቡራኬ (Patriarchal Blessing)',
      fromLang: 'am' as LanguageCode,
      toLang: 'en' as LanguageCode,
      text: 'በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን። ለመላው የዓለም ሕዝብ ሰላምና በረከት ይሁን።',
      translation: 'In the name of the Father, and of the Son, and of the Holy Spirit, One God, Amen. Peace and divine blessings to all people of the world.'
    },
    {
      title: 'የኢየሩሳሌም ካህን ጸሎት (Jerusalem Prayer)',
      fromLang: 'am' as LanguageCode,
      toLang: 'el' as LanguageCode, // Greek
      text: 'ከኢየሩሳሌም ቅዱሳት መካናት ጸሎትና ቡራኬ ለምእመናን ይድረስ።',
      translation: 'Εὐλογίαι καὶ προσευχαὶ ἐξ Ἱεροσολύμων πρὸς πάντας τοὺς πιστούς.'
    },
    {
      title: 'የውጭ ሀገር ምእመን ጥያቄ (Diaspora Inquiry)',
      fromLang: 'en' as LanguageCode,
      toLang: 'am' as LanguageCode,
      text: 'Father, how can we prepare ourselves with a pure heart for the Holy Communion?',
      translation: 'አባታችን ሆይ፤ ለቅዱስ ቁርባን በንጹሕ ልብ ራሳችንን እንዴት እናዘጋጅ?'
    }
  ];

  // Speak out text in the specified target language
  const speakVoice = (text: string, lang: LanguageCode) => {
    if (!('speechSynthesis' in window) || !text) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.volume = volume;

    const langTagMap: Record<string, string> = {
      am: 'am-ET',
      en: 'en-US',
      el: 'el-GR',
      ru: 'ru-RU',
      ar: 'ar-SA',
      fr: 'fr-FR',
      ti: 'am-ET',
      om: 'am-ET',
      gez: 'am-ET'
    };

    utterance.lang = langTagMap[lang] || 'en-US';

    // Match best available browser voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeakingAudio(true);
    utterance.onend = () => setIsSpeakingAudio(false);
    utterance.onerror = () => setIsSpeakingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleTranslateAndSpeak = async (text: string = inputText, sLang: LanguageCode = speakerLang, tLang: LanguageCode = listenerLang) => {
    if (!text.trim()) return;
    setIsTranslating(true);

    const sourceLangObj = SUPPORTED_LANGUAGES.find(l => l.code === sLang);
    const targetLangObj = SUPPORTED_LANGUAGES.find(l => l.code === tLang);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang: sourceLangObj?.name || 'Amharic',
          targetLang: targetLangObj?.name || 'English'
        })
      });

      if (res.ok) {
        const data = await res.json();
        const resText = data.translatedText || text;
        setTranslatedText(resText);
        if (autoPlayVoice) {
          speakVoice(resText, tLang);
        }
      } else {
        const fallback = `[${targetLangObj?.name}] ${text}`;
        setTranslatedText(fallback);
        if (autoPlayVoice) {
          speakVoice(fallback, tLang);
        }
      }
    } catch {
      const fallback = `[${targetLangObj?.name}] ${text}`;
      setTranslatedText(fallback);
      if (autoPlayVoice) {
        speakVoice(fallback, tLang);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwap = () => {
    const tempSpeaker = speakerLang;
    setSpeakerLang(listenerLang);
    setListenerLang(tempSpeaker);
    const tempInput = inputText;
    setInputText(translatedText);
    setTranslatedText(tempInput);
    if (autoPlayVoice && tempInput) {
      speakVoice(tempInput, tempSpeaker);
    }
  };

  const toggleMicListening = () => {
    const SpeechRecognition = 
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition || 
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('የድምፅ ግብዓት (Speech Recognition) በአሳሽዎ ላይ አልተደገፈም። እባክዎ በጽሑፍ ያስገቡ።');
      return;
    }

    if (isMicActive) {
      setIsMicActive(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langTagMap: Record<string, string> = {
        am: 'am-ET',
        en: 'en-US',
        el: 'el-GR',
        ru: 'ru-RU',
        ar: 'ar-SA',
        fr: 'fr-FR'
      };
      recognition.lang = langTagMap[speakerLang] || 'en-US';

      recognition.onstart = () => setIsMicActive(true);
      recognition.onresult = (event: any) => {
        const spokenWords = event.results[0][0].transcript;
        setInputText(spokenWords);
        setIsMicActive(false);
        handleTranslateAndSpeak(spokenWords, speakerLang, listenerLang);
      };
      recognition.onerror = () => setIsMicActive(false);
      recognition.onend = () => setIsMicActive(false);

      recognition.start();
    } catch {
      setIsMicActive(false);
    }
  };

  return (
    <section id="audio-dubbing" className="py-16 bg-stone-900/80 text-stone-100 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider mb-2">
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>የቀጥታ ድምፅ-በድምፅ ትርጉም · REAL-TIME SIMULTANEOUS SPEECH-TO-SPEECH DUBBING</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-sacred font-bold text-amber-100">
              ሰው በራሱ ቋንቋ ተናግሮ በራሱ ቋንቋ ቁልጭ ብሎ የሚሰማበት ሥርዓት
            </h2>
            <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
              አንዱ በገዛ ቋንቋው (ለምሳሌ በአማርኛ ወይም በግዕዝ) ሲናገር፣ ሌላኛው አድማጭ በገዛ ቋንቋው (በእንግሊዝኛ፣ በግሪክኛ፣ በሩሲያኛ፣ በኦሮምኛ፣ ወዘተ) በቅጽበት ጥራት ባለው ድምፅ በቀጥታ የሚሰማበት የቀጥታ የድምፅ ማስተላለፊያ ቴክኖሎጂ።
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoPlayVoice(!autoPlayVoice)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                autoPlayVoice
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-stone-950 text-stone-400 border-stone-800'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>ራስ-ሰር የድምፅ ንባብ: {autoPlayVoice ? 'በርቷል (Active)' : 'ጠፍቷል'}</span>
            </button>
          </div>
        </div>

        {/* Studio Main Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Voice-to-Voice Console (8 cols) */}
          <div className="lg:col-span-8 bg-stone-950 border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Language Flow Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
              {/* Speaker Language */}
              <div className="sm:col-span-5">
                <label className="text-[10px] text-stone-400 uppercase font-mono block mb-1">
                  1. ተናጋሪው የሚናገርበት ቋንቋ (Speaker Language)
                </label>
                <select
                  value={speakerLang}
                  onChange={(e) => setSpeakerLang(e.target.value as LanguageCode)}
                  className="w-full bg-stone-950 border border-amber-900/40 text-amber-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeLabel} ({l.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center">
                <button
                  onClick={handleSwap}
                  className="p-2.5 bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-amber-400 rounded-xl transition-colors cursor-pointer"
                  title="ቋንቋዎችን ቀያይር (Swap Speaker/Listener)"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Listener Language */}
              <div className="sm:col-span-5">
                <label className="text-[10px] text-stone-400 uppercase font-mono block mb-1">
                  2. አድማጩ የሚሰማበት ቋንቋ (Listener Heard Language)
                </label>
                <select
                  value={listenerLang}
                  onChange={(e) => setListenerLang(e.target.value as LanguageCode)}
                  className="w-full bg-stone-950 border border-amber-900/40 text-amber-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeLabel} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Speaker Input Box with Voice Activation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-300">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  የተናጋሪው ንግግር / ድምፅ
                </span>
                <span className="text-[11px] text-stone-500 font-mono">
                  ቋንቋ: {SUPPORTED_LANGUAGES.find(l => l.code === speakerLang)?.nativeLabel}
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="በማይክሮፎኑ ይናገሩ ወይም እዚህ ጽሑፍ ያስገቡ..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 pr-24 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button
                    onClick={toggleMicListening}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                      isMicActive
                        ? 'bg-red-500 text-white animate-pulse shadow-lg'
                        : 'bg-stone-800 hover:bg-stone-700 text-amber-400'
                    }`}
                    title={isMicActive ? "ድምፅ ማዳመጥ አቁም" : "በድምፅ ይናገሩ (Speak with Mic)"}
                  >
                    {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleTranslateAndSpeak()}
                    disabled={isTranslating || !inputText.trim()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow"
                  >
                    {isTranslating ? '...' : 'ተርጉምና አሰማ'}
                  </button>
                </div>
              </div>
            </div>

            {/* Listener Spoken Output Box */}
            <div className="p-6 bg-gradient-to-br from-amber-950/30 to-stone-900 border border-amber-500/30 rounded-2xl relative">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Volume2 className="w-4 h-4" />
                  <span>በአድማጩ ጆሮ በቀጥታ የሚሰማው ድምፅ (Heard in Native Voice)</span>
                </div>

                {isSpeakingAudio && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    ድምፁ አሁን እየተነበበ ነው...
                  </span>
                )}
              </div>

              {/* Live Dubbed Spoken Text */}
              <p className="text-base sm:text-lg font-serif-sacred text-amber-100 font-medium leading-relaxed min-h-[50px]">
                "{translatedText}"
              </p>

              {/* Action Buttons for Hearing Again */}
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => speakVoice(translatedText, listenerLang)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>ድምፁን በድጋሚ አድምጥ (Listen Again)</span>
                </button>

                <span className="text-[11px] text-stone-400 font-mono">
                  መድረሻ ልሳን: {SUPPORTED_LANGUAGES.find(l => l.code === listenerLang)?.nativeLabel}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Sample Liturgical Speeches + Voice Settings (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Test Scenarios */}
            <div className="p-6 bg-stone-950 border border-amber-900/40 rounded-3xl shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif-sacred font-bold text-amber-200 text-sm">
                  የቀጥታ የድምፅ ትርጉም ምሳሌዎች (1-Click Test)
                </h4>
              </div>
              <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                በቀጥታ ሥርጭት ወቅት አባቶችና ምእመናን የሚናገሩትን ንግግር በሌላ ቋንቋ በድምፅ ለመስማት ይጫኑ:
              </p>

              <div className="space-y-3">
                {sampleVoiceDialogues.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSpeakerLang(item.fromLang);
                      setListenerLang(item.toLang);
                      setInputText(item.text);
                      setTranslatedText(item.translation);
                      speakVoice(item.translation, item.toLang);
                    }}
                    className="p-3.5 bg-stone-900/80 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-xl cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold mb-1">
                      <span>{item.title}</span>
                      <Play className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-xs text-stone-300 font-serif-sacred line-clamp-2">
                      "{item.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Voice Quality & Pitch Tuner */}
            <div className="p-6 bg-stone-950 border border-amber-900/40 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif-sacred font-bold text-amber-200 text-sm">
                  የድምፅ ፍጥነትና መጠን ማስተካከያ
                </h4>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span>የንባብ ፍጥነት (Pace)</span>
                  <span className="font-mono text-amber-400">{speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.2"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span>የድምፅ መጠን (Volume)</span>
                  <span className="font-mono text-amber-400">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
