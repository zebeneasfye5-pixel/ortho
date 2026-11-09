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
    'ንስሐ ግቡ መንግሥተ ሰማያት ቀርባለችና',
    'እግዚአብሔር ይመስገን'
  ];

  // Offline Sacred Liturgical Phrasebook & Scripture Lexicon
  const OFFLINE_LEXICON: Record<string, Record<string, string>> = {
    'በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።': {
      en: 'In the name of the Father, and of the Son, and of the Holy Spirit, One God, Amen.',
      gez: 'በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።',
      ti: 'ብሥመ አብ ወወልድ ወመንፈስ ቅዱስ ኣሓዱ ኣምላኽ ኣሜን።',
      om: 'Maqaa Abbaa fi Ilmaa fi Afuura Qulqulluu Waaqa Tokkoon, Ameen.',
      el: 'Εἰς τὸ ὄνομα τοῦ Πατρὸς καὶ τοῦ Υἱοῦ καὶ τοῦ Ἁγίου Πνεύματος, Ἀμήν.',
      ru: 'Во имя Отца и Сына и Святого Духа, Аминь.',
      ar: 'باسم الآب والابن والروح القدس، إله واحد، آمين.',
      fr: 'Au nom du Père, du Fils et du Saint-Esprit, un seul Dieu, Amen.'
    },
    'ሰላም ለሁላችሁ ይሁን': {
      en: 'Peace be unto you all.',
      gez: 'ሰላም ለኵልክሙ።',
      ti: 'ሰላም ንዅላትኩም ይኹን።',
      om: 'Nagaan hunda keessaniif haata\'u.',
      el: 'Εἰρήνη πᾶσι.',
      ru: 'Мир всем вам.',
      ar: 'السلام لجميعكم.',
      fr: 'La paix soit avec vous tous.'
    },
    'እግዚአብሔር አምላክ ይባርካችሁ': {
      en: 'May the Lord God bless you.',
      gez: 'እግዚአብሔር አምላክ ይባርክክሙ።',
      ti: 'እግዚአብሔር ኣምላኽ ይባርኽኩም።',
      om: 'Waaqayyo Gooftaan isin haa eebbisu.',
      el: 'Ὁ Κύριος ὁ Θεὸς νὰ σᾶς εὐλογεῖ.',
      ru: 'Да благословит вас Господь Бог.',
      ar: 'الرب الإله يبارككم.',
      fr: 'Que le Seigneur Dieu vous bénisse.'
    },
    'ንስሐ ግቡ መንግሥተ ሰማያት ቀርባለችና': {
      en: 'Repent, for the kingdom of heaven is at hand.',
      gez: 'ተነስሑ እስመ ቀርበት መንግሥተ ሰማያት።',
      ti: 'መንግሥተ ሰማያት ቀሪባ እያ እሞ ተነስሑ።',
      om: 'Mootummaan waaqaa dhihaatteertiiti qalbii jijjiirradhaa.',
      el: 'Μετανοεῖτε· ἤγγικε γὰρ ἡ βασιλεία τῶν οὐρανῶν.',
      ru: 'Покайтесь, ибо приблизилось Царство Небесное.',
      ar: 'توبوا، فقد اقترب ملكوت السماوات.',
      fr: 'Repentez-vous, car le royaume des cieux est proche.'
    },
    'እግዚአብሔር ይመስገን': {
      en: 'Thanks and glory be to God.',
      gez: 'ስብሐት ለእግዚአብሔር።',
      ti: 'እግዚአብሔር ይመስገን።',
      om: 'Waaqayyo haa galatoomu.',
      el: 'Δόξα τῷ Θεῷ.',
      ru: 'Слава Богу.',
      ar: 'الحمد لله.',
      fr: 'Gloire à Dieu.'
    }
  };

  const handleTranslate = async (textToTranslate: string = inputText) => {
    if (!textToTranslate.trim()) return;
    setIsTranslating(true);

    const sourceLangObj = SUPPORTED_LANGUAGES.find(l => l.code === sourceLang);
    const targetLangObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLang);

    // Check offline lexicon first if offline or exact phrase match
    const cleanText = textToTranslate.trim();
    if (OFFLINE_LEXICON[cleanText] && OFFLINE_LEXICON[cleanText][targetLang]) {
      setTranslatedText(OFFLINE_LEXICON[cleanText][targetLang]);
      setIsTranslating(false);
      return;
    }

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
        // Offline / Network fallback
        fallbackOfflineTranslate(cleanText, targetLangObj?.name || 'Target');
      }
    } catch (err) {
      console.warn('Network translation unavailable, utilizing local offline mode:', err);
      fallbackOfflineTranslate(cleanText, targetLangObj?.name || 'Target');
    } finally {
      setIsTranslating(false);
    }
  };

  const fallbackOfflineTranslate = (text: string, targetName: string) => {
    if (OFFLINE_LEXICON[text] && OFFLINE_LEXICON[text][targetLang]) {
      setTranslatedText(OFFLINE_LEXICON[text][targetLang]);
    } else {
      setTranslatedText(`[${targetName} - ከመስመር ውጭ ትርጉም (Offline Mode)] ${text}`);
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
        <div className="my-5 flex items-center justify-between gap-3 bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800">
          <div className="flex-1">
            <label className="text-xs text-amber-300 uppercase font-mono font-bold block mb-1.5">መነሻ ቋንቋ (From)</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as LanguageCode)}
              className="w-full bg-stone-950 border border-amber-900/40 text-amber-100 text-sm sm:text-base font-semibold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
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
            className="p-2.5 mt-4 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl transition-colors cursor-pointer shadow"
            title="ቋንቋዎችን ቀያይር (Swap Languages)"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <label className="text-xs text-amber-300 uppercase font-mono font-bold block mb-1.5">መድረሻ ቋንቋ (To)</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as LanguageCode)}
              className="w-full bg-stone-950 border border-amber-900/40 text-amber-100 text-sm sm:text-base font-semibold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
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
        <div className="flex flex-wrap gap-2 mb-4">
          {quickLiturgicalPhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(phrase);
                handleTranslate(phrase);
              }}
              className="text-xs sm:text-sm px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-amber-300 rounded-lg border border-stone-800 font-medium transition-colors cursor-pointer shadow-sm"
            >
              {phrase}
            </button>
          ))}
        </div>

        {/* Input Box with Microphone Voice Input */}
        <div className="relative mb-5">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="የሚናገሩትን ወይም የሚጽፉትን ቃል እዚህ ያስገቡ..."
            className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 pr-24 text-base text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-medium leading-relaxed"
          />
          <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-stone-800 hover:bg-stone-700 text-amber-400'
              }`}
              title="በድምፅ ይናገሩ (Voice Input)"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleTranslate()}
              disabled={isTranslating || !inputText.trim()}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold rounded-xl transition-colors cursor-pointer shadow-md"
              title="ተርጉም (Translate)"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Translation Output Box with Read Aloud & Copy */}
        <div className="p-5 bg-stone-900/90 border-2 border-amber-500/40 rounded-2xl min-h-[120px] relative shadow-lg">
          <div className="flex items-center justify-between text-xs sm:text-sm text-amber-400 font-bold mb-2">
            <span>የተተረጎመ ውጤት (Translation Result):</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(translatedText, targetLang)}
                disabled={!translatedText}
                className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="በድምፅ አድምጥ (Listen with Voice)"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!translatedText}
                className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="ቅዳ (Copy)"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <p className="text-lg sm:text-xl lg:text-2xl text-amber-100 font-serif-sacred font-bold leading-relaxed">
            {isTranslating ? (
              <span className="text-stone-400 italic text-base">በሰከንዶች ውስጥ በመተርጎም ላይ...</span>
            ) : translatedText ? (
              translatedText
            ) : (
              <span className="text-stone-500 text-sm font-normal">ትርጉሙ እዚህ በቅጽበት በጉልህ ይታያል።</span>
            )}
          </p>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400 pt-3 border-t border-stone-900">
          <p>
            ማንኛውም ሰው በገዛ ቋንቋው ተናግሮ በገዛ ቋንቋው የሚሰማበት ዓለም አቀፍ የትርጉም ቴክኖሎጂ።
          </p>
          <span className="font-mono text-amber-300 font-bold shrink-0">
            የተገነባው በዘበነ አስፍዬ / Zebene Asfye
          </span>
        </div>

      </div>
    </div>
  );
};
