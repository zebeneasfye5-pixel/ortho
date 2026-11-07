import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Flame, Send, Globe, 
  MessageSquare, Users, Sparkles, CheckCircle2, Mic, Video, VideoOff,
  Maximize2, Minimize2
} from 'lucide-react';
import { LanguageCode, LiveChatMessage } from '../types';
import { SUPPORTED_LANGUAGES, LIVE_STREAM_MOCK_SPEECH } from '../data/orthodoxData';

interface LiveStreamSectionProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
}

export const LiveStreamSection: React.FC<LiveStreamSectionProps> = ({
  currentLang,
  onSelectLang
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSpeechSynthesisEnabled, setIsSpeechSynthesisEnabled] = useState(true);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [candlesLit, setCandlesLit] = useState(342);
  const [hasLitCandle, setHasLitCandle] = useState(false);
  const [autoTranslateChat, setAutoTranslateChat] = useState(true);
  const [isLiveVideoConnected, setIsLiveVideoConnected] = useState(false);
  const [isUserCamOn, setIsUserCamOn] = useState(false);
  const [isVirtualUserCam, setIsVirtualUserCam] = useState(false);
  const userCamVideoRef = useRef<HTMLVideoElement | null>(null);
  const userCamStreamRef = useRef<MediaStream | null>(null);

  // Automatically attach media stream to userCamVideoRef when mounted or updated
  useEffect(() => {
    if (isUserCamOn && !isVirtualUserCam && userCamStreamRef.current && userCamVideoRef.current) {
      if (userCamVideoRef.current.srcObject !== userCamStreamRef.current) {
        userCamVideoRef.current.srcObject = userCamStreamRef.current;
        userCamVideoRef.current.play().catch((e) => console.log('Audience cam auto-play:', e));
      }
    }
  }, [isUserCamOn, isVirtualUserCam, isLiveVideoConnected]);

  // Chat state
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    {
      id: 'm-1',
      senderName: 'ዲ/ን ተስፋዬ (Adis Ababa)',
      role: 'deacon',
      originalText: 'እንኳን ለመድኃኔዓለም ዓመታዊ በዓል በሰላም አደረሳችሁ። ጸሎታችሁ ይሰማ።',
      originalLang: 'am',
      translatedText: 'Happy annual feast of Medhane Alem! May your prayers be heard.',
      timestamp: '11:02'
    },
    {
      id: 'm-2',
      senderName: 'Father Stephanos (Athens, Greece)',
      role: 'priest',
      originalText: 'Εὐλογημένος ὁ ἐρχόμενος ἐν ὀνόματι Κυρίου. Εἰρήνη ἐν Χριστῷ.',
      originalLang: 'el',
      translatedText: 'ቡሩክ በስመ እግዚአብሔር ዘይመጽእ። ሰላመ ክርስቶስ ለሁላችሁ ይሁን። (Blessed is He that cometh in the name of the Lord)',
      timestamp: '11:03'
    },
    {
      id: 'm-3',
      senderName: 'Marta Hailu (Washington DC)',
      role: 'believer',
      originalText: 'May God bless our Patriarch, all the clergy, and believers worldwide.',
      originalLang: 'en',
      translatedText: 'እግዚአብሔር ፓትርያርካችንን፣ ካህናቱንና በዓለም ዙሪያ ያሉ ምእመናንን ይባርክ።',
      timestamp: '11:04'
    },
    {
      id: 'm-4',
      senderName: 'Mikhail (St. Petersburg)',
      role: 'believer',
      originalText: 'С праздником всех православных братьев и сестер!',
      originalLang: 'ru',
      translatedText: 'ለመላው የኦርቶዶክስ ወንድሞችና እህቶች መልካም በዓል!',
      timestamp: '11:05'
    }
  ]);
  const [newChatText, setNewChatText] = useState('');
  const [senderNameInput, setSenderNameInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Prayer Request state
  const [prayerRequest, setPrayerRequest] = useState('');
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);

  // Live Speech stream ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSpeechIndex((prev) => (prev + 1) % LIVE_STREAM_MOCK_SPEECH.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentSpeech = LIVE_STREAM_MOCK_SPEECH[speechIndex];
  const translatedCurrentSpeech = 
    currentSpeech.translations[currentLang as keyof typeof currentSpeech.translations] || 
    currentSpeech.translations.en || 
    currentSpeech.speechAmharic;

  // Optional voice read-out using browser Web Speech API
  useEffect(() => {
    if (isSpeechSynthesisEnabled && 'speechSynthesis' in window && translatedCurrentSpeech) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(translatedCurrentSpeech);
      utterance.rate = 0.9;
      // map language tag
      const langTagMap: Record<string, string> = {
        am: 'am-ET',
        en: 'en-US',
        el: 'el-GR',
        ru: 'ru-RU',
        ar: 'ar-SA',
        fr: 'fr-FR'
      };
      if (langTagMap[currentLang]) {
        utterance.lang = langTagMap[currentLang];
      }
      window.speechSynthesis.speak(utterance);
    }
  }, [speechIndex, isSpeechSynthesisEnabled, currentLang]);

  const streamContainerRef = useRef<HTMLDivElement | null>(null);
  const [isStreamFullscreen, setIsStreamFullscreen] = useState(false);

  const toggleStreamFullscreen = () => {
    if (!streamContainerRef.current) return;
    if (!document.fullscreenElement && !isStreamFullscreen) {
      if (streamContainerRef.current.requestFullscreen) {
        streamContainerRef.current.requestFullscreen().catch(() => {
          setIsStreamFullscreen(true);
        });
      } else {
        setIsStreamFullscreen(true);
      }
      setIsStreamFullscreen(true);
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsStreamFullscreen(false);
    }
  };

  const handleLightCandle = () => {
    if (!hasLitCandle) {
      setCandlesLit((prev) => prev + 1);
      setHasLitCandle(true);
    }
  };

  const toggleUserLiveVideo = async () => {
    if (isUserCamOn) {
      if (userCamStreamRef.current) {
        userCamStreamRef.current.getTracks().forEach((track) => track.stop());
        userCamStreamRef.current = null;
      }
      if (userCamVideoRef.current) {
        userCamVideoRef.current.srcObject = null;
      }
      setIsUserCamOn(false);
      setIsVirtualUserCam(false);
      setIsLiveVideoConnected(false);
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia not available');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        userCamStreamRef.current = stream;
        setIsVirtualUserCam(false);
        setIsUserCamOn(true);
        setIsLiveVideoConnected(true);
        if (userCamVideoRef.current) {
          userCamVideoRef.current.srcObject = stream;
          userCamVideoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Physical camera unavailable or permission denied, using live virtual feed:', err);
        setIsVirtualUserCam(true);
        setIsUserCamOn(true);
        setIsLiveVideoConnected(true);
      }
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    setIsSendingChat(true);
    const userMessageText = newChatText.trim();
    const sender = senderNameInput.trim() || 'ምእመን (Faithful)';

    let translatedResult = '';
    try {
      // Call backend translation endpoint
      const targetLangName = currentLang === 'am' ? 'English' : 'Amharic';
      const sourceLangName = currentLang === 'am' ? 'Amharic' : 'English';
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userMessageText,
          sourceLang: sourceLangName,
          targetLang: targetLangName
        })
      });
      if (res.ok) {
        const data = await res.json();
        translatedResult = data.translatedText || '';
      }
    } catch (err) {
      console.warn('Realtime chat translation notice:', err);
    }

    const newMsg: LiveChatMessage = {
      id: `m-${Date.now()}`,
      senderName: sender,
      role: 'believer',
      originalText: userMessageText,
      originalLang: currentLang,
      translatedText: translatedResult,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewChatText('');
    setIsSendingChat(false);
  };

  const handleSendPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerRequest.trim()) return;
    setPrayerSubmitted(true);
    setTimeout(() => {
      setPrayerRequest('');
      setPrayerSubmitted(false);
    }, 4000);
  };

  return (
    <section id="live" className="py-16 bg-stone-950 text-stone-100 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wider mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
              <span>ቀጥታ ሥርጭት · LIVE BROADCAST WITH SIMULTANEOUS TRANSLATION</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-sacred font-bold text-amber-100">
              የቀጥታ ቅዳሴና ሁለንተናዊ ቋንቋ መተርጎሚያ
            </h2>
            <p className="mt-2 text-sm text-stone-400 max-w-2xl">
              በዓለም ዙሪያ የሚገኙ ካህናትና ምእመናን በቅጽበት እርስ በእርስ የሚደማመጡበትና የሚተረጎምበት የቀጥታ ሥርጭት መድረክ።
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-1.5 bg-stone-900/90 border border-stone-800 px-3 py-1.5 rounded-lg">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono tabular-nums text-amber-200">24,850</span>
              <span>ተሳታፊዎች</span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-900/90 border border-stone-800 px-3 py-1.5 rounded-lg">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>58 አገራት</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Video Stream on Left (70%) + Live Translated Chat & Prayer on Right (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Video Player Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div 
              ref={streamContainerRef}
              className={`relative overflow-hidden border border-amber-900/40 bg-black shadow-2xl group transition-all ${
                isStreamFullscreen 
                  ? 'fixed inset-0 z-50 rounded-none w-screen h-screen flex flex-col justify-between' 
                  : 'aspect-video rounded-2xl'
              }`}
            >
              <img
                src="/src/assets/images/orthodox_liturgical_stream_1794000064768.jpg"
                alt="Live Orthodox Liturgy Broadcast"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-70'}`}
              />

              {/* Top Banner on Stream */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                <div className="flex items-center gap-2 bg-stone-950/80 backdrop-blur-md border border-amber-900/50 px-3 py-1 rounded-lg text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-semibold text-amber-300">ቀጥታ ሥርጭት</span>
                  <span className="text-stone-400">· መንበረ ጸባዖት ቅድስት ሥላሴ ካቴድራል</span>
                </div>

                <div className="bg-stone-950/80 backdrop-blur-md border border-amber-900/50 px-3 py-1 rounded-lg text-xs font-mono text-amber-200">
                  HD 1080p 60fps · AI Simultaneous Audio
                </div>
              </div>

              {/* 2-Way Interactive User Live Video Feed (Picture-in-Picture) */}
              {isLiveVideoConnected && (
                <div className="absolute top-16 right-4 w-36 sm:w-52 aspect-video rounded-xl overflow-hidden border-2 border-amber-400 bg-stone-900 shadow-2xl z-30 animate-fadeIn">
                  {!isVirtualUserCam ? (
                    <video
                      ref={(el) => {
                        userCamVideoRef.current = el;
                        if (el && userCamStreamRef.current && el.srcObject !== userCamStreamRef.current) {
                          el.srcObject = userCamStreamRef.current;
                          el.play().catch(() => {});
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src="/src/assets/images/orthodox_believer_video_1794037021389.jpg"
                        alt="Audience Live Camera"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1.5 bg-stone-950/80 text-[10px] text-amber-300 px-1.5 py-0.5 rounded flex items-center gap-1 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>የእኔ ካሜራ (Live Audience)</span>
                  </div>
                </div>
              )}

              {/* Instant Real-Time Subtitles Banner across bottom of video */}
              <div className="absolute bottom-16 left-4 right-4 z-20 pointer-events-none">
                <div className="bg-stone-950/90 backdrop-blur-md border border-amber-500/40 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center justify-between text-xs text-amber-400/90 font-medium mb-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>የቀጥታ ትርጉም ({currentSpeech.speaker})</span>
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">
                      ቋንቋ: {SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.nativeLabel}
                    </span>
                  </div>
                  
                  {/* Translated Text Display */}
                  <p className="text-base sm:text-lg font-serif-sacred text-amber-100 font-medium leading-snug">
                    "{translatedCurrentSpeech}"
                  </p>

                  {/* Original Speech Reference if different */}
                  {currentLang !== 'am' && (
                    <p className="text-xs text-stone-400 mt-1 italic">
                      ኦሪጅናል: "{currentSpeech.speechAmharic}"
                    </p>
                  )}
                </div>
              </div>

              {/* Video Player Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 text-stone-200 hover:text-amber-400 hover:bg-stone-800/80 rounded-lg transition-colors cursor-pointer"
                    title={isPlaying ? "Pause Stream" : "Play Stream"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className="p-2 text-stone-200 hover:text-amber-400 hover:bg-stone-800/80 rounded-lg transition-colors cursor-pointer"
                    title={isAudioMuted ? "Unmute" : "Mute"}
                  >
                    {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsSpeechSynthesisEnabled(!isSpeechSynthesisEnabled)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSpeechSynthesisEnabled 
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-md' 
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                    }`}
                    title="Translate spoken words into your native voice"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>የቀጥታ ድምፅ ትርጉም {isSpeechSynthesisEnabled ? '(እየተሰማ ነው 🔊)' : '(አጥፋ)'}</span>
                  </button>

                  {/* 2-Way Live Video Connection Button */}
                  <button
                    onClick={toggleUserLiveVideo}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isLiveVideoConnected
                        ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                        : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
                    }`}
                    title="በቀጥታ ቪዲዮ ተሳተፍ (Join with Live Camera)"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{isLiveVideoConnected ? 'ቪዲዮዬ በርቷል 🎥' : 'በቪዲዮ ተሳተፍ'}</span>
                  </button>
                </div>

                {/* Stream Language Selector Quick Switch & Fullscreen */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 hidden sm:inline">የመስማት ቋንቋ:</span>
                  <select
                    value={currentLang}
                    onChange={(e) => onSelectLang(e.target.value as LanguageCode)}
                    className="bg-stone-900 border border-amber-900/50 text-amber-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.nativeLabel} ({l.name})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={toggleStreamFullscreen}
                    className="p-1.5 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                    title={isStreamFullscreen ? "ሙሉ ስክሪን አጥፋ (Exit Fullscreen)" : "ሙሉ ስክሪን አድርግ (Fullscreen)"}
                    aria-label="Toggle Fullscreen"
                  >
                    {isStreamFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Liturgical Actions Strip: Candle Lighting & Prayer Offering */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {/* Candle Lighting Action */}
              <div className="p-4 bg-stone-900/70 border border-amber-900/30 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${hasLitCandle ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-800 text-stone-400'}`}>
                    <Flame className={`w-6 h-6 ${hasLitCandle ? 'animate-bounce text-amber-400' : ''}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-200 font-serif-sacred">በቀጥታ ሥርጭቱ ሻማ ማብራት</h4>
                    <p className="text-xs text-stone-400 font-mono tabular-nums">
                      በምእመናን የተበሩ ሻማዎች: {candlesLit}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLightCandle}
                  disabled={hasLitCandle}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    hasLitCandle
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md'
                  }`}
                >
                  {hasLitCandle ? 'ሻማዎ በርቷል ✝' : 'ሻማ አብራ'}
                </button>
              </div>

              {/* Submit Prayer Request to Altar */}
              <div className="p-4 bg-stone-900/70 border border-amber-900/30 rounded-xl">
                <form onSubmit={handleSendPrayer} className="flex gap-2">
                  <input
                    type="text"
                    value={prayerRequest}
                    onChange={(e) => setPrayerRequest(e.target.value)}
                    placeholder="የጸሎት ልመናዎን ለመንበረ ታቦቱ ካህናት ይላኩ..."
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    {prayerSubmitted ? 'ተልኳል ✝' : 'ጸሎት ላክ'}
                  </button>
                </form>
                {prayerSubmitted && (
                  <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    ጸሎትዎ ወደ ካቴድራሉ ካህናትና ዲያቆናት ደርሷል። በቅዳሴው ጊዜ ይጸለያል።
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Global Multilingual Live Chat (With Instant Translation) */}
          <div className="lg:col-span-4 flex flex-col h-[560px] bg-stone-900/80 border border-amber-900/30 rounded-2xl overflow-hidden shadow-xl">
            {/* Chat Header */}
            <div className="p-3.5 bg-stone-950 border-b border-amber-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-amber-200 font-serif-sacred">ዓለም አቀፍ የምእመናን ውይይት</h3>
              </div>
              <button
                onClick={() => setAutoTranslateChat(!autoTranslateChat)}
                className={`text-[11px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  autoTranslateChat 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-stone-800 text-stone-400'
                }`}
                title="Toggle automatic translation of all languages"
              >
                ራስ-ሰር ትርጉም: {autoTranslateChat ? 'በርቷል' : 'ጠፍቷል'}
              </button>
            </div>

            {/* Chat Messages Scroll Window */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-2.5 bg-stone-950/60 rounded-xl border border-stone-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                      {msg.role === 'priest' && '✝ ቆሞስ/ቀሲስ'}
                      {msg.role === 'deacon' && '✞ ዲያቆን'}
                      <span>{msg.senderName}</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Message Body */}
                  <p className="text-stone-200 leading-relaxed font-sans">
                    {msg.originalText}
                  </p>

                  {/* Instant Translated view if available */}
                  {autoTranslateChat && msg.translatedText && (
                    <div className="mt-1.5 pt-1.5 border-t border-stone-800/80 text-amber-200/90 text-[11px] flex items-start gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                      <span>{msg.translatedText}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input Box with User Name & Message */}
            <form onSubmit={handleSendChat} className="p-3 bg-stone-950 border-t border-amber-900/30 flex flex-col gap-2">
              <input
                type="text"
                value={senderNameInput}
                onChange={(e) => setSenderNameInput(e.target.value)}
                placeholder="ስምዎና ከተማዎ (ለምሳሌ፡ ዘበነ - አዲስ አበባ)..."
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  placeholder="በማንኛውም ቋንቋ አስተያየትዎን ይጻፉ..."
                  className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={isSendingChat || !newChatText.trim()}
                  className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};
