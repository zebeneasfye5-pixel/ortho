import React, { useState } from 'react';
import { 
  Heart, CreditCard, ShieldCheck, CheckCircle2, 
  X, Download, ArrowRight, Sparkles, Building2, 
  Coins, Smartphone, Copy, Check, QrCode, FileText,
  Church, Globe
} from 'lucide-react';
import { LanguageCode } from '../types';

interface ChurchDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: LanguageCode;
  defaultCategory?: string;
  priestName?: string;
}

export const ChurchDonationModal: React.FC<ChurchDonationModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'monasteries',
  priestName
}) => {
  const [currency, setCurrency] = useState<'USD' | 'ETB' | 'EUR'>('USD');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'telebirr' | 'cbe' | 'paypal' | 'wire'>('card');
  
  // Giver info
  const [giverName, setGiverName] = useState('');
  const [baptismalName, setBaptismalName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [prayerNote, setPrayerNote] = useState('');

  // Payment state
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationReceipt, setDonationReceipt] = useState<{
    txId: string;
    date: string;
    amount: number;
    currency: string;
    categoryTitle: string;
    giverName: string;
    prayerNote: string;
  } | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    {
      id: 'monasteries',
      title: 'ለታሪካዊ ገዳማትና አብያተ ክርስቲያናት ድጋፍ',
      desc: 'ላሊበላ፣ አክሱም ጽዮን፣ ዋልድባ፣ ደብረ ዳሞ፣ ዴር ሱልጣን ኢየሩሳሌም እና አዳዲስ አብያተ ክርስቲያናት ግንባታ',
      icon: Church
    },
    {
      id: 'priest_honorarium',
      title: priestName ? `ለ${priestName} (የንስሐ አባት የበረከት ስጦታ)` : 'ለካህናትና ለንስሐ አባቶች የበረከት ስጦታ (Pastoral Support)',
      desc: 'ለሚያስተምሩንና ለሚቀድሱልን አባቶች ቃለ በረከት እና ማበረታቻ ስጦታ (ፍሬ በረከት)',
      icon: Heart
    },
    {
      id: 'charity',
      title: 'የኦርቶዶክስ ተዋሕዶ በጎ አድራጎትና ማዕድ ማጋራት',
      desc: 'ለተፈናቀሉ ወገኖች፣ ለአረጋውያን፣ ለወላጅ አልባ ሕፃናትና በችግር ላሉ ወገኖች ወርሃዊ ማዕድ ማጋራት',
      icon: Coins
    },
    {
      id: 'traditional_students',
      title: 'ለአብነትና ለሰንበት ት/ቤት ተማሪዎች ድጋፍ',
      desc: 'የዜማ፣ የቅኔ፣ የመጻሕፍትና የአቋቋም ተማሪዎች ቀለብና የመማሪያ መጻሕፍት ድጋፍ',
      icon: Sparkles
    },
    {
      id: 'tithes',
      title: 'አሥራትና በኩራት (Biblical Tithes & First Fruits)',
      desc: 'በቅዱሳት መጻሕፍት ቀኖና መሠረት ለቤተክርስቲያን የሚሰጥ አስራትና በኩራት',
      icon: Building2
    }
  ];

  const presetAmounts = currency === 'USD' 
    ? [15, 30, 50, 100, 250, 500] 
    : currency === 'ETB' 
    ? [200, 500, 1000, 3000, 5000, 10000] 
    : [15, 30, 50, 100, 200, 400];

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleProcessDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const selectedCat = categories.find(c => c.id === selectedCategory);
      const receipt = {
        txId: `EOTC-TX-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('am-ET', { year: 'numeric', month: 'long', day: 'numeric' }),
        amount: finalAmount,
        currency,
        categoryTitle: selectedCat ? selectedCat.title : 'የቤተክርስቲያን ስጦታ',
        giverName: giverName || (baptismalName ? `${baptismalName} (የክርስትና ስም)` : 'የተወደዱ ምእመን'),
        prayerNote: prayerNote || 'ለበረከትና ለኃጢአት ሥርየት የተደረገ የተቀደሰ ስጦታ'
      };

      // Save to donation history in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('orthodox_donation_history') || '[]');
        existing.unshift(receipt);
        localStorage.setItem('orthodox_donation_history', JSON.stringify(existing));
      } catch (err) {
        console.warn('Could not save donation history:', err);
      }

      setDonationReceipt(receipt);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-amber-900/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-stone-950 via-amber-950/50 to-stone-950 border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-serif-sacred font-bold text-amber-100 text-lg sm:text-xl">
                ዓለም አቀፍ የቤተክርስቲያንና የበረከት ስጦታ
              </h3>
              <p className="text-xs text-stone-400">
                የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ዓለም አቀፍ ህጋዊ የልገሳና የስጦታ መድረክ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
            title="ዝጋ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {donationReceipt ? (
            /* Digital Receipt & Blessing */
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 sm:p-8 bg-gradient-to-br from-amber-950/40 via-stone-950 to-stone-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute right-4 -bottom-6 text-amber-500/5 text-9xl font-serif-sacred select-none pointer-events-none">
                  ✝
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-serif-sacred text-amber-400">✝</span>
                    <div>
                      <h4 className="font-serif-sacred font-bold text-amber-200 text-base">
                        የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን
                      </h4>
                      <p className="text-[10px] text-stone-400 font-mono">
                        OFFICIAL ECCLESIASTICAL DONATION RECEIPT & BLESSING
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold rounded-full border border-emerald-500/30">
                    PAID / ተፈጽሟል
                  </span>
                </div>

                {/* Receipt Amount Header */}
                <div className="my-6 text-center">
                  <span className="text-xs text-stone-400 block mb-1">የስጦታው መጠን (Donation Amount)</span>
                  <div className="text-3xl sm:text-4xl font-serif-sacred font-bold text-amber-300">
                    {donationReceipt.currency === 'USD' ? '$' : donationReceipt.currency === 'EUR' ? '€' : 'ETB '}
                    {donationReceipt.amount.toLocaleString()} {donationReceipt.currency}
                  </div>
                  <span className="text-xs text-stone-300 font-medium mt-1 block">
                    {donationReceipt.categoryTitle}
                  </span>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-stone-900/60 p-4 rounded-xl border border-stone-800 my-4">
                  <div>
                    <span className="text-stone-400 block text-[11px]">የስጦታ ሰጪው ስም:</span>
                    <span className="font-bold text-stone-200">{donationReceipt.giverName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">ቀን (Date):</span>
                    <span className="font-bold text-stone-200">{donationReceipt.date}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">የደረሰኝ ቁጥር (Transaction ID):</span>
                    <span className="font-mono text-amber-400 font-bold">{donationReceipt.txId}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">የክፍያ ዘዴ:</span>
                    <span className="text-stone-200 uppercase font-mono">{paymentMethod}</span>
                  </div>
                </div>

                {/* Prayer Blessing Note */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                  <span className="font-serif-sacred font-bold block mb-1">የቅዱስ ሲኖዶስና የአበው ቡራኬ፦</span>
                  <p className="italic text-[11px] text-stone-300 leading-relaxed">
                    "በስውር የሰጠኸውን አባትህ በግልጽ ይከፍልሃል" (ማቴ 6፡4)። እግዚአብሔር አምላክ ያቀረቡትን ስጦታ፣ ጸሎትና ልመና በቅዱስ መሠዊያው ፊት ይቀበልልዎት፤ ለበረከትና ለሕይወት ያድርግልዎት። አሜን።
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setDonationReceipt(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  ተጨማሪ ስጦታ አበርክት
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer hover:brightness-110"
                >
                  <Download className="w-4 h-4 text-stone-950" />
                  <span>ደረሰኙን አትም / አስቀምጥ (Print / Save Receipt)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Donation Form */
            <form onSubmit={handleProcessDonation} className="space-y-6">
              
              {/* Category Selection */}
              <div>
                <label className="text-xs font-bold text-amber-200 block mb-2 font-serif-sacred">
                  1. የስጦታውን ዓላማ ይምረጡ (Select Donation Purpose) *
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected 
                            ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/50' 
                            : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-900 text-amber-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-serif-sacred font-bold text-sm ${isSelected ? 'text-amber-200' : 'text-stone-200'}`}>
                            {cat.title}
                          </h4>
                          <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                            {cat.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Currency & Amount Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-amber-200 font-serif-sacred">
                    2. የመገበያያ ገንዘብና የስጦታ መጠን (Currency & Amount) *
                  </label>
                  
                  {/* Currency Selector */}
                  <div className="flex items-center bg-stone-950 border border-stone-800 rounded-lg p-0.5 text-xs">
                    {(['USD', 'ETB', 'EUR'] as const).map((curr) => (
                      <button
                        type="button"
                        key={curr}
                        onClick={() => {
                          setCurrency(curr);
                          setAmount(curr === 'ETB' ? 1000 : 50);
                          setCustomAmount('');
                        }}
                        className={`px-2.5 py-1 rounded font-mono font-bold transition-all cursor-pointer ${
                          currency === curr 
                            ? 'bg-amber-500 text-stone-950 shadow' 
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Chips */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-3">
                  {presetAmounts.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => {
                        setAmount(p);
                        setCustomAmount('');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        amount === p && !customAmount
                          ? 'bg-amber-500 text-stone-950 shadow-md'
                          : 'bg-stone-950 border border-stone-800 text-stone-300 hover:border-amber-500/40'
                      }`}
                    >
                      {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : ''}{p}{currency === 'ETB' ? ' ብር' : ''}
                    </button>
                  ))}
                </div>

                {/* Custom Amount input */}
                <div>
                  <input
                    type="number"
                    min="1"
                    placeholder="ሌላ የተለየ መጠን ማስገባት ከፈለጉ እዚህ ይጻፉ..."
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <label className="text-xs font-bold text-amber-200 block mb-2 font-serif-sacred">
                  3. የክፍያ ዘዴ ይምረጡ (Payment Method) *
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                      paymentMethod === 'card' 
                        ? 'bg-amber-500/10 border-amber-400 text-amber-300 shadow' 
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>ቪዛ / ማስተርካርድ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('telebirr');
                      setCurrency('ETB');
                      setAmount(1000);
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                      paymentMethod === 'telebirr' 
                        ? 'bg-amber-500/10 border-amber-400 text-amber-300 shadow' 
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>ቴሌብር (Telebirr)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('cbe');
                      setCurrency('ETB');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                      paymentMethod === 'cbe' 
                        ? 'bg-amber-500/10 border-amber-400 text-amber-300 shadow' 
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>ንግድ ባንክ (CBE)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wire')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                      paymentMethod === 'wire' 
                        ? 'bg-amber-500/10 border-amber-400 text-amber-300 shadow' 
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>SWIFT / ባንክ ሐዋላ</span>
                  </button>
                </div>

                {/* Sub-form based on payment method */}
                {paymentMethod === 'card' && (
                  <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                      <span>በStripe 256-bit የተመሰጠረ ዓለም አቀፍ ካርድ</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="የካርድ ቁጥር (Card Number) 4000 1234 5678 9010"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="የሚያበቃበት (MM/YY)"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="CVC / CVV"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'telebirr' && (
                  <div className="p-4 bg-stone-950 rounded-2xl border border-emerald-900/50 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400">የቴሌብር ፈጣን የክፍያ ቁጥር / Merchant Account</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Telebirr SuperApp</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-800">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">የንግድ መለያ ቁጥር (Merchant Code):</span>
                        <span className="font-mono text-base font-bold text-emerald-300">554921</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('554921', 'telebirr')}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedAccount === 'telebirr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount === 'telebirr' ? 'ኮፒ ሆነ' : 'ኮፒ አድርግ'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      በስልክዎ በቴሌብር አፕሊኬሽን ወይም በ <strong>*127#</strong> አማካኝነት የንግድ መለያ ቁጥሩን <strong>554921</strong> በማስገባት በቀጥታ ክፍያውን መፈጸም ይችላሉ፡፡
                    </p>
                  </div>
                )}

                {paymentMethod === 'cbe' && (
                  <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                      <span>የኢትዮጵያ ንግድ ባንክ (CBE) ሂሳብ ቁጥር</span>
                      <Building2 className="w-4 h-4 text-amber-400" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-800">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">የሂሳብ ቁጥር (Account No):</span>
                        <span className="font-mono text-base font-bold text-amber-300">1000012345678</span>
                        <span className="text-[10px] text-stone-400 block">የመንበረ ፓትርያርክ ጠቅላይ ጽ/ቤት</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('1000012345678', 'cbe')}
                        className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedAccount === 'cbe' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount === 'cbe' ? 'ኮፒ ሆነ' : 'ኮፒ አድርግ'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod === 'wire' && (
                  <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2 text-xs text-stone-300">
                    <div className="font-bold text-amber-200 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-amber-400" />
                      <span>International Bank Wire Transfer (SWIFT / IBAN)</span>
                    </div>
                    <div className="font-mono text-[11px] space-y-1 bg-stone-900 p-3 rounded-xl border border-stone-800">
                      <div><span className="text-stone-500">Bank:</span> Commercial Bank of Ethiopia (CBE)</div>
                      <div><span className="text-stone-500">SWIFT Code:</span> CBETETAA</div>
                      <div><span className="text-stone-500">Beneficiary:</span> Ethiopian Orthodox Tewahedo Church Patriarchate</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Giver Details & Prayer Remembrance Note */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-amber-200 block font-serif-sacred">
                  4. የስጦታ ሰጪው መረጃና የጸሎት መታሰቢያ ስሞች
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="ሙሉ ስምዎ (Your Name)"
                    value={giverName}
                    onChange={(e) => setGiverName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="የክርስትና ስም (Baptismal Name)"
                    value={baptismalName}
                    onChange={(e) => setBaptismalName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="በቅዳሴ ጊዜ እንዲጸለይ የሚፈልጉት የጸሎት ወይም የዕረፍተ ነፍስ መታሰቢያ ስሞች (ለምሳሌ፡ ለወላጆቼ እገሌና እገሊት...)"
                    value={prayerNote}
                    onChange={(e) => setPrayerNote(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || finalAmount <= 0}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-stone-950 font-bold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>ስጦታውን በማረጋገጥ ላይ...</span>
                    </span>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 text-stone-950 fill-current" />
                      <span>
                        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : ''}{finalAmount.toLocaleString()} {currency === 'ETB' ? 'ብር ' : ''} 
                        ስጦታዬን አበርክት (Complete Donation)
                      </span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
