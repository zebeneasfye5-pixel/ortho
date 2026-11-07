import React, { useState } from 'react';
import { 
  Building2, Users, Send, CheckCircle2, 
  MapPin, Clock, Filter, AlertCircle
} from 'lucide-react';
import { HierarchyMember, UserRole } from '../types';
import { INITIAL_HIERARCHY } from '../data/orthodoxData';
import { SocialEngagementBar } from './SocialEngagementBar';

export const HierarchySection: React.FC = () => {
  const [members, setMembers] = useState<HierarchyMember[]>(INITIAL_HIERARCHY);
  const [selectedRole, setSelectedRole] = useState<'all' | UserRole>('all');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSender, setBroadcastSender] = useState('');
  const [broadcastRole, setBroadcastRole] = useState<UserRole>('priest');
  const [broadcastDiocese, setBroadcastDiocese] = useState('አዲስ አበባ');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const filteredMembers = selectedRole === 'all' 
    ? members 
    : members.filter(m => m.role === selectedRole);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim() || !broadcastSender.trim()) return;

    setIsPublishing(true);
    const newMember: HierarchyMember = {
      id: `h-${Date.now()}`,
      name: broadcastSender,
      title: broadcastRole === 'patriarch_synod' ? 'የቅዱስ ሲኖዶስ ጽ/ቤት' : broadcastRole === 'bishop' ? 'ሊቀ ጳጳስ' : broadcastRole === 'priest' ? 'ቀሲስ/ቆሞስ' : 'የምእመናን ተወካይ',
      diocese: broadcastDiocese,
      role: broadcastRole,
      officialStatement: broadcastMessage,
      timestamp: 'አሁን በሰከንዶች ውስጥ የተሰራጨ'
    };

    setTimeout(() => {
      setMembers([newMember, ...members]);
      setBroadcastMessage('');
      setBroadcastSender('');
      setIsPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 4000);
    }, 400);
  };

  return (
    <section id="hierarchy" className="py-16 bg-stone-950 text-stone-100 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>ሥርዓተ ክህነትና ዓለም አቀፍ ትስስር · HIERARCHICAL SYNODAL COMMUNION</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-sacred font-bold text-amber-100">
              ከፓትርያርክ እስከ ምእመን የደረጃ መግባቢያ
            </h2>
            <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
              ከቅዱስ ሲኖዶስ እና ከብፁዕ ወቅዱስ ፓትርያርክ እስከ አህጉረ ስብከት ሊቃነ ጳጳሳት፣ ካህናትና ምእመናን ድረስ በሰከንዶች ውስጥ ዓለም አቀፍ መረጃ የሚለዋወጡበት የተቀደሰ መረብ።
            </p>
          </div>

          {/* Role Filter Tabs (Zero-pill functional segmented buttons) */}
          <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedRole('all')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedRole === 'all'
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              ሁሉም (All)
            </button>
            <button
              onClick={() => setSelectedRole('patriarch_synod')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedRole === 'patriarch_synod'
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              ቅዱስ ሲኖዶስና ፓትርያርክ
            </button>
            <button
              onClick={() => setSelectedRole('bishop')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedRole === 'bishop'
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              ሊቃነ ጳጳሳት
            </button>
            <button
              onClick={() => setSelectedRole('priest')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedRole === 'priest'
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              ካህናትና መነኮሳት
            </button>
          </div>
        </div>

        {/* Global Instant Alert Banner with Live Synod Video CTA */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-amber-200">
              <span className="font-semibold text-amber-400">ዓለም አቀፍ የሰከንድ መረጃ ልውውጥ: </span>
              የቅዱስ ሲኖዶስ ውሳኔዎች፣ የአህጉረ ስብከት ቃለ ቡራኬዎች እና የደብራት ጥሪዎች ያለ ምንም መዘግየት በዓለም ዙሪያ ለሚገኙ 60 ሚሊዮን ምእመናን በቀጥታ ይደርሳሉ።
            </div>
          </div>

          <a
            href="#conference"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0 shadow whitespace-nowrap"
          >
            <span>የሲኖዶስ ቪዲዮ ጉባኤ ተቀላቀል 👑</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed: Communiques & Pastoral Decrees (70%) */}
          <div className="lg:col-span-8 space-y-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="p-6 bg-stone-900/80 border border-amber-900/30 rounded-2xl transition-all hover:border-amber-500/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif-sacred text-lg">
                      {member.role === 'patriarch_synod' ? '👑' : member.role === 'bishop' ? '✝' : '✞'}
                    </div>
                    <div>
                      <h4 className="font-serif-sacred font-bold text-amber-100 text-base">
                        {member.name}
                      </h4>
                      <p className="text-xs text-stone-400 flex items-center gap-2">
                        <span>{member.title}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 text-amber-400/80">
                          <MapPin className="w-3 h-3" />
                          {member.diocese}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {member.timestamp}
                  </span>
                </div>

                {/* Statement Body */}
                <div className="mt-4">
                  <p className="text-sm text-stone-200 leading-relaxed font-sans">
                    {member.officialStatement}
                  </p>
                </div>

                {/* Social Engagement: Like, Share, Comment */}
                <div className="mt-4 pt-3 border-t border-stone-850">
                  <SocialEngagementBar
                    itemId={member.id}
                    initialLikes={member.role === 'patriarch_synod' ? 385 : member.role === 'bishop' ? 194 : 87}
                    initialShares={member.role === 'patriarch_synod' ? 142 : 46}
                    initialComments={[
                      { id: `c-${member.id}-1`, author: 'ምእመን', text: 'አሜን! ቡራኬዎ ይደርብን።', time: 'ከ2 ሰዓት በፊት' }
                    ]}
                    targetTitle={`${member.title} - ${member.name}`}
                  />
                </div>

                {/* Bottom Verification Strip */}
                <div className="mt-3 pt-2.5 border-t border-stone-800/60 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1 text-amber-400/90 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    በቅዱስ ሲኖዶስ መዝገብ የተረጋገጠ መልእክት
                  </span>
                  <span className="text-[11px] font-mono">ክፍል: {member.diocese}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Instant Diocesan Announcement Dispatch (30%) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 p-6 bg-stone-900/80 border border-amber-900/30 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Send className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif-sacred font-bold text-amber-200 text-base">
                  ፈጣን የቤተክርስቲያን መረጃ ማሰራጫ
                </h3>
              </div>
              <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                በኃላፊነት ደረጃዎ መሠረት ዓለም አቀፍ መረጃ፣ ጥሪ ወይም ቃለ በረከት በሰከንድ ውስጥ ያስተላልፉ።
              </p>

              <form onSubmit={handleBroadcast} className="space-y-3.5">
                <div>
                  <label className="text-[11px] text-stone-300 block mb-1">የአስተላላፊው ስም / ተቋም</label>
                  <input
                    type="text"
                    value={broadcastSender}
                    onChange={(e) => setBroadcastSender(e.target.value)}
                    placeholder="ለምሳሌ፡ ሊቀ ጳጳስ አቡነ ጴጥሮስ..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-300 block mb-1">ደረጃ (Role)</label>
                    <select
                      value={broadcastRole}
                      onChange={(e) => setBroadcastRole(e.target.value as UserRole)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="patriarch_synod">ቅዱስ ሲኖዶስ / ፓትርያርክ</option>
                      <option value="bishop">ሊቀ ጳጳስ (Bishop)</option>
                      <option value="priest">ካህን / ቆሞስ (Priest)</option>
                      <option value="believer">ምእመን / ሰንበት ት/ቤት</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-300 block mb-1">ሀገረ ስብከት</label>
                    <select
                      value={broadcastDiocese}
                      onChange={(e) => setBroadcastDiocese(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="አዲስ አበባ">አዲስ አበባ (መንበረ ፓትርያርክ)</option>
                      <option value="ኢየሩሳሌም ዴር ሱልጣን">ኢየሩሳሌም ዴር ሱልጣን</option>
                      <option value="ሰሜን አሜሪካ">ሰሜን አሜሪካ ሀገረ ስብከት</option>
                      <option value="አውሮፓና ሮም">አውሮፓና ሮም</option>
                      <option value="ላሊበላና ጎንደር">ላሊበላና ጎንደር ገዳማት</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-stone-300 block mb-1">የመልእክቱ ይዘት</label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="በዓለም ዙሪያ ላሉ የቤተክርስቲያን ልጆች የሚተላለፍ መመሪያ ወይም መረጃ..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishing || !broadcastMessage.trim() || !broadcastSender.trim()}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow"
                >
                  {isPublishing ? 'በማሰራጨት ላይ...' : 'መረጃውን በሰከንድ ውስጥ አሰራጭ ✝'}
                </button>
              </form>

              {publishSuccess && (
                <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>መልእክቱ በመላው ዓለም ላሉ አህጉረ ስብከት በቅጽበት ተሰራጭቷል!</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
