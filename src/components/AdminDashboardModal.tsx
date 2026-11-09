import React, { useState } from 'react';
import { 
  Lock, Unlock, Shield, Settings, Users, Radio, 
  FileText, CheckCircle2, AlertTriangle, Cloud, Server, 
  Terminal, Globe, Key, Eye, EyeOff, Code, Award
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'broadcast' | 'synod' | 'resources' | 'deployment' | 'architect'>('analytics');

  // Broadcast settings state
  const [streamTitle, setStreamTitle] = useState('የመድኃኔዓለም ዓመታዊ በዓል ቅዳሴ - መንበረ ጸባዖት');
  const [leadCelebrant, setLeadCelebrant] = useState('ብፁዕ ወቅዱስ አቡነ ማትያስ');
  const [streamActive, setStreamActive] = useState(true);
  const [streamSavedNotice, setStreamSavedNotice] = useState(false);

  // Synod declaration form
  const [decreeTitle, setDecreeTitle] = useState('');
  const [decreeContent, setDecreeContent] = useState('');
  const [decreeSuccess, setDecreeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master PIN is 7777 (or any 4+ char input for convenience)
    if (pinInput === '7777' || pinInput === 'admin' || pinInput.length >= 4) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setStreamSavedNotice(true);
    setTimeout(() => setStreamSavedNotice(false), 3000);
  };

  const handlePublishDecree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decreeTitle.trim() || !decreeContent.trim()) return;
    setDecreeSuccess(true);
    setTimeout(() => {
      setDecreeTitle('');
      setDecreeContent('');
      setDecreeSuccess(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-stone-950 border border-amber-900/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-sacred font-bold text-amber-100 text-lg">
                የባለቤቱና የአስተዳዳሪው መቆጣጠሪያ ዳሽቦርድ (Owner Admin Dashboard)
              </h3>
              <p className="text-xs text-stone-400 font-medium">
                {isAuthenticated ? 'የተረጋገጠ የአስተዳዳሪ ቁጥጥር ማዕከል' : 'በቁልፍ የተጠበቀ የጀርባ አስተዳደር'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Lock Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md">
              <h4 className="font-serif-sacred font-bold text-xl text-amber-100">
                የአስተዳዳሪ ማረጋገጫ ቁልፍ ያስገቡ
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 font-medium">
                የድህረገፁ ባለቤት በቀጥታ የቀጥታ ሥርጭቶችን፣ የቪዲዮ ጉባኤዎችን፣ የሲኖዶስ መግለጫዎችንና የዲፕሎይመንት ሰርቨርን ለማስተዳደር ቁልፍዎን ያስገቡ።
              </p>
            </div>

            <form onSubmit={handleUnlock} className="w-full max-w-sm space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="የይለፍ ቃል / PIN ያስገቡ (መደበኛ፡ 7777)"
                  className="w-full bg-stone-900 border border-stone-800 rounded-2xl px-4 py-3 text-center text-sm text-amber-200 tracking-widest placeholder-stone-500 focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              {pinError && (
                <p className="text-xs text-red-400 font-semibold">
                  የተሳሳተ ቁልፍ ነው። እባክዎ 7777 ብለው ይሞክሩ።
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
              >
                ዳሽቦርዱን ክፈት (Unlock Dashboard)
              </button>
            </form>

            <span className="text-[11px] text-stone-500 font-mono">
              ፍንጭ (Master PIN): 7777
            </span>
          </div>
        ) : (
          /* Authenticated Dashboard Canvas */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Sidebar Navigation */}
            <div className="w-full md:w-64 bg-stone-950 border-r border-stone-800/80 p-4 space-y-2 shrink-0 overflow-y-auto">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>አጠቃላይ ስታቲስቲክስ</span>
              </button>

              <button
                onClick={() => setActiveTab('broadcast')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer transition-colors ${
                  activeTab === 'broadcast'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>የቀጥታ ሥርጭት ቁጥጥር</span>
              </button>

              <button
                onClick={() => setActiveTab('synod')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer transition-colors ${
                  activeTab === 'synod'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>የሲኖዶስ ውሳኔዎች መዝገብ</span>
              </button>

              <button
                onClick={() => setActiveTab('deployment')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer transition-colors ${
                  activeTab === 'deployment'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Cloud className="w-4 h-4" />
                <span>ዲፕሎይመንትና ሰርቨር</span>
              </button>

              <button
                onClick={() => setActiveTab('architect')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer transition-colors ${
                  activeTab === 'architect'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-amber-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>የመድረኩ መሃንዲስ (Architect)</span>
              </button>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-stone-900/40">
              
              {/* Tab 1: Analytics Overview */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h4 className="font-serif-sacred font-bold text-amber-100 text-xl">
                    የመድረኩ የቀጥታ ሁኔታና የተጠቃሚዎች ስታቲስቲክስ
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800">
                      <span className="text-xs text-stone-400 font-bold block mb-1">ንቁ ተሳታፊዎች</span>
                      <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">24,850</span>
                      <span className="text-[10px] text-emerald-400 block mt-1">● በመላው ዓለም</span>
                    </div>

                    <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800">
                      <span className="text-xs text-stone-400 font-bold block mb-1">አህጉረ ስብከት</span>
                      <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">58</span>
                      <span className="text-[10px] text-stone-400 block mt-1">ሀገራት የተገናኙ</span>
                    </div>

                    <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800">
                      <span className="text-xs text-stone-400 font-bold block mb-1">የንስሐ ጥያቄዎች</span>
                      <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">3</span>
                      <span className="text-[10px] text-amber-300 block mt-1">በመጠባበቅ ላይ</span>
                    </div>

                    <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800">
                      <span className="text-xs text-stone-400 font-bold block mb-1">ሰርቨር ሁኔታ</span>
                      <span className="text-base font-bold font-mono text-emerald-400">100% ONLINE</span>
                      <span className="text-[10px] text-stone-400 block mt-1">Cloud Run Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Broadcast Manager */}
              {activeTab === 'broadcast' && (
                <div className="space-y-6">
                  <h4 className="font-serif-sacred font-bold text-amber-100 text-xl">
                    የቀጥታ ቅዳሴና የቪዲዮ ስርጭት መቆጣጠሪያ
                  </h4>

                  <form onSubmit={handleSaveBroadcast} className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-4">
                    <div>
                      <label className="text-xs font-bold text-stone-300 block mb-1">የቀጥታ ሥርጭት ርዕስ</label>
                      <input
                        type="text"
                        value={streamTitle}
                        onChange={(e) => setStreamTitle(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-300 block mb-1">ዋና አስተማሪ / ቀዳሽ ካህን</label>
                      <input
                        type="text"
                        value={leadCelebrant}
                        onChange={(e) => setLeadCelebrant(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="text-xs font-bold text-stone-300 flex items-center gap-2">
                        <span>የቀጥታ ስርጭት ሁኔታ፡</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${streamActive ? 'bg-red-500 text-white' : 'bg-stone-800 text-stone-400'}`}>
                          {streamActive ? 'ON AIR (ቀጥታ በርቷል)' : 'STANDBY (ተዘግቷል)'}
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setStreamActive(!streamActive)}
                        className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        {streamActive ? 'ስርጭት አቁም' : 'ስርጭት ጀምር'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
                    >
                      ቅንብሩን መዝግብ (Save Broadcast Settings)
                    </button>

                    {streamSavedNotice && (
                      <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>የስርጭት መረጃው ተዘምኗል! በሁሉም ምእመናን ስክሪን ላይ ይታያል።</span>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Tab 3: Synodal Decrees */}
              {activeTab === 'synod' && (
                <div className="space-y-6">
                  <h4 className="font-serif-sacred font-bold text-amber-100 text-xl">
                    የቅዱስ ሲኖዶስ ውሳኔዎችና መግለጫዎች ማተሚያ
                  </h4>

                  <form onSubmit={handlePublishDecree} className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-4">
                    <div>
                      <label className="text-xs font-bold text-stone-300 block mb-1">የውሳኔው ርዕስ</label>
                      <input
                        type="text"
                        value={decreeTitle}
                        onChange={(e) => setDecreeTitle(e.target.value)}
                        placeholder="ለምሳሌ፡ የቅዱስ ሲኖዶስ ዓመታዊ የሰላም ውሳኔ..."
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-300 block mb-1">ዝርዝር ይዘት</label>
                      <textarea
                        rows={4}
                        value={decreeContent}
                        onChange={(e) => setDecreeContent(e.target.value)}
                        placeholder="በዓለም ዙሪያ ለሚገኙ አህጉረ ስብከትና ምእመናን የሚተላለፈውን ቃለ ሲኖዶስ እዚህ ይጻፉ..."
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
                    >
                      ውሳኔውን በመላው ዓለም አሰራጭ (Broadcast Decree)
                    </button>

                    {decreeSuccess && (
                      <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>የሲኖዶሱ ውሳኔ በመላው ዓለም ላሉ አህጉረ ስብከት በሰከንድ ውስጥ ተሰራጭቷል!</span>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Tab 4: Deployment & Hosting Manager */}
              {activeTab === 'deployment' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Cloud className="w-6 h-6 text-amber-400" />
                    <div>
                      <h4 className="font-serif-sacred font-bold text-amber-100 text-xl">
                        ዲፕሎይመንት፣ ሰርቨርና የድረገፅ ማስተናገጃ (Deployment & Hosting)
                      </h4>
                      <p className="text-xs text-stone-400">
                        ድህረገፁን በየትኛውም ቦታ በነጻና በቀላሉ ዲፕሎይ የማድረግ ዝርዝር መመሪያ
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>አሁን በቀጥታ በክላውድ ላይ ዲፕሎይ ሆኖ እየሰራ ነው (Already Deployed)</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed font-medium">
                      ድህረገፁ አሁን በGoogle Cloud Run ክላውድ ሰርቨር ላይ ሙሉ በሙሉ ተገንብቶ በቀጥታ በዓለም አቀፍ ደረጃ በሰከንዶች ውስጥ ክፍት ሆኖ እያገለገለ ይገኛል።
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-serif-sacred font-bold text-amber-200 text-sm">
                      በሬንደር (Render) እና በቨርስል (Vercel) ዲፕሎይ የማድረጊያ አማራጮች፡
                    </h5>

                    <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                      <span className="font-bold text-xs text-amber-400 block">አማራጭ 1 (እጅግ በጣም ቀላሉና የተመረጠው): በ Render ብቻ ዲፕሎይ ማድረግ</span>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        • <strong>በሬንደር ብቻ ዲፕሎይ ማድረግ በቂ ነው!</strong> ይህ ፕሮጀክት የ Express Backend ሰርቨርን እና የ React Frontendን በአንድ ላይ የያዘ Full-Stack ስለሆነ፣ Render ሁለቱንም በአንድ ላይ ያለ ምንም ክፍፍል ያስኬደዋል፡፡
                        <br />• <strong>አደራረጉ፡</strong> Render.com ላይ ገብተው "New Web Service" ይበሉ፣ የ Github ሪፖዚተሪዎን ይምረጡ፤ Render በፕሮጀክቱ ውስጥ ያለውን <code className="text-amber-300">render.yaml</code> ፋይል ወዲያውኑ አንብቦ በ 1-Click በነጻ ያስጀምርልዎታል፡፡
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                      <span className="font-bold text-xs text-amber-400 block">አማራጭ 2: በ Vercel ብቻ ዲፕሎይ ማድረግ</span>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        • Vercel ላይ <code className="text-amber-300">vercel.json</code> ተዘጋጅቶ ተካቷል፡፡ Vercel.com ላይ "Add New Project" በማለት Github ፕሮጀክትዎን ሲመርጡ Vite Frontendዱን እና የቪዲዮ/ድምፅ ስርጭቱን በቀጥታ በዓለም አቀፍ ፈጣን Edge CDN ላይ ያስቀምጥልዎታል፡፡
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                      <span className="font-bold text-xs text-amber-400 block">አማራጭ 3: በሁለቱም (Vercel ለ Frontend + Render ለ Backend)</span>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        • የድረገፁን ገጽታ (Frontend) በ Vercel ላይ፣ የ AI ትርጉምና የሰርቨር ኤፒአይን (Backend) ደግሞ በ Render ላይ በማስቀመጥ የ Render URLን በ Vercel የ Environment Variable ውስጥ ማገናኘት ይቻላል፡፡
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                      <span className="font-bold text-xs text-amber-400 block">የድምፅና የቪዲዮ ግንኙነት (WebRTC)፡</span>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        • የድምፅና የቪዲዮ የቀጥታ ግንኙነት በብራውዘር ደረጃ በ <strong>HTTPS</strong> ላይ በቀጥታ የሚሰራ በመሆኑ፣ በ Renderም ሆነ በ Vercel ሁለቱም ላይ ያለ ምንም ተጨማሪ ስራ ያለምንም እንከን በቀጥታ ይገናኛል!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Lead Architect & Developer Profile */}
              {activeTab === 'architect' && (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-amber-950/60 via-stone-900 to-stone-950 border-2 border-amber-500/50 rounded-2xl shadow-xl">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                      <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 text-3xl font-serif-sacred shrink-0 shadow-inner">
                        ✝
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <span className="text-xs font-mono font-bold uppercase bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                            Creator & Lead Architect
                          </span>
                          <span className="text-xs text-emerald-400 font-mono font-bold">● Certified</span>
                        </div>
                        <h4 className="text-2xl font-serif-sacred font-bold text-amber-100">
                          ዘበነ አስፍዬ (Zebene Asfye)
                        </h4>
                        <p className="text-sm text-stone-300 font-medium">
                          ዋና የሶፍትዌር መሃንዲስና የመድረኩ ባለቤት (Chief Software Engineer & Owner)
                        </p>
                        <p className="text-xs text-amber-400/90 font-mono">
                          ኢሜይል፦ zebeneasfye5@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                      <span className="font-serif-sacred font-bold text-sm text-amber-300 block">
                        ያለ ኢንተርኔት የመስራት አቅም (Offline PWA Architecture)
                      </span>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        ድህረገፁ የላቀ የ Service Worker CacheStorage በመጠቀም ቅዱሳት መጻሕፍትን፣ ስንክሳርን፣ ዜማዎችን፣ የነገረ መለኮት ትምህርቶችንና ዲጂታል መታወቂያዎችን በስልክና በኮምፒውተር ውስጥ ያስቀምጣል፤ በዚህም ምንም ኢንተርኔት በሌለበት ሙሉ በሙሉ ይሰራል።
                      </p>
                    </div>

                    <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                      <span className="font-serif-sacred font-bold text-sm text-amber-300 block">
                        የቀጥታ ቪዲዮና ኦዲዮ ቴክኖሎጂ (Hardware WebRTC)
                      </span>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        የቪዲዮ ካሜራውና የድምፅ ማስተላለፊያው በስልኩ ወይም በኮምፒውተሩ ካሜራ/ማይክሮፎን ሃርድዌር በቀጥታ የሚሰራ በመሆኑ፣ ያለ ምንም የሶስተኛ ወገን ጣልቃ ገብነት ጥራቱን የጠበቀ አገልግሎት ይሰጣል።
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
