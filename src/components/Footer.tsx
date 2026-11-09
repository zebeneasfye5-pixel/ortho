import React from 'react';
import { MapPin, Globe, Mail, Phone, Lock, FileText } from 'lucide-react';
import { LanguageCode } from '../types';
import { UI_STRINGS } from '../data/orthodoxData';

interface FooterProps {
  currentLang: LanguageCode;
  onNavigate: (section: string) => void;
  onOpenTranslator: () => void;
  onOpenAdmin: () => void;
  onOpenDonation?: (category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigate,
  onOpenTranslator,
  onOpenAdmin,
  onOpenDonation
}) => {
  const strings = UI_STRINGS[currentLang] || UI_STRINGS.am;

  return (
    <footer className="bg-stone-950 text-stone-200 border-t border-amber-900/50 pt-16 pb-14">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Prominent Lead Architect & Developer Showcase Banner */}
        <div className="mb-14 p-6 bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/40 border-2 border-amber-500/40 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 text-2xl font-serif-sacred shadow-inner shrink-0">
              ✝
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Lead Software Architect & Engineer
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">● System Active</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif-sacred font-bold text-amber-100">
                የድህረገጽ ግንባታና ሶፍትዌር ኢንጂነሪንግ፦ <span className="text-amber-400">ዘበነ አስፍዬ (Zebene Asfye)</span>
              </h3>
              <p className="text-sm text-stone-300 mt-1 leading-relaxed">
                ይህ ዓለም አቀፍ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ሁለንተናዊ የዲጂታል መድረክ በዘበነ አስፍዬ / Zebene Asfye የተቀየሰና የተገነባ ነው።
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="mailto:zebeneasfye5@gmail.com"
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Mail className="w-4 h-4 text-stone-950" />
              <span>zebeneasfye5@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif-sacred font-bold text-amber-400">
              ✝ ኦርቶዶክስ ተዋሕዶ
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed font-sans">
              የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን እና የዓለም አቀፍ ኦርቶዶክሳውያን ሁለንተናዊ ዲጂታል መድረክ። ከፓትርያርክ እስከ ምእመን በሰከንዶች የሚገናኙበት ቅዱስ አገልግሎት።
            </p>
            <div className="text-sm text-amber-300 font-serif-sacred font-bold">
              "አሐቲ ቅድስት ቤተ ክርስቲያን"
            </div>
          </div>

          {/* Col 2: Services & Portals */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold font-serif-sacred text-amber-200">
              አገልግሎቶች
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('live')}
                  className="hover:text-amber-400 text-stone-300 transition-colors cursor-pointer"
                >
                  {strings.navLive}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('confession')}
                  className="hover:text-amber-400 text-stone-300 transition-colors cursor-pointer"
                >
                  {strings.navConfession}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hierarchy')}
                  className="hover:text-amber-400 text-stone-300 transition-colors cursor-pointer"
                >
                  {strings.navHierarchy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('theology')}
                  className="hover:text-amber-400 text-stone-300 transition-colors cursor-pointer"
                >
                  {strings.navTheology}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calendar')}
                  className="hover:text-amber-400 text-stone-300 transition-colors cursor-pointer"
                >
                  {strings.navCalendar}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hymns')}
                  className="hover:text-amber-400 text-stone-300 transition-colors cursor-pointer"
                >
                  {strings.navHymns}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-amber-400 text-stone-300 transition-colors cursor-pointer text-amber-200 font-medium"
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
              {onOpenDonation && (
                <li>
                  <button
                    onClick={() => onOpenDonation('monasteries')}
                    className="text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>የበረከት ስጦታና አስራት (Donations & Tithes)</span>
                  </button>
                </li>
              )}
              <li className="pt-2 border-t border-stone-800">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>የባለቤት አስተዳዳሪ ዳሽቦርድ (Admin PIN: 7777)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Holy Sites & Dioceses */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold font-serif-sacred text-amber-200">
              ታላላቅ ቅዱሳት መካናት
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>መንበረ ፓትርያርክ - አዲስ አበባ</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>ኢየሩሳሌም ዴር ሱልጣን ገዳም</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>አክሱም ጽዮን ማርያም</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>ደብረ ሮሃ ቅዱስ ላሊበላ</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>ደብረ ሊባኖስ ገዳም</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Synod Registry */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold font-serif-sacred text-amber-200">
              ግንኙነትና ምዝገባ
            </h4>
            <p className="text-sm text-stone-300 leading-relaxed">
              ለካህናትና ለደብራት የዲጂታል ምዝገባ፣ ለአህጉረ ስብከት ጽ/ቤቶችና ለምእመናን ጥያቄዎች:
            </p>
            <div className="space-y-2 text-sm text-stone-200 font-medium">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>contact@orthodox-universal.org</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>www.orthodox-universal.org</span>
              </div>
            </div>
          </div>

        </div>

        {/* Hairline Divider & Bottom Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <p>
            © {new Date().getFullYear()} የኦርቶዶክስ ተዋሕዶ ዓለም አቀፍ መድረክ (Orthodox Universal Portal)። የተገነባው በ <strong className="text-amber-300">ዘበነ አስፍዬ / Zebene Asfye</strong>።
          </p>
          <div className="flex items-center gap-4 text-stone-300 font-serif-sacred">
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
