import React from 'react';
import { MapPin, Globe, Mail, Phone, Lock, FileText } from 'lucide-react';
import { LanguageCode } from '../types';
import { UI_STRINGS } from '../data/orthodoxData';

interface FooterProps {
  currentLang: LanguageCode;
  onNavigate: (section: string) => void;
  onOpenTranslator: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigate,
  onOpenTranslator,
  onOpenAdmin
}) => {
  const strings = UI_STRINGS[currentLang] || UI_STRINGS.am;

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-amber-900/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif-sacred font-bold text-amber-400">
              ✝ ኦርቶዶክስ ተዋሕዶ
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን እና የዓለም አቀፍ ኦርቶዶክሳውያን ሁለንተናዊ ዲጂታል መድረክ። ከፓትርያርክ እስከ ምእመን በሰከንዶች የሚገናኙበት ቅዱስ አገልግሎት።
            </p>
            <div className="text-xs text-amber-300/80 font-mono">
              "አሐቲ ቅድስት ቤተ ክርስቲያን"
            </div>
          </div>

          {/* Col 2: Services & Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold font-serif-sacred text-amber-200">
              አገልግሎቶች
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('live')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {strings.navLive}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('confession')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {strings.navConfession}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hierarchy')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {strings.navHierarchy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('theology')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {strings.navTheology}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calendar')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {strings.navCalendar}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hymns')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {strings.navHymns}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-amber-200/90 font-medium"
                >
                  የመረጃና ትምህርት ቋት (ቪዲዮ/ሰነድ/ፎቶ)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTranslator}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  {strings.navTranslator}
                </button>
              </li>
              <li className="pt-2 border-t border-stone-800">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>የባለቤት አስተዳዳሪ ዳሽቦርድ (Admin PIN: 7777)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Holy Sites & Dioceses */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold font-serif-sacred text-amber-200">
              ታላላቅ ቅዱሳት መካናት
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>መንበረ ፓትርያርክ - አዲስ አበባ</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>ኢየሩሳሌም ዴር ሱልጣን ገዳም</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>አክሱም ጽዮን ማርያም</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>ደብረ ሮሃ ቅዱስ ላሊበላ</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>ደብረ ሊባኖስ ገዳም</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Synod Registry */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold font-serif-sacred text-amber-200">
              ግንኙነትና ምዝገባ
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              ለካህናትና ለደብራት የዲጂታል ምዝገባ፣ ለአህጉረ ስብከት ጽ/ቤቶችና ለምእመናን ጥያቄዎች:
            </p>
            <div className="space-y-1.5 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>contact@orthodox-universal.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>www.orthodox-universal.org</span>
              </div>
            </div>
          </div>

        </div>

        {/* Hairline Divider & Bottom Copyright */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} የኦርቶዶክስ ተዋሕዶ ዓለም አቀፍ መድረክ (Orthodox Universal Portal)። መብቱ በሕግ የተጠበቀ ነው።
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>ፍትሐ ነገሥት</span>
            <span aria-hidden="true">·</span>
            <span>ዲድስቅልያ</span>
            <span aria-hidden="true">·</span>
            <span>ስንክሳር</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
