import { Radio, HeartHandshake, BookOpen, Sparkles, ShieldCheck, Video, UserCheck } from 'lucide-react';
import { LanguageCode } from '../types';
import { UI_STRINGS, TODAY_LITURGY } from '../data/orthodoxData';
import { PWAInstallButton } from './PWAInstallButton';

interface HeroSectionProps {
  currentLang: LanguageCode;
  onNavigate: (section: string) => void;
  onOpenTranslator: () => void;
  onOpenProfile?: () => void;
  onOpenDonation?: (category?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onNavigate,
  onOpenTranslator,
  onOpenProfile,
  onOpenDonation
}) => {
  const strings = UI_STRINGS[currentLang] || UI_STRINGS.am;

  return (
    <section className="relative overflow-hidden bg-stone-950 text-stone-100 border-b border-amber-900/30">
      {/* Background Hero Banner with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/orthodox_cathedral_hero_1794000063230.jpg"
          alt="Majestic Orthodox Cathedral Divine Sanctuary"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/50" />
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Curatorial and Liturgical Header Strip */}
        <div className="flex flex-wrap items-center gap-3 text-sm tracking-wider text-amber-300/90 mb-6 font-medium">
          <span className="font-serif-sacred font-bold text-amber-400">✝ {TODAY_LITURGY.ethiopicDate}</span>
          <span aria-hidden="true" className="text-amber-600">·</span>
          <span>{TODAY_LITURGY.gregorianDate}</span>
          <span aria-hidden="true" className="text-amber-600">·</span>
          <span>{TODAY_LITURGY.fastingStatus}</span>
          <span aria-hidden="true" className="text-amber-600">·</span>
          <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/40 text-xs font-mono font-bold">
            የተገነባው በዘበነ አስፍዬ / Zebene Asfye
          </span>
        </div>

        {/* Main Hero Title */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-sacred font-bold text-amber-100 leading-tight tracking-wide drop-shadow-sm">
            ኦርቶዶክስ <span className="text-amber-400">ተዋሕዶ</span> ዓለም አቀፍ መድረክ
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-stone-200 font-normal leading-relaxed max-w-3xl">
            ከቅዱስ ፓትርያርክ እና ቅዱስ ሲኖዶስ እስከ ካህናትና ምእመናን ድረስ በዓለም ዙሪያ የሚገናኙበት፣ የቀጥታ ቅዳሴ በፈጣን ቋንቋ ተርጓሚ የሚተላለፍበት፣ ካህናት ለንስሐ ልጆቻቸው በሚስጥር ንስሐና ትምህርት የሚሰጡበት ሁለንተናዊ የዲጂታል ቅድስት መድረክ።
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('live')}
              className="flex items-center gap-3 px-6 py-3.5 text-sm font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 rounded-xl shadow-lg shadow-amber-950/40 transition-all cursor-pointer whitespace-nowrap"
            >
              <Radio className="w-4 h-4 text-stone-950" />
              <span>{strings.joinLive}</span>
            </button>

            <button
              onClick={() => onNavigate('conference')}
              className="flex items-center gap-3 px-6 py-3.5 text-sm font-semibold text-amber-200 bg-stone-900/90 hover:bg-stone-800/90 border border-amber-500/40 rounded-xl shadow-lg shadow-amber-950/40 transition-all cursor-pointer whitespace-nowrap"
            >
              <Video className="w-4 h-4 text-amber-400" />
              <span>የቀጥታ ቪዲዮ ኮንፈረንስ (Live Video Hub)</span>
            </button>

            <button
              onClick={() => onNavigate('confession')}
              className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium text-amber-200 bg-stone-900/90 hover:bg-stone-800/90 border border-amber-500/30 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span>{strings.spiritualFatherPortal}</span>
            </button>

            <button
              onClick={onOpenTranslator}
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-stone-300 hover:text-white bg-stone-950/70 hover:bg-stone-900/70 border border-stone-800 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ፈጣን የቀጥታ ቋንቋ ተርጓሚ (Live Voice & Text)</span>
            </button>

            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/50 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>የምእመንነት ምዝገባና ዲጂታል መታወቂያ</span>
              </button>
            )}

            {onOpenDonation && (
              <button
                onClick={() => onOpenDonation('monasteries')}
                className="flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-amber-500/25 active:scale-95"
              >
                <HeartHandshake className="w-4 h-4 text-stone-950" />
                <span>የበረከት ስጦታና አስራት (Donations & Tithes)</span>
              </button>
            )}

            {/* In-App PWA Install Action */}
            <PWAInstallButton variant="hero" />
          </div>
        </div>

        {/* 4 Pillars Operational Strip */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('live')}
            className="p-6 bg-stone-900/80 hover:bg-stone-900 border border-amber-900/40 rounded-2xl cursor-pointer transition-all hover:border-amber-500/50 group"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl group-hover:bg-amber-500/20">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-serif-sacred font-bold text-amber-200 text-lg">የቀጥታ ቅዳሴና ሰርጭት</h3>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              በሰከንዶች ውስጥ ቋንቋ የሚተረጉም አውቶማቲክ ንግግር መተርጎሚያ የተገጠመለት የቀጥታ ሥርጭት።
            </p>
          </div>

          <div 
            onClick={() => onNavigate('confession')}
            className="p-6 bg-stone-900/80 hover:bg-stone-900 border border-amber-900/40 rounded-2xl cursor-pointer transition-all hover:border-amber-500/50 group"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl group-hover:bg-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-sacred font-bold text-amber-200 text-lg">ሚስጥረ ንስሐና ቀኖና</h3>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              ካህናት ለንስሐ ልጆቻቸው ትምህርት የሚሰጡበት፣ በሚስጥር ኑዛዜና ቀኖና የሚቀበሉበት የተቀደሰ ክፍል ።
            </p>
          </div>

          <div 
            onClick={() => onNavigate('hierarchy')}
            className="p-6 bg-stone-900/80 hover:bg-stone-900 border border-amber-900/40 rounded-2xl cursor-pointer transition-all hover:border-amber-500/50 group"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl group-hover:bg-amber-500/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif-sacred font-bold text-amber-200 text-lg">ከሲኖዶስ እስከ ምእመን</h3>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              ከፓትርያርክና ሊቃነ ጳጳሳት እስከ ካህናትና ምእመናን በቅጽበት መልእክትና መመሪያ የሚለዋወጡበት ዓለም አቀፍ ትስስር።
            </p>
          </div>

          <div 
            onClick={() => onNavigate('theology')}
            className="p-6 bg-stone-900/80 hover:bg-stone-900 border border-amber-900/40 rounded-2xl cursor-pointer transition-all hover:border-amber-500/50 group"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl group-hover:bg-amber-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-serif-sacred font-bold text-amber-200 text-lg">የሃይማኖት ትምህርት ጉባኤ</h3>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              የነገረ መለኮት፣ የቅዱሳት መጻሕፍትና የአበው ትምህርት በኦርቶዶክስ ሊቃውንት አስተምህሮ የሚሰጥበት ክፍል ።
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
