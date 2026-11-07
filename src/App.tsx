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
import { LanguageCode } from './types';
import { Languages } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('am');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isTranslatorModalOpen, setIsTranslatorModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

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
    </div>
  );
}
