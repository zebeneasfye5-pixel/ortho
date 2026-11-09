import React, { useState } from 'react';
import { Globe, Radio, Volume2, VolumeX, Moon, Sun, Lock, BookOpen, Menu, X, Shield, Settings, Server, ChevronRight, User, HeartHandshake } from 'lucide-react';
import { LanguageCode, MemberProfile } from '../types';
import { SUPPORTED_LANGUAGES, UI_STRINGS } from '../data/orthodoxData';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAdmin: () => void;
  onOpenProfile?: () => void;
  onOpenDonation?: (category?: string) => void;
  userProfile?: MemberProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  activeSection,
  onNavigate,
  isAudioPlaying,
  onToggleAudio,
  isDarkMode,
  onToggleTheme,
  onOpenAdmin,
  onOpenProfile,
  onOpenDonation,
  userProfile
}) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const strings = UI_STRINGS[currentLang] || UI_STRINGS.am;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-stone-950/90 dark:bg-stone-950/95 backdrop-blur-md border-b border-amber-900/30 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: 3-line Hamburger Menu (በስተግራ በ3ሰረዝ ማውጫ) + Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            {/* 3-Line Menu Button */}
            <button
              onClick={() => setIsSideMenuOpen(true)}
              className="p-2 -ml-1 text-amber-400 hover:text-amber-300 hover:bg-stone-900/80 active:bg-stone-800 rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              title="ዋና ማውጫና የአስተዳዳሪ ጓዳ (3-Bar Navigation & Secret Admin Portal)"
              aria-label="3-line navigation menu"
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>

            <button 
              onClick={() => onNavigate('hero')}
              className="text-left group flex items-center gap-2 cursor-pointer focus-visible:outline-none"
            >
              <span className="text-xl lg:text-2xl font-serif-sacred font-bold tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
                ✝ ኦርቶዶክስ
              </span>
            </button>
          </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-base font-semibold">
          <button
            onClick={() => onNavigate('live')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-1 border-b-2 ${
              activeSection === 'live' 
                ? 'text-amber-400 border-amber-400 font-bold' 
                : 'text-stone-200 border-transparent hover:text-white hover:border-amber-400/50'
            }`}
          >
            {strings.navLive}
          </button>

          <button
            onClick={() => onNavigate('conference')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              activeSection === 'conference' 
                ? 'text-amber-400 border-amber-400 font-semibold' 
                : 'text-stone-300 border-transparent hover:text-white hover:border-amber-400/50'
            }`}
          >
            {strings.navConference || 'የቪዲዮ ኮንፈረንስ'}
          </button>

          <button
            onClick={() => onNavigate('confession')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              activeSection === 'confession' 
                ? 'text-amber-400 border-amber-400 font-semibold' 
                : 'text-stone-300 border-transparent hover:text-white hover:border-amber-400/50'
            }`}
          >
            {strings.navConfession}
          </button>

          <button
            onClick={() => onNavigate('hierarchy')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              activeSection === 'hierarchy' 
                ? 'text-amber-400 border-amber-400 font-semibold' 
                : 'text-stone-300 border-transparent hover:text-white hover:border-amber-400/50'
            }`}
          >
            {strings.navHierarchy}
          </button>

          <button
            onClick={() => onNavigate('theology')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              activeSection === 'theology' 
                ? 'text-amber-400 border-amber-400 font-semibold' 
                : 'text-stone-300 border-transparent hover:text-white hover:border-amber-400/50'
            }`}
          >
            {strings.navTheology}
          </button>

          <button
            onClick={() => onNavigate('resources')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              activeSection === 'resources' 
                ? 'text-amber-400 border-amber-400 font-semibold' 
                : 'text-stone-300 border-transparent hover:text-white hover:border-amber-400/50'
            }`}
          >
            {currentLang === 'am' ? 'የመረጃ ቋት' : currentLang === 'gez' ? 'መዛግብት' : currentLang === 'ti' ? 'መረዳእታታት' : currentLang === 'om' ? 'Kuusaa Barreeffamaa' : 'Media & Docs'}
          </button>

          <button
            onClick={() => onNavigate('calendar')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              activeSection === 'calendar' 
                ? 'text-amber-400 border-amber-400 font-semibold' 
                : 'text-stone-300 border-transparent hover:text-white hover:border-amber-400/50'
            }`}
          >
            {strings.navCalendar}
          </button>

          <button
            onClick={() => onNavigate('hymns')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              activeSection === 'hymns' 
                ? 'text-amber-400 border-amber-400 font-semibold' 
                : 'text-stone-300 border-transparent hover:text-white hover:border-amber-400/50'
            }`}
          >
            {strings.navHymns}
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster (Language + Sacred Chant + PWA + Live action) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sacred Chants audio toggle button */}
          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? "Pause Sacred Chants" : "Listen to Sacred Chants"}
            className="p-2 text-amber-300/80 hover:text-amber-300 hover:bg-stone-800/80 rounded-md transition-colors cursor-pointer"
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            title="Toggle Theme"
            className="p-2 text-stone-300 hover:text-amber-300 hover:bg-stone-800/80 rounded-md transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Multilingual Selector dropdown */}
          <div className="relative flex items-center bg-stone-900 border border-amber-900/40 rounded-lg px-2.5 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => onSelectLang(e.target.value as LanguageCode)}
              className="bg-transparent text-amber-100 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-stone-900 text-stone-100">
                  {lang.nativeLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Member Profile & Digital ID Button */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-900 hover:bg-stone-850 border border-amber-900/40 hover:border-amber-500/60 rounded-lg text-xs transition-all cursor-pointer"
              title="የምእመንነት መታወቂያና ፕሮፋይል (Member Profile & Digital ID)"
            >
              <img
                src={userProfile?.avatarUrl || '/src/assets/images/orthodox_believer_video_1794037021389.jpg'}
                alt={userProfile?.fullName || 'Profile'}
                className="w-4 h-4 rounded-full object-cover border border-amber-400/80 shrink-0"
              />
              <span className="hidden sm:inline font-semibold text-stone-200 truncate max-w-[100px]">
                {userProfile?.baptismalName || userProfile?.fullName || 'ፕሮፋይል'}
              </span>
            </button>
          )}

          {/* Donation & Tithe Action Button */}
          {onOpenDonation && (
            <button
              onClick={() => onOpenDonation('monasteries')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600/30 to-amber-700/40 hover:from-amber-600/50 hover:to-amber-700/60 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              title="የበረከት ስጦታና አስራት አበርክት (International & Local Donations)"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              <span>ስጦታ/አስራት</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton variant="compact" />

          {/* Primary Action CTA */}
          <button
            onClick={() => onNavigate('live')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Radio className="w-3.5 h-3.5 text-stone-950 animate-pulse" />
            <span>{strings.joinLive}</span>
          </button>
        </div>
      </div>
    </header>

    {/* 3-Line Hamburger Left Slide-Out Drawer (በስተግራ በ3ሰረዝ ማውጫ በስተጀርባ የተደበቀ) */}
    {isSideMenuOpen && (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop overlay */}
        <div 
          onClick={() => setIsSideMenuOpen(false)}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        />

        {/* Sidebar Panel */}
        <aside className="relative z-10 w-80 max-w-[85vw] h-full bg-stone-950 border-r border-amber-900/40 shadow-2xl flex flex-col justify-between overflow-y-auto p-6 animate-in slide-in-from-left duration-300">
          <div className="space-y-5">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/30">
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif-sacred font-bold text-amber-400">
                  ✝ ኦርቶዶክስ
                </span>
                <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                  ማውጫ
                </span>
              </div>
              <button
                onClick={() => setIsSideMenuOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-900 rounded-lg transition-colors cursor-pointer"
                title="ዝጋ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Member Profile & Digital ID Mini-Badge Card */}
            {onOpenProfile && (
              <div className="p-3.5 bg-gradient-to-br from-stone-900 to-amber-950/30 border border-amber-500/30 rounded-2xl shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-serif-sacred font-bold text-amber-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>የምእመንነት መታወቂያ</span>
                  </span>
                  <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Verified
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={userProfile?.avatarUrl || '/src/assets/images/orthodox_believer_video_1794037021389.jpg'}
                    alt={userProfile?.fullName || 'User'}
                    className="w-11 h-11 rounded-xl object-cover border-2 border-amber-400/80 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="font-bold font-serif-sacred text-stone-100 text-xs block truncate">
                      {userProfile?.fullName || 'ዘበነ አስፋው'}
                    </span>
                    <span className="text-[10px] text-amber-300 block truncate font-serif-sacred">
                      {userProfile?.baptismalName || 'ወልደ ጴጥሮስ'}
                    </span>
                    <span className="text-[10px] text-stone-400 block font-mono">
                      {userProfile?.membershipId || 'EOTC-2026-8849-ET'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full mt-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  ዲጂታል ካርዱን እይ / ፕሮፋይል አስተካክል
                </button>
              </div>
            )}

            {/* Secret / Hidden Admin Portal Card (መረጃውን በስተጀርባ የደበቀው ክፍል) */}
            <div className="p-4 bg-gradient-to-br from-amber-950/50 via-stone-900 to-stone-950 border border-amber-800/40 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="font-serif-sacred font-bold text-xs tracking-wide">
                  የባለቤትና የአስተዳዳሪ ጓዳ (Protected Admin)
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed mb-3">
                ይህ ክፍል ለድህረገፁ ባለቤትና ለቅዱስ ሲኖዶስ አስተዳዳሪዎች ብቻ የተከለለ ሲሆን በደህንነት ፒን ኮድ (PIN: 7777) የተቆለፈ ነው፡፡
              </p>
              <button
                onClick={() => {
                  setIsSideMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Shield className="w-3.5 h-3.5 text-stone-950" />
                <span>ወደ አስተዳዳሪ ዳሽቦርድ ግባ</span>
              </button>
            </div>

            {/* Donation & Tithes Drawer Action */}
            {onOpenDonation && (
              <div className="p-4 bg-stone-900/90 border border-amber-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-1.5 text-amber-300">
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  <span className="font-serif-sacred font-bold text-xs">
                    የበረከት ስጦታና አስራት (Giving & Charity)
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed mb-2.5">
                  ለገዳማት፣ ለንስሐ አባቶች፣ ለዜማ ተማሪዎችና ለረድኤት በቴሌብር፣ በሲቢኢ ወይም በካርድ ያበርክቱ።
                </p>
                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    onOpenDonation('monasteries');
                  }}
                  className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  ስጦታ አበርክት (Donate Now)
                </button>
              </div>
            )}

            {/* Navigation Section Links */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400/90 font-bold px-2 block mb-2">
                ዋና ዋና አገልግሎቶች
              </span>

              {[
                { id: 'hero', label: 'መነሻ ገጽ (Home)' },
                { id: 'live', label: strings.navLive },
                { id: 'conference', label: strings.navConference || 'የቀጥታ ቪዲዮ ኮንፈረንስ' },
                { id: 'dubbing', label: 'የቀጥታ ቋንቋ ተርጓሚ (Voice Dubbing)' },
                { id: 'confession', label: strings.navConfession },
                { id: 'hierarchy', label: strings.navHierarchy },
                { id: 'theology', label: strings.navTheology },
                { id: 'resources', label: 'የመረጃና ትምህርት ቋት (Media & Docs)' },
                { id: 'calendar', label: strings.navCalendar },
                { id: 'hymns', label: strings.navHymns },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    onNavigate(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                    activeSection === item.id 
                      ? 'bg-amber-500/15 text-amber-300 font-bold border-l-3 border-amber-400' 
                      : 'text-stone-200 hover:bg-stone-900 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Footer Status & Developer Credit */}
          <div className="pt-4 border-t border-stone-800 space-y-2.5 text-xs text-stone-300">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">የሲስተም ሁኔታ:</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online & Offline PWA Ready
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>WebRTC ቪዲዮ/ካሜራ:</span>
              <span className="text-amber-400 font-mono font-bold">Hardware Active</span>
            </div>
            
            {/* Developer Credit */}
            <div className="pt-3 border-t border-amber-900/40 text-center bg-stone-900/60 p-2.5 rounded-xl">
              <div className="text-xs font-serif-sacred font-bold text-amber-300">
                የተገነባው በዘበነ አስፍዬ / Zebene Asfye
              </div>
              <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                Lead Platform Architect & Engineer
              </div>
            </div>

            <div className="text-center text-[11px] text-stone-500">
              © {new Date().getFullYear()} Orthodox Universal Portal
            </div>
          </div>
        </aside>
      </div>
    )}
  </>
  );
};
