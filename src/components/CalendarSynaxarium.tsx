import React, { useState } from 'react';
import { Calendar, Sun, Clock, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { TODAY_LITURGY } from '../data/orthodoxData';

export const CalendarSynaxarium: React.FC = () => {
  const [selectedFeast, setSelectedFeast] = useState<number | null>(null);

  const upcomingFeasts = [
    {
      name: 'የመድኃኔዓለም ዓመታዊ በዓል (Medhane Alem)',
      ethiopicDate: 'ጥቅምት ፳፯ (27)',
      status: 'ዛሬ (Today)',
      desc: 'የዓለም መድኃኒት ኢየሱስ ክርስቶስ በመስቀል ላይ የፈሰሰው ቅዱስ ደሙ መታሰቢያ።'
    },
    {
      name: 'ጾመ ነቢያት / የገና ጾም (Fast of the Prophets)',
      ethiopicDate: 'ኅዳር ፲፭ (15)',
      status: 'ከ18 ቀናት በኋላ',
      desc: 'ጌታችን ከመወለዱ በፊት ነቢያት የተነበዩትን ተስፋ በማሰብ የሚጾም የ43 ቀናት ጾም ።'
    },
    {
      name: 'በዓለ ልደት (Nativity / Genna)',
      ethiopicDate: 'ታኅሣሥ ፳፱ (29)',
      status: 'ታላቅ በዓል',
      desc: 'የጌታችን የመድኃኒታችን የኢየሱስ ክርስቶስ የልደት በዓል በታላቅ ምስጋና የሚከበርበት።'
    },
    {
      name: 'በዓለ ጥምቀት (Epiphany / Timkat)',
      ethiopicDate: 'ጥር ፲፩ (11)',
      status: 'የዩኔስኮ ቅርስ',
      desc: 'ጌታችን በዮርዳኖስ ባሕር በዮሐንስ እጅ የተጠመቀበትና ምስጢረ ሥላሴ የተገለጠበት ታላቅ በዓል።'
    }
  ];

  return (
    <section id="calendar" className="py-16 bg-stone-950 text-stone-100 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Curatorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>ባሕረ ሐሳብና ስንክሳር · ETHIOPIAN ORTHODOX CALENDAR & SYNAXARIUM</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-sacred font-bold text-amber-100">
              የዕለቱ ስንክሳርና የቤተክርስቲያን ዘመን ቀመር
            </h2>
            <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
              የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን የባሕረ ሐሳብ የዘመን አቆጣጠር፣ የዕለቱ ቅዱሳን ታሪክና የወንጌል ንባባት።
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Today's Synaxarium & Readings (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Today's Synaxarium Card */}
            <div className="p-6 sm:p-8 bg-stone-900/80 border border-amber-900/40 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-400" />
                  <span className="font-serif-sacred font-bold text-amber-300 text-sm sm:text-base">
                    የዕለቱ ስንክሳር ንባብ (Daily Synaxarium)
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                  {TODAY_LITURGY.dayName}
                </span>
              </div>

              <div className="my-5">
                <h3 className="text-xl sm:text-2xl font-serif-sacred font-bold text-amber-100 mb-2">
                  {TODAY_LITURGY.saintOfTheDay}
                </h3>
                <p className="text-sm text-stone-200 leading-relaxed font-sans">
                  {TODAY_LITURGY.synaxariumSummary}
                </p>
              </div>

              {/* Fasting & Liturgical Guidance */}
              <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl text-xs space-y-1">
                <span className="font-semibold text-amber-400 block">የዕለቱ ጾምና ሥርዓት:</span>
                <p className="text-stone-300">
                  {TODAY_LITURGY.fastingStatus}
                </p>
              </div>

              {/* Today's Scripture Readings */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800">
                  <span className="text-amber-400 font-semibold block mb-1">
                    📖 የዕለቱ ወንጌል ንባብ:
                  </span>
                  <span className="text-stone-300 font-serif-sacred">
                    {TODAY_LITURGY.gospelReading}
                  </span>
                </div>

                <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800">
                  <span className="text-amber-400 font-semibold block mb-1">
                    📜 የሐዋርያው ጳውሎስ መልእክት:
                  </span>
                  <span className="text-stone-300 font-serif-sacred">
                    {TODAY_LITURGY.epistleReading}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Upcoming Orthodox Feasts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-stone-900/80 border border-amber-900/40 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif-sacred font-bold text-amber-200 text-base">
                  የቀጣይ ታላላቅ አጽዋማትና በዓላት ቀን መቁጠሪያ
                </h3>
              </div>

              <div className="space-y-3">
                {upcomingFeasts.map((feast, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedFeast(idx === selectedFeast ? null : idx)}
                    className="p-4 bg-stone-950/70 border border-stone-800 hover:border-amber-500/40 rounded-xl cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-semibold font-serif-sacred text-amber-200">
                        {feast.name}
                      </h4>
                      <span className="text-[11px] font-mono text-amber-400">
                        {feast.ethiopicDate}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      {feast.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
