import React, { useState } from 'react';
import { 
  Upload, Film, FileText, Image as ImageIcon, Download, 
  Share2, Plus, Filter, CheckCircle2, Eye, Sparkles, BookOpen
} from 'lucide-react';
import { EducationalResource, LanguageCode } from '../types';
import { SocialEngagementBar } from './SocialEngagementBar';

interface MediaLibrarySectionProps {
  currentLang: LanguageCode;
}

export const MediaLibrarySection: React.FC<MediaLibrarySectionProps> = ({ currentLang }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'document' | 'photo'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Initial resources
  const [resources, setResources] = useState<EducationalResource[]>([
    {
      id: 'res-1',
      title: 'የቅዳሴ ሥርዓትና የካህናት አገልግሎት ማስተማሪያ (ክፍል 1)',
      description: 'ስለ ቅዱስ ቅዳሴ አፈጻጸም፣ ስለ ጽና አያያዝ፣ ስለ ማዕጠንትና ስለ ቃለ እግዚአብሔር አሰጣጥ የሚገልጽ ዝርዝር የቪዲዮ ማስተማሪያ።',
      type: 'video',
      fileUrl: '/src/assets/images/orthodox_liturgical_stream_1794000064768.jpg',
      fileSize: '45.2 MB',
      authorName: 'መልአከ መንክራት ቆሞስ አባ ገብረ ኪዳን',
      category: 'የቅዳሴ ትምህርት',
      uploadDate: 'ጥቅምት 26',
      likes: 124,
      shares: 32,
      comments: [
        { id: 'c-1', author: 'ቀሲስ ዮሐንስ', text: 'እጅግ ጠቃሚና የተሟላ ማስተማሪያ ነው።', time: 'ከ2 ሰዓት በፊት' }
      ]
    },
    {
      id: 'res-2',
      title: '81ዱ ቅዱሳት መጻሕፍትና የፍትሐ ነገሥት ጥናት (PDF Document)',
      description: 'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቀኖና መሠረት የተዘጋጀ የቅዱሳት መጻሕፍት ዝርዝርና የሊቃውንት ትርጓሜ ጥናት ሰነድ።',
      type: 'document',
      fileUrl: '#',
      fileSize: '12.8 MB (PDF)',
      authorName: 'የመንበረ ፓትርያርክ የሊቃውንት ጉባኤ',
      category: 'የቀኖና መጻሕፍት',
      uploadDate: 'ጥቅምት 24',
      likes: 89,
      shares: 41,
      comments: [
        { id: 'c-2', author: 'ዲያቆን በለጠ', text: 'ለሰንበት ት/ቤት ተማሪዎች የሚሆን ድንቅ ዶክመንት ነው።', time: 'ከ5 ሰዓት በፊት' }
      ]
    },
    {
      id: 'res-3',
      title: 'የጥንታዊ የላሊበላና የአክሱም ቅዱሳት ሥዕላት ስብስብ (High-Res Photos)',
      description: 'ከ12ኛው መቶ ክፍለ ዘመን ጀምሮ የተሳሉ የጥንታውያን አብያተ ክርስቲያናት ታሪካዊ የብርሃናት ሥዕላትና የመስቀል ቅርሶች ስብስብ።',
      type: 'photo',
      fileUrl: '/src/assets/images/orthodox_ancient_manuscript_1794000065693.jpg',
      fileSize: '8.4 MB (HD)',
      authorName: 'የቅዱሳት መካናት ቅርስ ጥበቃ',
      category: 'ታሪካዊ ቅርስ',
      uploadDate: 'ጥቅምት 22',
      likes: 215,
      shares: 68,
      comments: [
        { id: 'c-3', author: 'ሰሎሜ ተክለሃይማኖት', text: 'የጥበብና የእምነት ማሳያ የሆኑ ድንቅ ቅርሶች ናቸው።', time: 'ትላንት' }
      ]
    }
  ]);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadType, setUploadType] = useState<'video' | 'document' | 'photo'>('video');
  const [uploadCategory, setUploadCategory] = useState('የስብከት ማስተማሪያ');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filteredResources = activeFilter === 'all'
    ? resources
    : resources.filter(r => r.type === activeFilter);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadDesc.trim()) return;

    const newRes: EducationalResource = {
      id: `res-${Date.now()}`,
      title: uploadTitle.trim(),
      description: uploadDesc.trim(),
      type: uploadType,
      fileUrl: uploadType === 'video' 
        ? '/src/assets/images/orthodox_liturgical_stream_1794000064768.jpg'
        : uploadType === 'photo'
        ? '/src/assets/images/orthodox_ancient_manuscript_1794000065693.jpg'
        : '#',
      fileSize: selectedFileName ? '18.5 MB' : '10.2 MB',
      authorName: uploadAuthor.trim() || 'መምህር/አስተማሪ',
      category: uploadCategory,
      uploadDate: 'ዛሬ (Today)',
      likes: 1,
      shares: 0,
      comments: []
    };

    setResources([newRes, ...resources]);
    setUploadTitle('');
    setUploadDesc('');
    setUploadAuthor('');
    setSelectedFileName('');
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadModalOpen(false);
    }, 2000);
  };

  return (
    <section id="resources" className="py-16 bg-stone-950 text-stone-100 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>የማስተማሪያና የመረጃ ቋት · EDUCATIONAL MEDIA & RESOURCE REPOSITORY</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-sacred font-bold text-amber-100">
              የቪዲዮ፣ የዶክመንትና የፎቶ መረጃዎች ማስተላለፊያ
            </h2>
            <p className="mt-2 text-base text-stone-300 max-w-2xl font-medium leading-relaxed">
              ካህናትና መምህራን ለትምህርት የሚሆኑ ቪዲዮዎችን፣ የብራና መጻሕፍት ዶክመንቶችንና ፎቶዎችን በቀላሉ የሚጭኑበት እና በዓለም ዙሪያ ላሉ ምእመናን የሚያሰራጩበት ክፍል ።
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-stone-950 stroke-[3]" />
              <span>አዲስ መረጃ ጫን (Upload Resource)</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            ሁሉም መረጃዎች ({resources.length})
          </button>
          <button
            onClick={() => setActiveFilter('video')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'video'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>ቪዲዮዎች</span>
          </button>
          <button
            onClick={() => setActiveFilter('document')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'document'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ዶክመንቶችና መጻሕፍት (PDF)</span>
          </button>
          <button
            onClick={() => setActiveFilter('photo')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'photo'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>ሥዕላትና ፎቶዎች</span>
          </button>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-stone-900/90 border border-amber-900/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all hover:border-amber-500/50"
            >
              <div>
                {/* Media Preview Thumbnail */}
                <div className="relative aspect-video bg-black overflow-hidden group">
                  {res.type === 'video' || res.type === 'photo' ? (
                    <img
                      src={res.fileUrl}
                      alt={res.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-950 text-amber-400 p-6">
                      <FileText className="w-12 h-12 text-amber-500 mb-2" />
                      <span className="font-serif-sacred font-bold text-sm text-stone-200">የዶክመንት ሰነድ</span>
                      <span className="text-xs text-stone-400 font-mono mt-1">{res.fileSize}</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    {res.type === 'video' && <Film className="w-3.5 h-3.5" />}
                    {res.type === 'document' && <FileText className="w-3.5 h-3.5" />}
                    {res.type === 'photo' && <ImageIcon className="w-3.5 h-3.5" />}
                    <span>{res.category}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono text-stone-300">
                    {res.fileSize}
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <span className="font-bold text-amber-400 font-serif-sacred">{res.authorName}</span>
                    <span className="font-mono">{res.uploadDate}</span>
                  </div>

                  <h3 className="font-serif-sacred font-bold text-lg text-amber-100 leading-snug mb-2">
                    {res.title}
                  </h3>

                  <p className="text-sm text-stone-300 font-medium leading-relaxed line-clamp-3">
                    {res.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href={res.fileUrl}
                      download
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold rounded-xl border border-stone-700 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>አውርድ (Download)</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Engagement: Like, Comment, Share */}
              <div className="px-5 pb-4">
                <SocialEngagementBar
                  itemId={res.id}
                  initialLikes={res.likes}
                  initialComments={res.comments}
                  initialShares={res.shares}
                  titleForShare={res.title}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-stone-950 border border-amber-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif-sacred font-bold text-amber-100 text-lg">
                    አዲስ የማስተማሪያ መረጃ መጫኛ (Upload Resource)
                  </h3>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">የመረጃው ዓይነት (Resource Type)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setUploadType('video')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        uploadType === 'video'
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-900 text-stone-300 border-stone-800'
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      <span>ቪዲዮ (Video)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadType('document')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        uploadType === 'document'
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-900 text-stone-300 border-stone-800'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>ዶክመንት (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadType('photo')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        uploadType === 'photo'
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-900 text-stone-300 border-stone-800'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>ሥዕል / ፎቶ</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">ርዕስ (Title)</label>
                  <input
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="ለምሳሌ፡ የነገረ መለኮት ትምህርት በቪዲዮ..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">አዘጋጅ / አስተማሪ (Author/Speaker)</label>
                  <input
                    type="text"
                    value={uploadAuthor}
                    onChange={(e) => setUploadAuthor(e.target.value)}
                    placeholder="ለምሳሌ፡ መምህር ዘበነ አስፋው..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">ዝርዝር መግለጫ (Description)</label>
                  <textarea
                    rows={3}
                    required
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    placeholder="የቪዲዮው ወይም የዶክመንቱ ዋና መልእክት ምን እንደሆነ ይግለጹ..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                {/* File picker */}
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">ፋይል ይምረጡ (Choose File)</label>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-700 hover:border-amber-500 rounded-2xl bg-stone-900/50 cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-amber-400 mb-1" />
                    <span className="text-xs text-stone-300 font-medium">
                      {selectedFileName ? selectedFileName : 'ቪዲዮ፣ ፒዲኤፍ ወይም ፎቶ ለመጫን እዚህ ይንኩ'}
                    </span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept={uploadType === 'video' ? 'video/*' : uploadType === 'photo' ? 'image/*' : '.pdf,.docx,.doc'}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  መረጃውን አትም (Publish Resource)
                </button>
              </form>

              {uploadSuccess && (
                <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>መረጃው በተሳካ ሁኔታ ተጭኗል! በመድረኩ ላይ ለሁሉም ተደራሽ ሆኗል።</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
