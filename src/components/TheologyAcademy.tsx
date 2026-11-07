import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, Send, ScrollText, 
  HelpCircle, ChevronRight, Bookmark
} from 'lucide-react';
import { THEOLOGICAL_TOPICS } from '../data/orthodoxData';
import { SocialEngagementBar } from './SocialEngagementBar';

export const TheologyAcademy: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState(THEOLOGICAL_TOPICS[0]);
  const [userQuestion, setUserQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const sampleQuestions = [
    'የኦርቶዶክስ ተዋሕዶ እምነት መሠረቶች ምንድን ናቸው?',
    'ስለ ጌታችን ኢየሱስ ክርስቶስ ተዋሕዶ ባሕርይ ቅዱሳን አበው ምን አስተማሩ?',
    'የቅድስት ድንግል ማርያም አማላጅነት በመጽሐፍ ቅዱስ እንዴት ተገልጧል?',
    'ስለ 81ዱ ቅዱሳት መጻሕፍት ቀኖና አብራራልኝ'
  ];

  const handleAskTheology = async (questionText: string) => {
    if (!questionText.trim()) return;
    setIsAsking(true);
    setQaAnswer(null);

    try {
      const res = await fetch('/api/theological-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText })
      });
      if (res.ok) {
        const data = await res.json();
        setQaAnswer(data.answer);
      } else {
        setQaAnswer('ይቅርታ፣ ምላሹን ማግኘት አልተቻለም። እባክዎ ጥያቄዎን እንደገና ይሞክሩ።');
      }
    } catch (err) {
      console.error('Theology QA fetch error:', err);
      setQaAnswer('የኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን አስተምህሮ በቅዱሳት መጻሕፍት፣ በሐዋርያት ትውፊትና በሊቃውንት ትርጓሜ ላይ የጸና ነው። ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ አምላክ ወሰብእ (ፍጹም አምላክ ፍጹም ሰው) ሆኖ ተዋሕዷል።');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <section id="theology" className="py-16 bg-stone-900/60 text-stone-100 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Curatorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider mb-2">
              <ScrollText className="w-3.5 h-3.5" />
              <span>ትምህርተ ሃይማኖትና ሊቃውንት · ORTHODOX THEOLOGICAL ACADEMY</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-sacred font-bold text-amber-100">
              የነገረ መለኮትና የኦርቶዶክስ አስተምህሮ ጉባኤ
            </h2>
            <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
              ከጥንታውያን የብራና መጻሕፍትና ከቅዱሳን አበው ትውፊት የተቀዳ ንጹሕ የኦርቶዶክስ ተዋሕዶ የእምነት አስተምህሮ።
            </p>
          </div>
        </div>

        {/* Feature Grid: Ancient Manuscript Banner & Doctrine Deep-Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left: Ancient Manuscript Visual Presentation (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-amber-900/40 shadow-2xl relative group">
              <img
                src="/src/assets/images/orthodox_ancient_manuscript_1794000065693.jpg"
                alt="Ancient Ethiopian Ge'ez Manuscript"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                  የብራና ቅርስና የሊቃውንት ትርጓሜ
                </span>
                <h4 className="text-lg font-bold font-serif-sacred text-amber-100 mt-1">
                  81ዱ ቅዱሳት መጻሕፍትና የፍትሐ ነገሥት ቀኖና
                </h4>
              </div>
            </div>

            {/* List of 4 Core Pillars to select */}
            <div className="space-y-2">
              {THEOLOGICAL_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedTopic.id === topic.id
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                      : 'bg-stone-950/70 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-serif-sacred font-semibold text-xs sm:text-sm">
                      {topic.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Detailed Doctrine Study Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-stone-950/80 border border-amber-900/30 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between text-xs text-amber-400 mb-2 font-mono">
              <span>{selectedTopic.geezTitle}</span>
              <span>የቀኖና መዝገብ</span>
            </div>

            <h3 className="text-2xl font-serif-sacred font-bold text-amber-100">
              {selectedTopic.title}
            </h3>

            <div className="my-5 border-t border-b border-amber-900/20 py-4">
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans">
                {selectedTopic.summary}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-stone-900/80 rounded-xl border border-stone-800">
                <span className="text-amber-400 font-semibold block mb-1">
                  የቅዱሳት መጻሕፍት ምስክርነት (Scriptural Authority):
                </span>
                <span className="text-stone-300 font-serif-sacred text-sm">
                  {selectedTopic.scriptureRef}
                </span>
              </div>

              <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-900/40">
                <span className="text-amber-300 font-semibold block mb-1">
                  የቅዱሳን አበው ሊቃውንት ምስክርነት (Patristic Testimony):
                </span>
                <span className="text-amber-100/90 font-serif-sacred italic text-sm">
                  "{selectedTopic.patristicQuote}"
                </span>
              </div>
            </div>

            {/* Like, Share, and Commenting Bar */}
            <div className="mt-5 pt-4 border-t border-stone-800">
              <SocialEngagementBar
                itemId={selectedTopic.id}
                initialLikes={142}
                initialShares={58}
                initialComments={[
                  { id: 'tc-1', author: 'ዲ/ን ተስፋዬ', text: 'የተዋሕዶ ትምህርተ ሃይማኖት ጥልቀቱ እጅግ ድንቅ ነው!', time: 'ከ3 ሰዓት በፊት' },
                  { id: 'tc-2', author: 'እኅት ማርታ', text: 'ለሕይወታችን ታላቅ መንፈሳዊ ብርሃን የሚሰጥ ትምህርት ነው።', time: 'ከ1 ሰዓት በፊት' }
                ]}
                targetTitle={selectedTopic.title}
              />
            </div>
          </div>

        </div>

        {/* Patristic AI Question & Theological Inquiry Console */}
        <div className="p-6 sm:p-8 bg-stone-950 border border-amber-900/40 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif-sacred font-bold text-amber-200">
                የኦርቶዶክስ ነገረ መለኮት ሊቅ (Orthodox Theological Q&A)
              </h3>
              <p className="text-xs text-stone-400">
                በ81ዱ ቅዱሳት መጻሕፍት፣ በፍትሐ ነገሥት፣ በስንክሳርና በቅዱሳን አበው ትምህርት መሠረት በማንኛውም ቋንቋ ይጠይቁ።
              </p>
            </div>
          </div>

          {/* Quick Question Chips */}
          <div className="flex flex-wrap gap-2 my-4">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserQuestion(q);
                  handleAskTheology(q);
                }}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg text-xs text-stone-300 hover:text-amber-300 transition-colors cursor-pointer text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Question Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskTheology(userQuestion);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="ስለ ቤተክርስቲያኗ እምነት፣ ሥርዓት፣ ጾም ወይም ቅዱሳት መጻሕፍት የፈለጉትን ጥያቄ ይጠይቁ..."
              className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isAsking || !userQuestion.trim()}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>{isAsking ? 'በማስተዋል ላይ...' : 'ጠይቅ'}</span>
            </button>
          </form>

          {/* Answer Display */}
          {qaAnswer && (
            <div className="mt-6 p-6 bg-stone-900/80 border border-amber-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-2">
                <BookOpen className="w-4 h-4" />
                <span>የቅድስት ቤተክርስቲያን ሊቃውንት ምላሽ</span>
              </div>
              <div className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans whitespace-pre-line">
                {qaAnswer}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
