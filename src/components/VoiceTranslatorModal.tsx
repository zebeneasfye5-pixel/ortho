import React, { useState, useEffect } from 'react';
import { 
  X, Mic, MicOff, Volume2, ArrowRightLeft, Sparkles, 
  Send, Copy, Check
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/orthodoxData';

interface VoiceTranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSourceLang?: LanguageCode;
}

export const VoiceTranslatorModal: React.FC<VoiceTranslatorModalProps> = ({
  isOpen,
  onClose,
  initialSourceLang = 'am'
}) => {
  const [sourceLang, setSourceLang] = useState<LanguageCode>(initialSourceLang);
  const [targetLang, setTargetLang] = useState<LanguageCode>('en');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialSourceLang) {
      setSourceLang(initialSourceLang);
      if (initialSourceLang === 'en') {
        setTargetLang('am');
      } else {
        setTargetLang('en');
      }
    }
  }, [initialSourceLang]);

  if (!isOpen) return null;

  const quickLiturgicalPhrases = [
    'በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።',
    'ሰላም ለሁላችሁ ይሁን',
    'እግዚአብሔር አምላክ ይባርካችሁ',
    'ንስሐ ግቡ መንግሥተ ሰማያት ቀርባለችና'
  ];

  const handleTranslate = async (textToTranslate: string = inputText) => {
    if (!textToTranslate.trim()) return;
    setIsTranslating(true);

    const sourceLangObj = SUPPORTED_LANGUAGES.find(l => l.code === sourceLang);
    const targetLangObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLang);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          sourceLang: sourceLangObj?.name || 'Amharic',
          targetLang: targetLangObj?.name || 'English'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTranslatedText(data.translatedText);
      } else {
        setTranslatedText('ይቅርታ፣ መተርጎም አልተቻለም። እባክዎ ድጋሚ ይሞክሩ።');
      }
    } catch (err) {
      console.error('Translation request error:', err);
      setTranslatedText(`[${targetLangObj?.name}] ${textToTranslate}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwap = () => {
    const tempSource = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempSource);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  // Speech Recognition integration
  const toggleListening = () => {
    const SpeechRecognition = 
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition || 
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('የድምፅ ግብዓት (Speech Recognition) በአሳሽዎ ላይ አልተደገፈም። እባክዎ በጽሑፍ ያስገቡ።');
      return;
    }

    if (isListening) {
      setIsListening(false);
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
      recognition.lang = langTagMap[sourceLang] || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleTranslate(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Speech Synthesis (Speak out translated text)
  const speakText = (text: string, langCode: LanguageCode) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    const langTagMap: Record<string, string> = {
      am: 'am-ET',
      en: 'en-US',
      el: 'el-GR',
      ru: 'ru-RU',
      ar: 'ar-SA',
      fr: 'fr-FR'
    };
    if (langTagMap[langCode]) {
      utterance.lang = langTagMap[langCode];
    }
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-stone-950 border border-amber-900/50 rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-sacred font-bold text-lg text-amber-100">
              ፈጣንና ዓለም አቀፍ የቀጥታ ቋንቋ መተርጎሚያ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection Ribbon */}
        <div className="my-4 flex items-center justify-between gap-3 bg-stone-900/90 p-2.5 rounded-xl border border-stone-800">
          <div className="flex-1">
            <label className="text-[10px] text-stone-400 uppercase font-mono block mb-1">መነሻ ቋንቋ (From)</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as LanguageCode)}
              className="w-full bg-stone-950 border border-amber-900/40 text-amber-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeLabel} ({l.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="p-2 mt-3 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg transition-colors cursor-pointer"
            title="ቋንቋዎችን ቀያይር (Swap Languages)"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex-1">
            <label className="text-[10px] text-stone-400 uppercase font-mono block mb-1">መድረሻ ቋንቋ (To)</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as LanguageCode)}
              className="w-full bg-stone-950 border border-amber-900/40 text-amber-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeLabel} ({l.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Liturgical Phrases */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {quickLiturgicalPhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(phrase);
                handleTranslate(phrase);
              }}
              className="text-[11px] px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded-md border border-stone-800 transition-colors cursor-pointer"
            >
              {phrase}
            </button>
          ))}
        </div>

        {/* Input Box with Microphone Voice Input */}
        <div className="relative mb-4">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="የሚናገሩትን ወይም የሚጽፉትን ቃል እዚህ ያስገቡ..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3.5 pr-20 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-stone-800 hover:bg-stone-700 text-amber-400'
              }`}
              title="በድምፅ ይናገሩ (Voice Input)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleTranslate()}
              disabled={isTranslating || !inputText.trim()}
              className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold rounded-lg transition-colors cursor-pointer"
              title="ተርጉም (Translate)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Translation Output Box with Read Aloud & Copy */}
        <div className="p-4 bg-stone-900/90 border border-amber-900/40 rounded-xl min-h-[110px] relative">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
            <span>የተተረጎመ ውጤት (Translation Result):</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(translatedText, targetLang)}
                disabled={!translatedText}
                className="p-1.5 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
                title="በድምፅ አድምጥ (Listen with Voice)"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!translatedText}
                className="p-1.5 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
                title="ቅዳ (Copy)"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base text-amber-100 font-serif-sacred leading-relaxed">
            {isTranslating ? (
              <span className="text-stone-400 italic">በሰከንዶች ውስጥ በመተርጎም ላይ...</span>
            ) : translatedText ? (
              translatedText
            ) : (
              <span className="text-stone-500 text-xs">ትርጉሙ እዚህ በቅጽበት ይታያል።</span>
            )}
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-stone-400">
            ማንኛውም ሰው በገዛ ቋንቋው ተናግሮ በገዛ ቋንቋው የሚሰማበት ዓለም አቀፍ የቤተክርስቲያን መተርጎሚያ ቴክኖሎጂ።
          </p>
        </div>

      </div>
    </div>
  );
};
