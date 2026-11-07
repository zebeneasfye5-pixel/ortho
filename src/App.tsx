import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveStreamSection } from './components/LiveStreamSection';
import { VideoConferenceHub } from './components/VideoConferenceHub';
import { LiveAudioDubbingStudio } from './components/LiveAudioDubbingStudio';
import { ConfessionPortal } from './components/ConfessionPortal';
import { HierarchySection } from './components/HierarchySection';
import { TheologyAcademy } from './components/TheologyAcademy';
import { MediaLibrarySection } from './components/MediaLibrarySection';
import { CalendarSynaxarium } from './components/CalendarSynaxarium';
import { HymnsPlayer } from './components/HymnsPlayer';
import { Footer } from './components/Footer';
import { VoiceTranslatorModal } from './components/VoiceTranslatorModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { MemberProfileModal } from './components/MemberProfileModal';
import { LanguageCode, MemberProfile } from './types';
import { Languages } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('am');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isTranslatorModalOpen, setIsTranslatorModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // User Membership Profile state with persistence
  const [userProfile, setUserProfile] = useState<MemberProfile>(() => {
    try {
      const saved = localStorage.getItem('orthodox_member_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'usr-1',
      fullName: 'ዘበነ አስፋው',
      baptismalName: 'ወልደ ጴጥሮስ',
      role: 'believer',
      diocese: 'አዲስ አበባ',
      parishName: 'መንበረ ጸባዖት ቅድስት ሥላሴ ካቴድራል',
      confessorFather: 'መልአከ መንክራት ቆሞስ አባ ገብረ ኪዳን',
      preferredLang: 'am',
      email: 'zebeneasfye5@gmail.com',
      phone: '+251 91 123 4567',
      spiritualBio: 'መዝሙር 22፡1 - "እግዚአብሔር እረኛዬ ነው የሚያሳጣኝም የለም።"',
      avatarUrl: '/src/assets/images/orthodox_believer_video_1794037021389.jpg',
      membershipId: 'EOTC-2026-8849-ET',
      registeredDate: 'ጥቅምት 2026'
    };
  });

  const handleSaveProfile = (newProfile: MemberProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem('orthodox_member_profile', JSON.stringify(newProfile));
    } catch {}
  };

  // Synchronize dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onSelectLang={(lang) => setCurrentLang(lang)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userProfile={userProfile}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection
          currentLang={currentLang}
          onNavigate={handleNavigate}
          onOpenTranslator={() => setIsTranslatorModalOpen(true)}
        />

        <LiveStreamSection
          currentLang={currentLang}
          onSelectLang={(lang) => setCurrentLang(lang)}
        />

        <VideoConferenceHub
          currentLang={currentLang}
          onSelectLang={(lang) => setCurrentLang(lang)}
        />

        <LiveAudioDubbingStudio
          currentLang={currentLang}
          onSelectLang={(lang) => setCurrentLang(lang)}
        />

        <ConfessionPortal />

        <HierarchySection />

        <TheologyAcademy />

        <MediaLibrarySection
          currentLang={currentLang}
        />

        <CalendarSynaxarium />

        <HymnsPlayer
          isGlobalPlaying={isAudioPlaying}
          onToggleGlobalPlay={() => setIsAudioPlaying(!isAudioPlaying)}
        />
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
        onOpenTranslator={() => setIsTranslatorModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Dedicated Floating Quick Action for Universal Voice Translator */}
      <button
        onClick={() => setIsTranslatorModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-full shadow-2xl border border-amber-300/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
        title="ቀጥታ ቋንቋ መተርጎሚያ ክፈት (Open Universal Voice Translator)"
      >
        <Languages className="w-4 h-4 text-stone-950" />
        <span className="hidden sm:inline">የቀጥታ ቋንቋ መተርጎሚያ</span>
      </button>

      {/* Universal Voice & Text Translator Modal */}
      <VoiceTranslatorModal
        isOpen={isTranslatorModalOpen}
        onClose={() => setIsTranslatorModalOpen(false)}
        initialSourceLang={currentLang}
      />

      {/* Protected Admin & Owner Dashboard Modal (Protected by PIN 7777) */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Member Registration & Digital ID Badge Modal */}
      <MemberProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
