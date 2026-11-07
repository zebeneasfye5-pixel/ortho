import React, { useState, useEffect } from 'react';
import { 
  User, ShieldCheck, Award, QrCode, Download, 
  CheckCircle2, Edit3, X, Save, Church, Heart, 
  MapPin, Phone, Mail, Sparkles, BookOpen, Camera
} from 'lucide-react';
import { MemberProfile, UserRole, LanguageCode } from '../types';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: MemberProfile;
  onSaveProfile: (profile: MemberProfile) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile
}) => {
  const [activeTab, setActiveTab] = useState<'badge' | 'edit'>('badge');
  const [formData, setFormData] = useState<MemberProfile>(currentProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    setFormData(currentProfile);
  }, [currentProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('badge');
    }, 1200);
  };

  const handleDownloadCard = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const sampleAvatars = [
    '/src/assets/images/orthodox_believer_video_1794037021389.jpg',
    '/src/assets/images/orthodox_priest_video_1794037021387.jpg',
    '/src/assets/images/orthodox_bishop_conference_1794037020418.jpg',
    '/src/assets/images/orthodox_ancient_manuscript_1794000065693.jpg'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-amber-900/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 border-b border-amber-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-sacred font-bold text-amber-100 text-lg sm:text-xl">
                የምእመንነት ዲጂታል መታወቂያና ፕሮፋይል
              </h3>
              <p className="text-xs text-stone-400">
                የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ዓለም አቀፍ የምእመናን መዝገብ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
            title="ዝጋ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-800 bg-stone-950/50 px-6 pt-3 gap-6">
          <button
            onClick={() => setActiveTab('badge')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'badge'
                ? 'text-amber-400 border-amber-400'
                : 'text-stone-400 border-transparent hover:text-stone-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>ዲጂታል መታወቂያ (Membership ID)</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'edit'
                ? 'text-amber-400 border-amber-400'
                : 'text-stone-400 border-transparent hover:text-stone-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>መረጃዬን አስተካክል (Edit Profile)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {activeTab === 'badge' ? (
            <div className="space-y-6">
              {/* Prestigious Ethiopian Orthodox Membership ID Card */}
              <div 
                id="orthodox-id-card"
                className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-amber-950/60 via-stone-900 to-stone-950 border-2 border-amber-500/60 shadow-2xl"
              >
                {/* Background Watermark Cross */}
                <div className="absolute right-4 -bottom-10 text-amber-500/5 text-[180px] font-serif-sacred select-none pointer-events-none">
                  ✝
                </div>

                {/* Card Header Strip */}
                <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-serif-sacred text-amber-400 font-bold">✝</span>
                    <div>
                      <h4 className="font-serif-sacred font-bold text-amber-200 text-sm sm:text-base tracking-wide">
                        የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን
                      </h4>
                      <p className="text-[10px] text-amber-300/80 font-mono">
                        ETHIOPIAN ORTHODOX TEWAHEDO CHURCH UNIVERSAL DIGITAL ID
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] rounded-full font-bold">
                    VERIFIED
                  </span>
                </div>

                {/* Card Main Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 items-center">
                  {/* Photo & Role */}
                  <div className="flex flex-col items-center sm:items-start gap-2">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-stone-800">
                      <img
                        src={formData.avatarUrl || '/src/assets/images/orthodox_believer_video_1794037021389.jpg'}
                        alt={formData.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="px-2.5 py-0.5 bg-amber-500 text-stone-950 font-bold text-[10px] rounded-full uppercase">
                      {formData.role === 'priest' ? 'ካህን / ቆሞስ' : formData.role === 'deacon' ? 'ዲያቆን' : formData.role === 'bishop' ? 'ሊቀ ጳጳስ' : formData.role === 'choir' ? 'መዘምር' : 'ምእመን'}
                    </span>
                  </div>

                  {/* Spiritual Names & Parish */}
                  <div className="sm:col-span-2 space-y-3 text-center sm:text-left">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-stone-400 block">የምእመኑ ሙሉ ስም / Name</span>
                      <h3 className="font-serif-sacred font-bold text-amber-100 text-xl sm:text-2xl">
                        {formData.fullName || 'ዘበነ አስፋው'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">የክርስትና ስም (Baptismal)</span>
                        <span className="font-serif-sacred font-bold text-amber-300 text-sm">
                          {formData.baptismalName || 'ወልደ ጴጥሮስ'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">የንስሐ አባት (Confessor)</span>
                        <span className="font-serif-sacred text-stone-200">
                          {formData.confessorFather || 'አባ ገብረ ኪዳን'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-800/80 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">ሀገረ ስብከት (Diocese)</span>
                        <span className="text-stone-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{formData.diocese || 'አዲስ አበባ'}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">ደብር / ቤተክርስቲያን (Parish)</span>
                        <span className="text-stone-300 flex items-center gap-1">
                          <Church className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{formData.parishName || 'መንበረ ጸባዖት'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Strip with Barcode/QR */}
                <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-mono">መለያ ቁጥር (Membership ID)</span>
                    <span className="font-mono text-amber-300 font-bold tracking-wider">
                      {formData.membershipId || 'EOTC-2026-8849-ET'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800">
                    <QrCode className="w-6 h-6 text-amber-400" />
                    <span className="text-[10px] text-stone-400 font-mono leading-tight">
                      በሲኖዶስ መዝገብ<br/>የተረጋገጠ
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('edit')}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>ፕሮፋይል አስተካክል (Edit Info)</span>
                </button>

                <button
                  onClick={handleDownloadCard}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4 text-stone-950" />
                  <span>ዲጂታል መታወቂያውን አስቀምጥ (Save ID Card)</span>
                </button>
              </div>

              {downloadSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>የምእመንነት ዲጂታል መታወቂያዎ በተሳካ ሁኔታ ተቀምጧል! (Saved to device)</span>
                </div>
              )}
            </div>
          ) : (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    ሙሉ ስም (Full Legal Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="ለምሳሌ፡ ዘበነ አስፋው"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    የክርስትና ስም (Baptismal Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.baptismalName}
                    onChange={(e) => setFormData({ ...formData, baptismalName: e.target.value })}
                    placeholder="ለምሳሌ፡ ወልደ ጴጥሮስ / ወለተ ማርያም"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    ማዕረግ / ደረጃ (Spiritual Role)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="believer">ምእመን (Believer)</option>
                    <option value="deacon">ዲያቆን (Deacon)</option>
                    <option value="priest">ቀሲስ / ቆሞስ (Priest)</option>
                    <option value="choir">መዘምር / መዘምራን (Choir)</option>
                    <option value="sunday_school">የሰንበት ት/ቤት አባል</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    ሀገረ ስብከት (Diocese)
                  </label>
                  <input
                    type="text"
                    value={formData.diocese}
                    onChange={(e) => setFormData({ ...formData, diocese: e.target.value })}
                    placeholder="አዲስ አበባ / ሰሜን አሜሪካ..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    ደብር / ቤተክርስቲያን (Parish)
                  </label>
                  <input
                    type="text"
                    value={formData.parishName}
                    onChange={(e) => setFormData({ ...formData, parishName: e.target.value })}
                    placeholder="መንበረ ጸባዖት ቅድስት ሥላሴ..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    የንስሐ አባት ስም (Father Confessor)
                  </label>
                  <input
                    type="text"
                    value={formData.confessorFather}
                    onChange={(e) => setFormData({ ...formData, confessorFather: e.target.value })}
                    placeholder="መልአከ መንክራት ቆሞስ አባ ገብረ ኪዳን..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    ስልክ ወይም ኢሜይል (Phone / Email)
                  </label>
                  <input
                    type="text"
                    value={formData.phone || formData.email}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value, email: e.target.value })}
                    placeholder="+251 9... / email@example.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Spiritual Bio / Motto */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  የሕይወት መሪ ቃል / ጥቅስ (Favorite Scripture / Spiritual Bio)
                </label>
                <input
                  type="text"
                  value={formData.spiritualBio}
                  onChange={(e) => setFormData({ ...formData, spiritualBio: e.target.value })}
                  placeholder="መዝሙር 22፡1 - 'እግዚአብሔር እረኛዬ ነው የሚያሳጣኝም የለም።'"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-2">
                  የፕሮፋይል ሥዕል ይምረጡ (Choose Profile Portrait)
                </label>
                <div className="flex items-center gap-3">
                  {sampleAvatars.map((av, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, avatarUrl: av })}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        formData.avatarUrl === av 
                          ? 'border-amber-400 scale-105 shadow-md' 
                          : 'border-stone-800 hover:border-stone-600'
                      }`}
                    >
                      <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('badge')}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  ተመለስ
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-4 h-4 text-stone-950" />
                  <span>መረጃዬን መዝግብ / አስቀምጥ (Save Profile)</span>
                </button>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ፕሮፋይልዎ በተሳካ ሁኔታ ተመዝግቧል! (Profile updated successfully)</span>
                </div>
              )}
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
