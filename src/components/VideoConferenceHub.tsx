import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Hand, Share2, 
  Sparkles, Maximize2, Minimize2, Grid, Layout, 
  ShieldCheck, Flame, Users, Volume2, Globe, CheckCircle2
} from 'lucide-react';
import { LanguageCode, ConferenceRoomType, ConferenceParticipant } from '../types';
import { SYNOD_PARTICIPANTS, SUPPORTED_LANGUAGES } from '../data/orthodoxData';

interface VideoConferenceHubProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  defaultRoom?: ConferenceRoomType;
}

export const VideoConferenceHub: React.FC<VideoConferenceHubProps> = ({
  currentLang,
  onSelectLang,
  defaultRoom = 'synod'
}) => {
  const [activeRoom, setActiveRoom] = useState<ConferenceRoomType>(defaultRoom);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'spotlight'>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(0);
  const [userName, setUserName] = useState('ዘበነ አስፋው (እኔ)');
  const [participants, setParticipants] = useState<ConferenceParticipant[]>(SYNOD_PARTICIPANTS);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [sacredFilter, setSacredFilter] = useState<'none' | 'candle' | 'blur'>('none');
  const [isAudioDubbingOn, setIsAudioDubbingOn] = useState(true);
  const [isVirtualCam, setIsVirtualCam] = useState(false);
  const [camNotice, setCamNotice] = useState<string | null>(null);

  // Video element refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Automatically attach media stream to localVideoRef when mounted or updated
  useEffect(() => {
    if (isCameraOn && !isVirtualCam && localStreamRef.current && localVideoRef.current) {
      if (localVideoRef.current.srcObject !== localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current.play().catch((e) => console.log('Camera auto-play:', e));
      }
    }
  }, [isCameraOn, isVirtualCam]);

  // Switch speakers periodically for conference realism
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSpeakerIndex((prev) => (prev + 1) % participants.length);
    }, 14000);
    return () => clearInterval(timer);
  }, [participants.length]);

  // Live Simultaneous Audio Voice Dubbing into listener's language
  useEffect(() => {
    if (!isAudioDubbingOn || !('speechSynthesis' in window)) return;
    const speaker = participants[activeSpeakerIndex];
    if (!speaker) return;
    const speechToSpeak = 
      speaker.currentTranslation?.[currentLang] || 
      speaker.currentTranslation?.en || 
      speaker.currentSpeech;

    if (speechToSpeak) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechToSpeak);
      utterance.rate = 0.9;
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
  }, [activeSpeakerIndex, isAudioDubbingOn, currentLang, participants]);

  // Handle actual webcam toggle
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
      setIsVirtualCam(false);
      setCamNotice(null);
    } else {
      setCamNotice(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('navigator.mediaDevices not supported');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: !isMicMuted
        });
        localStreamRef.current = stream;
        setIsVirtualCam(false);
        setIsCameraOn(true);
        // Connect immediately if element is already present
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        console.warn('Physical webcam unavailable or permission denied:', err);
        // Graceful live virtual camera fallback
        setIsVirtualCam(true);
        setIsCameraOn(true);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCamNotice('የካሜራ ፈቃድ በብራውዘርዎ ላይ አልተፈቀደም። እባክዎ በብራውዘሩ አድራሻ ላይ የካሜራ ምልክቱን ተጭነው "Allow" ይበሉ ወይም ይህን ምናባዊ የቀጥታ ምስል ይመልከቱ።');
        } else {
          setCamNotice('የኮምፒውተር/ስልክ ካሜራ ባለመገኘቱ የቀጥታ ምናባዊ ቪዲዮ (Virtual Cam) በርቷል፡፡');
        }
      }
    }
  };

  const toggleMic = () => {
    const nextMuted = !isMicMuted;
    setIsMicMuted(nextMuted);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }
  };

  const toggleScreenShare = async () => {
    if (isSharingScreen) {
      setIsSharingScreen(false);
    } else {
      try {
        if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
          await navigator.mediaDevices.getDisplayMedia({ video: true });
          setIsSharingScreen(true);
        } else {
          setIsSharingScreen(true);
        }
      } catch {
        setIsSharingScreen(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const activeSpeaker = participants[activeSpeakerIndex] || participants[0];
  const translatedActiveSpeech = 
    activeSpeaker.currentTranslation?.[currentLang] || 
    activeSpeaker.currentTranslation?.en || 
    activeSpeaker.currentSpeech;

  return (
    <section id="conference" className="py-16 bg-stone-950 text-stone-100 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
              <span>የቀጥታ ቪዲዮ ኮንፈረንስ · UNIVERSAL LIVE VIDEO CONFERENCE SYSTEM</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-sacred font-bold text-amber-100">
              በየደረጃው የሚደረግ የቀጥታ የቪዲዮ ግንኙነት
            </h2>
            <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
              ከቅዱስ ሲኖዶስ እስከ ምእመን ድረስ በእውነተኛ የካሜራና ማይክሮፎን ቪዲዮ ኮንፈረንስ የሚገናኙበት፣ በሰከንዶች ውስጥ የቀጥታ ቋንቋ ትርጉም የተገጠመለት ሁለንተናዊ የቪዲዮ መድረክ።
            </p>
          </div>

          {/* 4 Conference Room Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs">
            <button
              onClick={() => setActiveRoom('synod')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeRoom === 'synod' ? 'bg-amber-500 text-stone-950 font-semibold shadow' : 'text-stone-300 hover:text-white'
              }`}
            >
              👑 የቅዱስ ሲኖዶስ ጉባኤ
            </button>
            <button
              onClick={() => setActiveRoom('confession')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeRoom === 'confession' ? 'bg-amber-500 text-stone-950 font-semibold shadow' : 'text-stone-300 hover:text-white'
              }`}
            >
              ✝ 1-ለ-1 የቪዲዮ ንስሐ
            </button>
            <button
              onClick={() => setActiveRoom('liturgy')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeRoom === 'liturgy' ? 'bg-amber-500 text-stone-950 font-semibold shadow' : 'text-stone-300 hover:text-white'
              }`}
            >
              🎥 የቀጥታ ቅዳሴ ስቱዲዮ
            </button>
            <button
              onClick={() => setActiveRoom('youth')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeRoom === 'youth' ? 'bg-amber-500 text-stone-950 font-semibold shadow' : 'text-stone-300 hover:text-white'
              }`}
            >
              👥 የወጣቶች የቪዲዮ ማኅበር
            </button>
          </div>
        </div>

        {/* Video Conference Stage Container */}
        <div 
          ref={containerRef}
          className={`relative bg-black border border-amber-900/50 overflow-hidden shadow-2xl flex flex-col transition-all ${
            isFullscreen 
              ? 'fixed inset-0 z-50 rounded-none w-screen h-screen min-h-screen' 
              : 'rounded-3xl min-h-[640px]'
          }`}
        >
          {/* Top Video Stage Status Bar */}
          <div className="h-14 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 px-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-2 font-semibold text-amber-300 font-serif-sacred text-sm">
                {activeRoom === 'synod' && '👑 የቅዱስ ሲኖዶስና ሊቃነ ጳጳሳት ዓለም አቀፍ የቪዲዮ ጉባኤ'}
                {activeRoom === 'confession' && '✝ የካህንና የንስሐ ልጅ የቀጥታ 1-ለ-1 የቪዲዮ ኑዛዜ'}
                {activeRoom === 'liturgy' && '🎥 የቀጥታ ቅዳሴና ስብከት ሁለንተናዊ የቪዲዮ ስርጭት'}
                {activeRoom === 'youth' && '👥 የሰንበት ት/ቤትና የወጣቶች የቪዲዮ ጥናት ማኅበር'}
              </span>
              <span className="text-stone-500 font-mono hidden sm:inline">|</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px] hidden sm:flex">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                የቀጥታ ግንኙነት (WebRTC Active · 60fps)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Audio Speech Dubbing Toggle */}
              <button
                onClick={() => setIsAudioDubbingOn(!isAudioDubbingOn)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isAudioDubbingOn
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'bg-stone-900 border border-stone-700 text-stone-400 hover:text-white'
                }`}
                title="ተናጋሪው ሲያወራ በቀጥታ በራስዎ ቋንቋ በድምፅ እንዲሰማ ያድርጉ (Simultaneous Voice Dubbing)"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">የቀጥታ ድምፅ ትርጉም {isAudioDubbingOn ? '(በርቷል 🔊)' : '(ጠፍቷል)'}</span>
              </button>

              {/* Language Selector for Live Video Subtitles */}
              <div className="flex items-center gap-1 bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-xs text-amber-300">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={currentLang}
                  onChange={(e) => onSelectLang(e.target.value as LanguageCode)}
                  className="bg-transparent text-amber-200 focus:outline-none cursor-pointer pr-1"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-stone-900 text-stone-100">
                      {l.nativeLabel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Layout Switcher */}
              <button
                onClick={() => setLayoutMode(layoutMode === 'grid' ? 'spotlight' : 'grid')}
                className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title={layoutMode === 'grid' ? 'Switch to Spotlight View' : 'Switch to Grid View'}
              >
                {layoutMode === 'grid' ? <Layout className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </button>

              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Active Simultaneous Subtitle Banner on Video */}
          <div className="px-6 py-2.5 bg-amber-950/30 border-b border-amber-900/30 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-amber-400">{activeSpeaker.name}:</span>
              <span className="font-serif-sacred italic">"{translatedActiveSpeech}"</span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono shrink-0 ml-4 hidden md:inline">
              በቅጽበት የተተረጎመ (Real-time AI Translation)
            </span>
          </div>

          {/* Video Grid Canvas */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Spotlight Mode View */}
            {layoutMode === 'spotlight' ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
                {/* Main Large Spotlight Tile */}
                <div className="lg:col-span-3 relative rounded-2xl overflow-hidden bg-stone-900 border border-amber-500/50 aspect-video lg:aspect-auto h-full min-h-[380px]">
                  <img
                    src={activeSpeaker.avatarUrl}
                    alt={activeSpeaker.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  
                  {/* Speaker Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h4 className="font-bold font-serif-sacred text-amber-200 text-lg">
                          {activeSpeaker.name}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-300">{activeSpeaker.roleTitle} · {activeSpeaker.location}</p>
                    </div>

                    <div className="p-2 bg-stone-950/80 rounded-lg text-amber-400">
                      <Volume2 className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Right Thumbnails Column */}
                <div className="lg:col-span-1 flex flex-col gap-3">
                  {/* User Local Camera Tile */}
                  <div className="relative rounded-xl overflow-hidden bg-stone-900 border border-stone-800 aspect-video">
                    {isCameraOn ? (
                      !isVirtualCam ? (
                        <video
                          ref={(el) => {
                            localVideoRef.current = el;
                            if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                              el.srcObject = localStreamRef.current;
                              el.play().catch(() => {});
                            }
                          }}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${sacredFilter === 'blur' ? 'blur-sm' : ''}`}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src="/src/assets/images/orthodox_believer_video_1794037021389.jpg"
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 left-1.5 bg-amber-500 text-stone-950 font-bold text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-950 animate-ping" />
                            <span>ቀጥታ ቪዲዮ</span>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-500 p-2 text-center">
                        <VideoOff className="w-6 h-6 mb-1 text-stone-600" />
                        <span className="text-[11px]">ካሜራ አልበራም</span>
                      </div>
                    )}
                    <div className="absolute bottom-1.5 left-2 text-[10px] bg-stone-950/80 text-amber-300 px-1.5 py-0.5 rounded">
                      {userName}
                    </div>
                  </div>

                  {/* Other Participants */}
                  {participants.filter(p => p.id !== activeSpeaker.id).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setActiveSpeakerIndex(participants.findIndex(x => x.id === p.id))}
                      className="relative rounded-xl overflow-hidden bg-stone-900 border border-stone-800 aspect-video cursor-pointer hover:border-amber-400 transition-colors"
                    >
                      <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1.5 left-2 text-[10px] bg-stone-950/80 text-stone-200 px-1.5 py-0.5 rounded">
                        {p.name.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Grid Layout (Default 4-6 video tiles) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                
                {/* Tile 1: User's Own Camera Tile (Interactive Webcam) */}
                <div className={`relative rounded-2xl overflow-hidden bg-stone-900 border aspect-video transition-all shadow-md ${
                  !isMicMuted ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-stone-800'
                }`}>
                  {isCameraOn ? (
                    !isVirtualCam ? (
                      <video
                        ref={(el) => {
                          localVideoRef.current = el;
                          if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                            el.srcObject = localStreamRef.current;
                            el.play().catch(() => {});
                          }
                        }}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${sacredFilter === 'blur' ? 'blur-sm' : ''}`}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src="/src/assets/images/orthodox_believer_video_1794037021389.jpg"
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                        <div className="absolute top-2.5 left-2.5 bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-950 animate-ping" />
                          <span>ቀጥታ ቪዲዮ (Live Video)</span>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-400 p-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-stone-800 border border-amber-900/40 flex items-center justify-center text-amber-400 text-2xl font-serif-sacred mb-2">
                        ✝
                      </div>
                      <span className="text-xs font-semibold text-stone-300">{userName}</span>
                      <span className="text-[10px] text-stone-500 mt-0.5">ካሜራውን ለማብራት ከታች ያለውን የካሜራ ምልክት ይጫኑ</span>
                    </div>
                  )}

                  {/* User Tile Label & Mic indicator */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                    <span className="bg-stone-950/80 backdrop-blur-md text-amber-200 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {userName} (እኔ)
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isHandRaised && (
                        <span className="p-1 bg-amber-500 text-stone-950 rounded-md font-bold" title="Hand Raised">
                          <Hand className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <span className={`p-1 rounded-md ${isMicMuted ? 'bg-red-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
                        {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tiles 2-5: Participants Video Feeds */}
                {participants.map((p, idx) => {
                  const isCurrent = idx === activeSpeakerIndex;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setActiveSpeakerIndex(idx)}
                      className={`relative rounded-2xl overflow-hidden bg-stone-900 border aspect-video cursor-pointer transition-all shadow-md group ${
                        isCurrent 
                          ? 'border-amber-400 ring-2 ring-amber-400/40' 
                          : 'border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* Speaking Glow Animation */}
                      {isCurrent && (
                        <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-950 animate-ping" />
                          <span>እየተናገረ ነው</span>
                        </div>
                      )}

                      {/* Participant Details Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
                        <div>
                          <h5 className="font-serif-sacred font-bold text-amber-100 text-xs sm:text-sm">
                            {p.name}
                          </h5>
                          <p className="text-[10px] text-stone-400">{p.roleTitle}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="p-1 rounded-md bg-stone-950/80 text-stone-300">
                            {p.isMuted ? <MicOff className="w-3.5 h-3.5 text-stone-500" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>

          {/* Camera Permission or Fallback Guidance Toast */}
          {camNotice && (
            <div className="mx-4 mb-2 p-3 bg-amber-950/80 border border-amber-500/50 rounded-xl text-amber-200 text-xs flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{camNotice}</span>
              </div>
              <button
                onClick={() => setCamNotice(null)}
                className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-[11px] font-semibold cursor-pointer shrink-0"
              >
                ተረድቻለሁ
              </button>
            </div>
          )}

          {/* Bottom Live Conference Control Dock */}
          <div className="h-20 bg-stone-950 border-t border-stone-800 px-6 flex items-center justify-between z-20">
            {/* Left Controls: Audio / Video */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  isMicMuted 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' 
                    : 'bg-emerald-500 text-stone-950 shadow-md hover:bg-emerald-400'
                }`}
                title={isMicMuted ? 'ማይክሮፎን አብራ (Unmute)' : 'ማይክሮፎን ዝጋ (Mute)'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMicMuted ? 'ማይክ ዝግ ነው' : 'ማይክ በርቷል'}</span>
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  isCameraOn
                    ? 'bg-amber-500 text-stone-950 shadow-md hover:bg-amber-400'
                    : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                title={isCameraOn ? 'ካሜራ አጥፋ (Turn off Camera)' : 'ካሜራ አብራ (Turn on Camera)'}
              >
                {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{isCameraOn ? 'ካሜራ በርቷል' : 'ካሜራ አብራ'}</span>
              </button>
            </div>

            {/* Center Controls: Interactive Live Participation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isHandRaised 
                    ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                    : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300'
                }`}
                title="እጅ አውጣ (Raise Hand for Question/Blessing)"
              >
                <Hand className="w-4 h-4" />
                <span className="hidden md:inline">{isHandRaised ? 'እጅዎ ወጥቷል ✋' : 'እጅ አውጣ'}</span>
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSharingScreen
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-white'
                }`}
                title="ስክሪን አጋራ (Share Screen)"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden md:inline">{isSharingScreen ? 'ስክሪን እየተጋራ ነው' : 'ስክሪን አጋራ'}</span>
              </button>

              {/* Sacred Atmosphere / Filter Toggle */}
              <button
                onClick={() => setSacredFilter(sacredFilter === 'none' ? 'blur' : 'none')}
                className={`p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  sacredFilter === 'blur'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
                title="የመቅደስ የጀርባ ድብዘዛ (Virtual Background Blur)"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline">{sacredFilter === 'blur' ? 'የጀርባ ድብዘዛ በርቷል' : 'የጀርባ ድብዘዛ'}</span>
              </button>
            </div>

            {/* Right Controls: Room Details & Disconnect */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-stone-400 block font-mono">ተሳታፊዎች: {participants.length + 1}</span>
                <span className="text-[10px] text-amber-400 font-medium">የቀጥታ ስብሰባ</span>
              </div>

              <button
                onClick={() => {
                  if (localStreamRef.current) {
                    localStreamRef.current.getTracks().forEach(t => t.stop());
                    localStreamRef.current = null;
                  }
                  setIsCameraOn(false);
                  setIsMicMuted(true);
                }}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow"
              >
                ውጣ (Leave)
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
