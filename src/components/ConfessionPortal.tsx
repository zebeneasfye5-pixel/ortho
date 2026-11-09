import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Lock, HeartHandshake, CheckCircle2, 
  Calendar, Clock, BookOpen, Send, Sparkles, UserCheck, Flame, Video, VideoOff,
  Maximize2, Minimize2
} from 'lucide-react';
import { ConfessionLesson, PenanceTask } from '../types';
import { INITIAL_CONFESSION_LESSONS } from '../data/orthodoxData';

interface ConfessionPortalProps {
  onOpenDonation?: (category?: string, priest?: string) => void;
}

export const ConfessionPortal: React.FC<ConfessionPortalProps> = ({ onOpenDonation }) => {
  const [activeTab, setActiveTab] = useState<'child' | 'priest'>('child');
  const [lessons, setLessons] = useState<ConfessionLesson[]>(INITIAL_CONFESSION_LESSONS);

  // Believer Penance state
  const [penanceTasks, setPenanceTasks] = useState<PenanceTask[]>([
    {
      id: 'pt-1',
      title: 'የዕለት ጸሎትና 50 ስግደት',
      description: 'በየዕለቱ ጠዋት ወይም ማታ በእግዚአብሔር ፊት ቆሞ ንስሐ መግባትና 50 ስግደት መስገድ',
      completed: true,
      frequency: 'በየቀኑ (Daily)',
      assignedDate: 'ጥቅምት 20'
    },
    {
      id: 'pt-2',
      title: 'ጾመ ድኅነት (ረቡዕና ዓርብ)',
      description: 'እስከ 9 ሰዓት (3 PM) ድረስ ከምግብና መጠጥ መከልከልና ለድሆች መመጽወት',
      completed: true,
      frequency: 'ረቡዕና ዓርብ',
      assignedDate: 'ጥቅምት 20'
    },
    {
      id: 'pt-3',
      title: 'የዕለቱ ውዳሴ ማርያምና መዝሙረ ዳዊት 50',
      description: 'የዕለቱን ውዳሴ ማርያምና "አቤቱ እንደ ቸርነትህ መጠን ማረኝ" የሚለውን የዳዊት መዝሙር ማንበብ',
      completed: false,
      frequency: 'በየቀኑ',
      assignedDate: 'ጥቅምት 25'
    }
  ]);

  // Appointment scheduling state
  const [appointmentDate, setAppointmentDate] = useState('2026-11-08');
  const [appointmentTime, setAppointmentTime] = useState('14:30');
  const [appointmentType, setAppointmentType] = useState('sanctuary');
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);

  // Private confession message simulator
  const [confessionNote, setConfessionNote] = useState('');
  const [confessionSent, setConfessionSent] = useState(false);

  // 1-on-1 Live Video Confession State
  const [isVideoConfessionOpen, setIsVideoConfessionOpen] = useState(false);
  const [isPenitentCamOn, setIsPenitentCamOn] = useState(false);
  const [isVirtualPenitentCam, setIsVirtualPenitentCam] = useState(false);
  const [isConfessionFullscreen, setIsConfessionFullscreen] = useState(false);
  const penitentVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const penitentStreamRef = React.useRef<MediaStream | null>(null);

  // Automatically attach media stream to penitentVideoRef when mounted or updated
  React.useEffect(() => {
    if (isPenitentCamOn && !isVirtualPenitentCam && penitentStreamRef.current && penitentVideoRef.current) {
      if (penitentVideoRef.current.srcObject !== penitentStreamRef.current) {
        penitentVideoRef.current.srcObject = penitentStreamRef.current;
        penitentVideoRef.current.play().catch((e) => console.log('Penitent cam auto-play:', e));
      }
    }
  }, [isPenitentCamOn, isVirtualPenitentCam, isVideoConfessionOpen]);

  // Priest lesson creation form state
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [newLessonScripture, setNewLessonScripture] = useState('');
  const [lessonPublished, setLessonPublished] = useState(false);

  const togglePenitentCam = async () => {
    if (isPenitentCamOn) {
      if (penitentStreamRef.current) {
        penitentStreamRef.current.getTracks().forEach((track) => track.stop());
        penitentStreamRef.current = null;
      }
      if (penitentVideoRef.current) {
        penitentVideoRef.current.srcObject = null;
      }
      setIsPenitentCamOn(false);
      setIsVirtualPenitentCam(false);
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia not supported');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        penitentStreamRef.current = stream;
        setIsVirtualPenitentCam(false);
        setIsPenitentCamOn(true);
        if (penitentVideoRef.current) {
          penitentVideoRef.current.srcObject = stream;
          penitentVideoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Penitent cam unavailable or permission denied, using live virtual feed:', err);
        setIsVirtualPenitentCam(true);
        setIsPenitentCamOn(true);
      }
    }
  };

  const toggleTask = (id: string) => {
    setPenanceTasks((prev: PenanceTask[]) =>
      prev.map((t: PenanceTask) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentSuccess(true);
    setTimeout(() => {
      setAppointmentSuccess(false);
    }, 5000);
  };

  const handleSendConfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confessionNote.trim()) return;
    setConfessionSent(true);
    setTimeout(() => {
      setConfessionNote('');
      setConfessionSent(false);
    }, 5000);
  };

  const handlePublishLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !newLessonContent.trim()) return;

    const newL: ConfessionLesson = {
      id: `cl-${Date.now()}`,
      priestName: 'መልአከ መንክራት ቆሞስ አባ ገብረ ኪዳን',
      priestTitle: 'የንስሐ አባት',
      title: newLessonTitle,
      content: newLessonContent,
      date: 'አሁን የታተመ',
      category: 'repentance',
      scriptureRef: newLessonScripture || 'ያዕቆብ 5፡16 - "እርስ በርሳችሁ በኃጢአታችሁ ተናዘዙ"'
    };

    setLessons([newL, ...lessons]);
    setNewLessonTitle('');
    setNewLessonContent('');
    setNewLessonScripture('');
    setLessonPublished(true);
    setTimeout(() => setLessonPublished(false), 4000);
  };

  return (
    <section id="confession" className="py-16 bg-stone-900/60 text-stone-100 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Curatorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>ምስጢረ ንስሐ · THE SACRAMENT OF HOLY CONFESSION & SPIRITUAL FATHERHOOD</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-sacred font-bold text-amber-100">
              ሚስጥረ ንስሐና የመንፈሳዊ አባትነት ክፍል
            </h2>
            <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
              ካህናት ለንስሐ ልጆቻቸው ትምህርት የሚያስተምሩበት፣ በሚስጥር ኑዛዜ የሚሰጡበትና ቀኖና የሚከታተሉበት የተቀደሰና የተጠበቀ ክፍል ።
            </p>
          </div>

          {/* Perspective Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 bg-stone-950 border border-amber-900/40 rounded-xl">
            <button
              onClick={() => setActiveTab('child')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'child'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              የንስሐ ልጅ ገጽ (Spiritual Child)
            </button>
            <button
              onClick={() => setActiveTab('priest')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'priest'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              የካህን / የንስሐ አባት ገጽ (Priest Confessor)
            </button>
          </div>
        </div>

        {/* Sanctuary Atmospheric Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-900/40 mb-10 shadow-2xl">
          <div className="h-64 sm:h-72 w-full relative">
            <img
              src="/src/assets/images/orthodox_confession_sanctuary_1794000064616.jpg"
              alt="Orthodox Confession Sanctuary"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/40" />
            <div className="absolute inset-0 p-8 flex flex-col justify-center max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-serif-sacred">
                ቅዱስ ሥርዓት · የነፍስ መድኃኒት
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-sacred font-bold text-amber-100 mt-2">
                "ኃጢአታቸውን ይቅር ያላችኋቸው ሁሉ ይቀርላቸዋል"
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 font-serif-sacred italic">
                - የዮሐንስ ወንጌል 20፡23
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-amber-300/80">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% በሚስጥር የተጠበቀ መንፈሳዊ ግንኙነትና ኑዛዜ</span>
              </div>
            </div>
          </div>
        </div>

        {/* View 1: Believer / Spiritual Child View */}
        {activeTab === 'child' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Father of Confession Profile + Schedule + Private Guidance */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Confessor Profile Card */}
              <div className="p-6 bg-stone-950/80 border border-amber-900/30 rounded-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl font-serif-sacred">
                      ✝
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-400 font-medium">የእኔ የንስሐ አባት</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">ንቁ</span>
                      </div>
                      <h4 className="text-lg font-bold font-serif-sacred text-amber-100">
                        መልአከ መንክራት ቆሞስ አባ ገብረ ኪዳን
                      </h4>
                      <p className="text-xs text-stone-400">
                        ደብረ ሊባኖስ ገዳምና አዲስ አበባ መንበረ ፓትርያርክ
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                      መለያ: #CONF-2026-ET
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {onOpenDonation && (
                        <button
                          onClick={() => onOpenDonation('priest_honorarium', 'መልአከ መንክራት ቆሞስ አባ ገብረ ኪዳን')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-850 text-amber-300 border border-amber-500/40 font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                          title="ለአባታችን ፍሬ በረከት / ስጦታ አበርክት"
                        >
                          <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                          <span>ፍሬ በረከት አበርክት</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setIsVideoConfessionOpen(true);
                          togglePenitentCam();
                        }}
                        className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>የቀጥታ 1-ለ-1 የቪዲዮ ንስሐ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Private Spiritual Confession / Consultation Form */}
              <div className="p-6 bg-stone-950/80 border border-amber-900/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif-sacred font-bold text-amber-200 text-base">
                    ሚስጥራዊ የኑዛዜና የመንፈሳዊ ምክር ልመና
                  </h4>
                </div>
                <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                  ይህ መልእክት በቀጥታ ወደ ንስሐ አባትዎ የግል መንፈሳዊ ሳጥን በምስጢር ይላካል። ካህኑ በጸሎትና በቀኖና ይመልሱልዎታል።
                </p>

                <form onSubmit={handleSendConfession} className="space-y-4">
                  <textarea
                    rows={4}
                    value={confessionNote}
                    onChange={(e) => setConfessionNote(e.target.value)}
                    placeholder="የተጸጸቱበትን ጉዳይ፣ መንፈሳዊ ጥያቄዎን ወይም የኑዛዜ ቃልዎን እዚህ በፈሪሃ እግዚአብሔር ይጻፉ..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-amber-400/80 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ካህኑ ብቻ የሚያነቡት የተጠበቀ ሚስጥር ነው
                    </span>
                    <button
                      type="submit"
                      disabled={!confessionNote.trim()}
                      className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>ለአባቴ ላክ</span>
                    </button>
                  </div>
                </form>

                {confessionSent && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>መልእክትዎ ወደ ንስሐ አባትዎ በምስጢር ደርሷል። አባታችን ጸልየው በቅርቡ ይመልሱልዎታል።</span>
                  </div>
                )}
              </div>

              {/* Book Confession Appointment */}
              <div className="p-6 bg-stone-950/80 border border-amber-900/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif-sacred font-bold text-amber-200 text-base">
                    የቀጥታ የንስሐ ቀጠሮ መያዣ
                  </h4>
                </div>

                <form onSubmit={handleBookAppointment} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">ቀን</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">ሰዓት</label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">ዓይነት</label>
                    <select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="sanctuary">በቤተክርስቲያን መቅደስ ፊት ለፊት</option>
                      <option value="audio">በተጠበቀ የቀጥታ ድምፅ (Encrypted Audio)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3 mt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs rounded-xl border border-amber-900/40 transition-colors cursor-pointer"
                    >
                      የቀጠሮ ጥያቄ አስገባ
                    </button>
                  </div>
                </form>

                {appointmentSuccess && (
                  <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>የንስሐ ቀጠሮዎ ተይዟል! አባታችን በቀጠሮው ቀንና ሰዓት ይጠብቁዎታል።</span>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Spiritual Penance (ቀኖና) Tracker + Recent Father's Lessons */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Spiritual Penance (ቀኖና) Checklist */}
              <div className="p-6 bg-stone-950/80 border border-amber-900/30 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif-sacred font-bold text-amber-200 text-base">
                      የተሰጠኝ ቀኖና (Spiritual Penance)
                    </h4>
                  </div>
                  <span className="text-[11px] text-amber-400 font-mono">
                    {penanceTasks.filter((t: PenanceTask) => t.completed).length} / {penanceTasks.length} ተፈጽሟል
                  </span>
                </div>

                <div className="space-y-3">
                  {penanceTasks.map((task: PenanceTask) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-stone-900/50 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          className="mt-1 h-4 w-4 rounded accent-amber-500 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h5 className={`text-xs font-semibold ${task.completed ? 'text-amber-300 line-through' : 'text-stone-200'}`}>
                              {task.title}
                            </h5>
                            <span className="text-[10px] text-stone-500 font-mono">{task.frequency}</span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Father's Lessons Exclusively for Spiritual Children */}
              <div className="p-6 bg-stone-950/80 border border-amber-900/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif-sacred font-bold text-amber-200 text-base">
                    የንስሐ አባቴ ትምህርቶች (Spiritual Lessons)
                  </h4>
                </div>

                <div className="space-y-4">
                  {lessons.slice(0, 2).map((lesson: ConfessionLesson) => (
                    <div key={lesson.id} className="p-4 bg-stone-900/60 rounded-xl border border-stone-800">
                      <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                        <span className="text-amber-400 font-semibold">{lesson.priestName}</span>
                        <span>{lesson.date}</span>
                      </div>
                      <h5 className="text-sm font-semibold text-amber-100 font-serif-sacred">
                        {lesson.title}
                      </h5>
                      <p className="text-xs text-stone-300 mt-2 leading-relaxed font-sans">
                        {lesson.content}
                      </p>
                      <p className="text-[11px] text-amber-300/80 mt-2 italic font-serif-sacred">
                        {lesson.scriptureRef}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* View 2: Priest Confessor View */}
        {activeTab === 'priest' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Publish Lessons to Spiritual Children */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 bg-stone-950/80 border border-amber-900/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h4 className="font-serif-sacred font-bold text-amber-200 text-lg">
                    ለመለገስ የተዘጋጁ ትምህርቶች (አዲስ ትምህርት አትም)
                  </h4>
                </div>
                <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                  አባቴ፤ እዚህ የሚያትቱት መንፈሳዊ ትምህርት በቀጥታ በዓለም ዙሪያ ላሉ የንስሐ ልጆችዎ በሙሉ ይደርሳል።
                </p>

                <form onSubmit={handlePublishLesson} className="space-y-4">
                  <div>
                    <label className="text-xs text-stone-300 block mb-1">የትምህርቱ ርእስ</label>
                    <input
                      type="text"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      placeholder="ለምሳሌ፡ ስለ እውነተኛ ንስሐና ትሕትና..."
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 block mb-1">የትምህርቱ ዝርዝር ይዘት</label>
                    <textarea
                      rows={5}
                      value={newLessonContent}
                      onChange={(e) => setNewLessonContent(e.target.value)}
                      placeholder="ለልጆችዎ የሚሰጡትን ቃለ እግዚአብሔርና ምክር እዚህ ይጻፉ..."
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 block mb-1">የመጽሐፍ ቅዱስ ወይም የአበው ጥቅስ</label>
                    <input
                      type="text"
                      value={newLessonScripture}
                      onChange={(e) => setNewLessonScripture(e.target.value)}
                      placeholder="ለምሳሌ፡ ዮሐንስ 14፡6..."
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                  >
                    ትምህርቱን ለልጆች ላክ ✝
                  </button>
                </form>

                {lessonPublished && (
                  <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>ትምህርቱ በተሳካ ሁኔታ ለንስሐ ልጆችዎ በሙሉ ተላልፏል!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Confession Requests & Spiritual Children Directory */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-stone-950/80 border border-amber-900/30 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif-sacred font-bold text-amber-200 text-base">
                      የቀረቡ የኑዛዜና የቀጠሮ ጥያቄዎች
                    </h4>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">3 በመጠባበቅ ላይ</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-stone-900/70 border border-stone-800 rounded-xl text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-300">ዘበነ አስፋው (አዲስ አበባ)</span>
                      <span className="text-[10px] text-stone-500">ዛሬ 09:15</span>
                    </div>
                    <p className="text-stone-300 mt-1 italic">
                      "አባቴ ሆይ በከባድ መንፈሳዊ ጭንቀት ውስጥ ነኝ፤ የኑዛዜ ቀጠሮ እንዲሰጡኝ በትህትና እለምናለሁ።"
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button className="px-3 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded text-[11px] font-medium cursor-pointer">
                        ቀጠሮውን አጽድቅ
                      </button>
                      <button className="px-3 py-1 bg-stone-800 text-stone-300 hover:bg-stone-700 rounded text-[11px] cursor-pointer">
                        ቀኖና ላክ
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-900/70 border border-stone-800 rounded-xl text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-300">ሰላማዊት ተክሌ (ለንደን)</span>
                      <span className="text-[10px] text-stone-500">ትላንት</span>
                    </div>
                    <p className="text-stone-300 mt-1 italic">
                      "የተሰጠኝን የ50 ስግደትና የጾም ቀኖና ፈጽሜያለሁ፤ ቀጣዩን መመሪያ ይጠብቃሉ።"
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[11px] font-medium cursor-pointer">
                        ቡራኬና የሥርየት ጸሎት ላክ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 1-on-1 Live Video Confession Modal */}
        {isVideoConfessionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className={`relative w-full bg-stone-950 border border-amber-900/60 shadow-2xl overflow-hidden flex flex-col transition-all ${
              isConfessionFullscreen 
                ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
                : 'max-w-4xl rounded-3xl'
            }`}>
              
              {/* Modal Header */}
              <div className="p-4 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-serif-sacred font-bold text-amber-100 text-base">
                      የቀጥታ 1-ለ-1 ሚስጥራዊ የቪዲዮ ንስሐና ኑዛዜ
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      ከአባ ገብረ ኪዳን ጋር በቀጥታ የተገናኘ · 100% የተመሰጠረ ሚስጥር
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsConfessionFullscreen(!isConfessionFullscreen)}
                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs cursor-pointer transition-colors"
                    title={isConfessionFullscreen ? "ሙሉ ስክሪን አጥፋ" : "ሙሉ ስክሪን አድርግ"}
                  >
                    {isConfessionFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      if (penitentStreamRef.current) {
                        penitentStreamRef.current.getTracks().forEach(t => t.stop());
                        penitentStreamRef.current = null;
                      }
                      setIsPenitentCamOn(false);
                      setIsConfessionFullscreen(false);
                      setIsVideoConfessionOpen(false);
                    }}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    ውጣ (End Confession)
                  </button>
                </div>
              </div>

              {/* 2-Way Video Stage */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-black min-h-[380px]">
                {/* Tile 1: Priest Live Video Feed */}
                <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-amber-500/40 aspect-video shadow-xl">
                  <img
                    src="/src/assets/images/orthodox_priest_video_1794037021387.jpg"
                    alt="Confessor Priest Abba Gebrekidan"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-sacred font-bold text-amber-200 text-sm">
                        መልአከ መንክራት ቆሞስ አባ ገብረ ኪዳን
                      </h4>
                      <p className="text-[10px] text-stone-300">የንስሐ አባት (Confessor Priest)</p>
                    </div>
                    <span className="p-1 bg-emerald-500/80 text-white rounded text-[10px] font-mono">
                      ቀጥታ ቪዲዮ
                    </span>
                  </div>
                </div>

                {/* Tile 2: Believer Live Video Feed */}
                <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 aspect-video shadow-xl">
                  {isPenitentCamOn ? (
                    !isVirtualPenitentCam ? (
                      <video
                        ref={(el) => {
                          penitentVideoRef.current = el;
                          if (el && penitentStreamRef.current && el.srcObject !== penitentStreamRef.current) {
                            el.srcObject = penitentStreamRef.current;
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
                          alt="Penitent Believer Live Feed"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4">
                      <VideoOff className="w-8 h-8 text-stone-600 mb-2" />
                      <span className="text-xs">ካሜራዎ አልበራም</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-sacred font-bold text-amber-200 text-sm">
                        ዘበነ አስፋው (የንስሐ ልጅ)
                      </h4>
                      <p className="text-[10px] text-stone-300">ምእመን (Penitent Believer)</p>
                    </div>

                    <button
                      onClick={togglePenitentCam}
                      className="p-1.5 bg-stone-900/90 text-amber-300 hover:text-white rounded-lg text-xs"
                      title={isPenitentCamOn ? "Turn off camera" : "Turn on camera"}
                    >
                      {isPenitentCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Pastoral Blessing Footer */}
              <div className="p-4 bg-stone-900/95 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-amber-200 font-serif-sacred italic">
                  "እግዚአብሔር ይፍታህ፤ በደልህን ሁሉ ይደምስስልህ። በፈሪሃ እግዚአብሔር ኑር።"
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ሚስጥራዊ የድምፅና የቪዲዮ መስመር
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
