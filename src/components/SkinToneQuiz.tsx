import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Eye } from 'lucide-react';
import { Product, SkinToneQuizAnswer, SkinToneResult } from '../types';

interface SkinToneQuizProps {
  products: Product[];
  onAddCompare: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewProductDetail: (product: Product) => void;
}

export default function SkinToneQuiz({
  products,
  onAddCompare,
  onAddToCart,
  onViewProductDetail
}: SkinToneQuizProps) {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Partial<SkinToneQuizAnswer>>({});
  const [result, setResult] = useState<SkinToneResult | null>(null);

  const veinOptions = [
    { id: 'blue_purple', label: 'Biru / Ungu', desc: 'Menunjukkan pembuluh darah yang cenderung memiliki rona dingin (Cool Undertone)', color: 'bg-indigo-600' },
    { id: 'green', label: 'Hijau', desc: 'Menunjukkan pembuluh darah yang memiliki rona hangat kekuningan (Warm Undertone)', color: 'bg-emerald-600' },
    { id: 'mixed', label: 'Campuran / Sulit Didefinisikan', desc: 'Menunjukkan pembuluh darah dengan rona netral seimbang (Neutral Undertone)', color: 'bg-teal-600' }
  ];

  const sunOptions = [
    { id: 'burns', label: 'Mudah Terbakar', desc: 'Kulit memerah, perih, dan jarang menggelap setelah terpapar sinar matahari.' },
    { id: 'tan_then_burn', label: 'Menggelap Dulu Baru Terbakar', desc: 'Kulit sedikit menggelap sebelum akhirnya memerah jika terpapar terlalu lama.' },
    { id: 'tan_fast', label: 'Cepat Menggelap', desc: 'Kulit sangat mudah bertambah gelap atau kecokelatan tanpa rasa terbakar yang parah.' }
  ];

  const jewelryOptions = [
    { id: 'silver', label: 'Silver (Perak)', desc: 'Perhiasan perak/emas putih membuat kulit Anda terlihat lebih bersinar dan hidup.' },
    { id: 'gold', label: 'Gold (Emas)', desc: 'Perhiasan emas kuning membuat rona kulit Anda memancarkan kehangatan sehat.' },
    { id: 'both', label: 'Keduanya Cocok', desc: 'Baik perhiasan emas maupun perak terlihat sama bagusnya pada kulit Anda.' }
  ];

  const skinToneOptions = [
    { id: 'fair', label: 'Fair', desc: 'Sangat putih atau porselen', preview: 'bg-[#FFF5EB]' },
    { id: 'light', label: 'Light', desc: 'Putih gading atau kuning langsat muda', preview: 'bg-[#FFE5CC]' },
    { id: 'light_medium', label: 'Light Medium', desc: 'Kuning langsat sedang', preview: 'bg-[#F2D1B3]' },
    { id: 'medium', label: 'Medium', desc: 'Sawo matang muda atau kuning langsat hangat', preview: 'bg-[#E3BE9A]' },
    { id: 'tan', label: 'Tan', desc: 'Sawo matang gelap', preview: 'bg-[#C29770]' },
    { id: 'deep', label: 'Deep', desc: 'Cokelat gelap atau eksotis', preview: 'bg-[#8C603E]' }
  ];

  const handleSelect = (key: keyof SkinToneQuizAnswer, value: any) => {
    const updatedAnswers = { ...answers, [key]: value };
    setAnswers(updatedAnswers);
    
    // Auto proceed with small delay
    setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        calculateResult(updatedAnswers as SkinToneQuizAnswer);
      }
    }, 250);
  };

  const calculateResult = (finalAnswers: SkinToneQuizAnswer) => {
    // 1. Calculate undertone
    let coolScore = 0;
    let warmScore = 0;
    let neutralScore = 0;

    // Vein Color weight
    if (finalAnswers.veinColor === 'blue_purple') coolScore += 2.5;
    else if (finalAnswers.veinColor === 'green') warmScore += 2.5;
    else neutralScore += 2.5;

    // Sun exposure weight
    if (finalAnswers.sunReaction === 'burns') coolScore += 1.5;
    else if (finalAnswers.sunReaction === 'tan_then_burn') neutralScore += 1.5;
    else warmScore += 1.5;

    // Jewelry weight
    if (finalAnswers.jewelryMatch === 'silver') coolScore += 1.5;
    else if (finalAnswers.jewelryMatch === 'gold') warmScore += 1.5;
    else neutralScore += 1.5;

    let finalUndertone: 'Cool' | 'Warm' | 'Neutral' = 'Neutral';
    if (coolScore > warmScore && coolScore > neutralScore) {
      finalUndertone = 'Cool';
    } else if (warmScore > coolScore && warmScore > neutralScore) {
      finalUndertone = 'Warm';
    }

    // 2. Format skin tone label
    const skinToneMap: Record<string, string> = {
      fair: 'Fair',
      light: 'Light',
      light_medium: 'Light Medium',
      medium: 'Medium',
      tan: 'Tan',
      deep: 'Deep'
    };

    const finalSkinTone = skinToneMap[finalAnswers.currentSkinTone] || 'Medium';

    // 3. Recommended shades mapping
    let resultData: SkinToneResult = {
      undertone: finalUndertone,
      skinTone: finalSkinTone,
      foundation: [],
      blush: [],
      lipstick: [],
      concealer: [],
      eyeshadow: []
    };

    if (finalSkinTone === 'Fair') {
      if (finalUndertone === 'Cool') {
        resultData.foundation = ['Fair Alabaster', 'Porcelain Cool'];
        resultData.concealer = ['Fair Ivory', 'Light Lilac'];
        resultData.blush = ['Soft Pink', 'Baby Rose'];
        resultData.lipstick = ['Dusty Pink', 'Cherry Rose', 'Cool Nude'];
        resultData.eyeshadow = ['Mauve Rose', 'Silver Lilac'];
      } else if (finalUndertone === 'Warm') {
        resultData.foundation = ['Warm Porcelain', 'Ivory Gold'];
        resultData.concealer = ['Pale Gold', 'Light Sand'];
        resultData.blush = ['Peach Blush', 'Soft Apricot'];
        resultData.lipstick = ['Coral Nude', 'Warm Peach', 'Salmon Pink'];
        resultData.eyeshadow = ['Champagne Gold', 'Warm Bronze'];
      } else {
        resultData.foundation = ['Neutral Ivory', 'Fair Neutral'];
        resultData.concealer = ['Light Neutral'];
        resultData.blush = ['Rosewood', 'Neutral Pink'];
        resultData.lipstick = ['Soft Mauve', 'Honey Nude', 'Rosewood'];
        resultData.eyeshadow = ['Taupe Gray', 'Soft Brown'];
      }
    } else if (finalSkinTone === 'Light') {
      if (finalUndertone === 'Cool') {
        resultData.foundation = ['Cool Vanilla', 'Light Rose'];
        resultData.concealer = ['Fair Rose'];
        resultData.blush = ['Baby Pink', 'Petal Rose'];
        resultData.lipstick = ['Berry Pink', 'Rose Matte', 'Nude Mauve'];
        resultData.eyeshadow = ['Plum Pink', 'Pearl Shimmer'];
      } else if (finalUndertone === 'Warm') {
        resultData.foundation = ['Warm Vanilla', 'Sand Gold'];
        resultData.concealer = ['Warm Sand'];
        resultData.blush = ['Coral Glow', 'Honey Peach'];
        resultData.lipstick = ['Peach Nude', 'Brick Peach', 'Terracotta Orange'];
        resultData.eyeshadow = ['Warm Copper', 'Golden Honey'];
      } else {
        resultData.foundation = ['Neutral Sand', 'Ivory Beige'];
        resultData.concealer = ['Neutral Light'];
        resultData.blush = ['Nude Pink', 'Apricot Rose'];
        resultData.lipstick = ['Warm Mauve', 'Toast Nude', 'Rosy Wood'];
        resultData.eyeshadow = ['Cashmere Beige', 'Soft Taupe'];
      }
    } else if (finalSkinTone === 'Light Medium') {
      if (finalUndertone === 'Cool') {
        resultData.foundation = ['Cool Sand', 'Linen Cool'];
        resultData.concealer = ['Linen Light'];
        resultData.blush = ['Soft Violet', 'Cool Peach'];
        resultData.lipstick = ['Rose Pink', 'Orchid Rose', 'Medium Pink'];
        resultData.eyeshadow = ['Silver Lilac', 'Slate Gray'];
      } else if (finalUndertone === 'Warm') {
        resultData.foundation = ['Warm Sand', 'Golden Ivory'];
        resultData.concealer = ['Golden Ochre'];
        resultData.blush = ['Ginger Blush', 'Tangerine'];
        resultData.lipstick = ['Cinnamon Nude', 'Pumpkin Spice', 'Coral Orange'];
        resultData.eyeshadow = ['Bronze Shimmer', 'Olive Brown'];
      } else {
        resultData.foundation = ['Neutral Sand', 'Buff Beige'];
        resultData.concealer = ['Medium Neutral'];
        resultData.blush = ['Warm Pink', 'Soft Rosewood'];
        resultData.lipstick = ['Dusty Rose', 'Chai Latte', 'Velvet Plum'];
        resultData.eyeshadow = ['Cocoa Cream', 'Satin Beige'];
      }
    } else if (finalSkinTone === 'Medium') {
      if (finalUndertone === 'Cool') {
        resultData.foundation = ['Natural Beige', 'Cool Honey'];
        resultData.concealer = ['Medium Rose'];
        resultData.blush = ['Mauve Rose', 'Plum Pink'];
        resultData.lipstick = ['Berry Red', 'Nude Mauve', 'Cool Cocoa'];
        resultData.eyeshadow = ['Aubergine Purple', 'Champagne Pearl'];
      } else if (finalUndertone === 'Warm') {
        // EXACT match to prompt request!
        resultData.foundation = ['Warm Beige', 'Golden Beige'];
        resultData.concealer = ['Medium Honey', 'Ochre Gold'];
        resultData.blush = ['Peach', 'Coral'];
        resultData.lipstick = ['Terracotta', 'Nude Peach', 'Brick Red'];
        resultData.eyeshadow = ['Gold Bronze', 'Terracotta Brown'];
      } else {
        resultData.foundation = ['Neutral Beige', 'Sand Beige'];
        resultData.concealer = ['Beige Neutral'];
        resultData.blush = ['Dusty Peach', 'Sweet Rose'];
        resultData.lipstick = ['Spice Nude', 'Warm Plum', 'Mocha Brown'];
        resultData.eyeshadow = ['Chestnut Brown', 'Soft Ivory'];
      }
    } else if (finalSkinTone === 'Tan') {
      if (finalUndertone === 'Cool') {
        resultData.foundation = ['Cool Amber', 'Honey Tan'];
        resultData.concealer = ['Tan Rose'];
        resultData.blush = ['Spiced Plum', 'Deep Berry'];
        resultData.lipstick = ['Deep Plum', 'Muted Crimson', 'Wine Berry'];
        resultData.eyeshadow = ['Metallic Charcoal', 'Cold Bronze'];
      } else if (finalUndertone === 'Warm') {
        resultData.foundation = ['Warm Amber', 'Golden Honey', 'Tan Honey'];
        resultData.concealer = ['Warm Amber'];
        resultData.blush = ['Spiced Tangerine', 'Sun-Kissed Bronze'];
        resultData.lipstick = ['Burnt Sienna', 'Caramel Nude', 'Warm Chili'];
        resultData.eyeshadow = ['Gilded Gold', 'Earthy Ochre'];
      } else {
        resultData.foundation = ['Neutral Tan', 'Pecan Neutral'];
        resultData.concealer = ['Tan Neutral'];
        resultData.blush = ['Warm Terracotta', 'Burnt Mauve'];
        resultData.lipstick = ['Chocolate Nude', 'Spiced Plum', 'Mulberry'];
        resultData.eyeshadow = ['Mocha Suede', 'Antique Gold'];
      }
    } else { // Deep
      if (finalUndertone === 'Cool') {
        resultData.foundation = ['Cool Cocoa', 'Deep Espresso'];
        resultData.concealer = ['Espresso Rose'];
        resultData.blush = ['Deep Fuchsia', 'Boysenberry'];
        resultData.lipstick = ['Dark Blackberry', 'Violet Grape', 'Deep Crimson'];
        resultData.eyeshadow = ['Midnight Violet', 'Chrome Silver'];
      } else if (finalUndertone === 'Warm') {
        resultData.foundation = ['Deep Amber', 'Warm Chestnut'];
        resultData.concealer = ['Deep Honey'];
        resultData.blush = ['Burnt Orange', 'Golden Terracotta'];
        resultData.lipstick = ['Deep Walnut', 'Spiced Mahogany', 'Redwood'];
        resultData.eyeshadow = ['Metallic Bronze', 'Antique Copper'];
      } else {
        resultData.foundation = ['Espresso Neutral', 'Ebony Neutral'];
        resultData.concealer = ['Deep Neutral'];
        resultData.blush = ['Deep Chestnut', 'Muted Plum'];
        resultData.lipstick = ['Dark Espresso Nude', 'Rich Plum', 'Vampy Wine'];
        resultData.eyeshadow = ['Smoky Gray', 'Warm Espresso'];
      }
    }

    setResult(resultData);
    setStep(4);
  };

  const handleRestart = () => {
    setAnswers({});
    setResult(null);
    setStep(0);
  };

  // Filter products in catalog that correspond to Makeup and shade recommendation
  const getMatchingMakeupProducts = () => {
    if (!result) return [];
    return products.filter(p => p.category === 'makeup');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 font-sans">
      {/* Editorial Header */}
      <div className="text-center mb-12">
        <span className="text-[10px] tracking-[0.3em] text-neutral-400 font-bold uppercase block mb-2">INTELLIGENT BEAUTY SYSTEM</span>
        <h2 className="text-3xl md:text-4.5xl tracking-tight font-serif text-black font-semibold mb-4">
          FIND YOUR SKIN TONE
        </h2>
        <p className="text-xs md:text-sm text-neutral-500 max-w-xl mx-auto uppercase tracking-wider leading-relaxed">
          Temukan warna kulit alami, undertone sejati, dan rekomendasi warna makeup eksklusif yang dirancang khusus untuk meningkatkan pesona natural Anda.
        </p>
      </div>

      <div className="bg-neutral-50 border border-neutral-200 p-6 md:p-12 shadow-sm rounded-none relative overflow-hidden">
        {/* Progress bar */}
        {step < 4 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-200">
            <div 
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0: VEIN COLOR */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <span className="text-xs tracking-widest text-neutral-400 uppercase font-semibold">LANGKAH 1 DARI 4</span>
                <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-neutral-900 mt-2">
                  Bagaimana warna pembuluh darah di pergelangan tangan Anda?
                </h3>
                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Cek di bawah cahaya alami matahari langsung untuk melihat ronanya.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {veinOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('veinColor', opt.id)}
                    className="p-6 bg-white border border-neutral-200 text-left hover:border-black transition-all duration-200 cursor-pointer flex flex-col justify-between h-40 group"
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className={`w-6 h-6 rounded-full ${opt.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                      <div className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center group-hover:border-black transition-colors">
                        <ArrowRight size={10} className="text-transparent group-hover:text-black transition-colors" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">{opt.label}</h4>
                      <p className="text-[10px] text-neutral-400 mt-1 uppercase leading-normal tracking-wide">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1: SUN EXPOSURE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <span className="text-xs tracking-widest text-neutral-400 uppercase font-semibold">LANGKAH 2 DARI 4</span>
                <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-neutral-900 mt-2">
                  Apa reaksi kulit Anda saat terpapar sinar matahari?
                </h3>
                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Reaksi ini membantu menentukan sensitivitas melanin dan undertone terdalam kulit Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {sunOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('sunReaction', opt.id)}
                    className="p-6 bg-white border border-neutral-200 text-left hover:border-black transition-all duration-200 cursor-pointer flex flex-col justify-between h-44 group"
                  >
                    <div className="flex justify-end w-full">
                      <div className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center group-hover:border-black transition-colors">
                        <ArrowRight size={10} className="text-transparent group-hover:text-black transition-colors" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">{opt.label}</h4>
                      <p className="text-[10px] text-neutral-400 mt-1 uppercase leading-normal tracking-wide">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: JEWELRY MATCH */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <span className="text-xs tracking-widest text-neutral-400 uppercase font-semibold">LANGKAH 3 DARI 4</span>
                <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-neutral-900 mt-2">
                  Perhiasan logam apa yang membuat kulit Anda terlihat berseri?
                </h3>
                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Emas murni melambangkan Warm, sedangkan Perak memancarkan kecantikan Cool.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {jewelryOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('jewelryMatch', opt.id)}
                    className="p-6 bg-white border border-neutral-200 text-left hover:border-black transition-all duration-200 cursor-pointer flex flex-col justify-between h-40 group"
                  >
                    <div className="flex justify-end w-full">
                      <div className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center group-hover:border-black transition-colors">
                        <ArrowRight size={10} className="text-transparent group-hover:text-black transition-colors" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">{opt.label}</h4>
                      <p className="text-[10px] text-neutral-400 mt-1 uppercase leading-normal tracking-wide">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: SKIN TONE SELECTION */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <span className="text-xs tracking-widest text-neutral-400 uppercase font-semibold">LANGKAH TERAKHIR</span>
                <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-neutral-900 mt-2">
                  Pilih rentang kedalaman warna kulit Anda saat ini:
                </h3>
                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Pilih warna yang paling mendekati area leher atau rahang Anda.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-8">
                {skinToneOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('currentSkinTone', opt.id)}
                    className="p-4 bg-white border border-neutral-200 text-center hover:border-black transition-all duration-200 cursor-pointer flex flex-col justify-between items-center gap-4 group"
                  >
                    <div className={`w-14 h-14 rounded-full ${opt.preview} border border-black/10 shadow-inner group-hover:scale-105 transition-transform`} />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">{opt.label}</h4>
                      <p className="text-[9px] text-neutral-400 mt-0.5 uppercase leading-tight tracking-wide">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULT VIEW */}
          {step === 4 && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Header result */}
              <div className="text-center py-4 border-b border-neutral-200">
                <div className="inline-flex items-center justify-center bg-black text-white p-2 rounded-full mb-3">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-xs tracking-[0.3em] text-neutral-400 font-bold uppercase">PROFIL KULIT ANDA</h3>
                <h4 className="text-2xl md:text-3.5xl font-serif text-black font-semibold uppercase mt-1">
                  {result.skinTone} & {result.undertone}
                </h4>
              </div>

              {/* Technical Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual card */}
                <div className="bg-white p-8 border border-neutral-200 flex flex-col justify-between space-y-6">
                  <div>
                    <h5 className="text-[10px] tracking-widest text-neutral-400 uppercase font-bold mb-3">DOKUMEN ANALISIS</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs tracking-wider border-b border-neutral-100 py-1.5 uppercase">
                        <span className="text-neutral-500">Skin Tone:</span>
                        <span className="font-bold text-black">{result.skinTone}</span>
                      </div>
                      <div className="flex justify-between text-xs tracking-wider border-b border-neutral-100 py-1.5 uppercase">
                        <span className="text-neutral-500">Undertone:</span>
                        <span className="font-bold text-black">{result.undertone}</span>
                      </div>
                      <div className="flex justify-between text-xs tracking-wider border-b border-neutral-100 py-1.5 uppercase">
                        <span className="text-neutral-500">Kecocokan Logam:</span>
                        <span className="font-bold text-black">
                          {answers.jewelryMatch === 'silver' ? 'Silver (Cool)' : answers.jewelryMatch === 'gold' ? 'Emas (Warm)' : 'Semua Logam (Netral)'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs tracking-wider py-1.5 uppercase">
                        <span className="text-neutral-500">Sensitivitas Sinar UV:</span>
                        <span className="font-bold text-black">
                          {answers.sunReaction === 'burns' ? 'Sangat Sensitif' : answers.sunReaction === 'tan_then_burn' ? 'Sensitivitas Sedang' : 'Melanin Aktif'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <p className="text-[11px] text-neutral-500 leading-relaxed uppercase tracking-wider">
                      {result.undertone === 'Warm' && 'Kulit Anda memancarkan rona keemasan hangat. Sangat serasi dengan warna-warna bumi (earthy tones), peach segar, dan merah bata.'}
                      {result.undertone === 'Cool' && 'Kulit Anda memiliki rona dingin keperakan/pink. Anda memancarkan kemewahan maksimal saat mengenakan warna pink berry lembut, plum, dan pastel.'}
                      {result.undertone === 'Neutral' && 'Kulit Anda berada di keseimbangan sempurna antara cool dan warm. Anda sangat fleksibel menggunakan hampir semua gradasi warna kecantikan.'}
                    </p>
                  </div>
                </div>

                {/* Recommendations chart */}
                <div className="bg-neutral-900 text-white p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h5 className="text-[10px] tracking-widest text-neutral-400 uppercase font-bold">REKOMENDASI SHADE MAKEUP</h5>
                    
                    <div className="space-y-3 font-sans">
                      <div>
                        <span className="text-[9px] tracking-wider text-neutral-400 uppercase font-medium">FOUNDATION</span>
                        <p className="text-xs tracking-widest font-bold uppercase mt-0.5 text-white">{result.foundation.join(' / ')}</p>
                      </div>
                      <div>
                        <span className="text-[9px] tracking-wider text-neutral-400 uppercase font-medium">CONCEALER</span>
                        <p className="text-xs tracking-widest font-bold uppercase mt-0.5 text-white">{result.concealer.join(' / ')}</p>
                      </div>
                      <div>
                        <span className="text-[9px] tracking-wider text-neutral-400 uppercase font-medium">BLUSH ON</span>
                        <p className="text-xs tracking-widest font-bold uppercase mt-0.5 text-amber-300">{result.blush.join(' / ')}</p>
                      </div>
                      <div>
                        <span className="text-[9px] tracking-wider text-neutral-400 uppercase font-medium">LIPSTICK SHADE</span>
                        <p className="text-xs tracking-widest font-bold uppercase mt-0.5 text-rose-300">{result.lipstick.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-[9px] tracking-wider text-neutral-400 uppercase font-medium">EYESHADOW PALETTE</span>
                        <p className="text-xs tracking-widest font-bold uppercase mt-0.5 text-neutral-300">{result.eyeshadow.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleRestart}
                    className="mt-6 flex items-center justify-center gap-2 border border-white/20 hover:border-white py-3 text-[10px] tracking-widest uppercase transition-colors"
                  >
                    <RotateCcw size={12} /> ULANGI DIAGNOSIS
                  </button>
                </div>
              </div>

              {/* Match Products Section */}
              <div className="pt-6">
                <h4 className="text-xs tracking-[0.25em] text-neutral-400 font-bold uppercase mb-6 text-center">
                  PRODUK YANG COCOK DENGAN SHADE ANDA
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getMatchingMakeupProducts().slice(0, 3).map((product) => (
                    <div 
                      key={product.id}
                      className="bg-white border border-neutral-200 p-4 flex flex-col justify-between group relative transition-all hover:shadow-md"
                    >
                      <span className="absolute top-3 left-3 bg-neutral-900 text-white text-[8px] tracking-widest px-2 py-0.5 uppercase z-10 font-bold">
                        MATCH FOR {result.undertone.toUpperCase()}
                      </span>
                      
                      <div className="aspect-square w-full relative overflow-hidden mb-4 bg-neutral-100">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] tracking-widest text-neutral-400 uppercase block font-semibold">{product.brand}</span>
                        <h5 className="text-xs font-bold uppercase text-black line-clamp-1">{product.name}</h5>
                        <p className="text-xs font-serif text-neutral-800 font-medium">Rp {product.price.toLocaleString('id-ID')}</p>
                        
                        {product.shades && (
                          <div className="pt-2">
                            <span className="text-[8px] tracking-wider text-neutral-400 uppercase block font-medium">Rekomendasi Shade:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.shades.map((shade, idx) => (
                                <span 
                                  key={idx} 
                                  className={`text-[8px] tracking-wider px-2 py-0.5 border uppercase ${
                                    result.lipstick.includes(shade) || result.foundation.includes(shade) || result.blush.includes(shade)
                                      ? 'border-black bg-black text-white font-bold' 
                                      : 'border-neutral-200 text-neutral-500 bg-neutral-50'
                                  }`}
                                >
                                  {shade}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-neutral-100">
                        <button
                          onClick={() => onViewProductDetail(product)}
                          className="border border-neutral-200 hover:border-black p-2 flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
                          title="Lihat Kandungan & BPOM"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={() => {
                            onAddCompare(product);
                            alert(`${product.name} ditambahkan ke daftar perbandingan!`);
                          }}
                          className="border border-neutral-200 hover:border-black text-[9px] tracking-wider font-semibold uppercase flex items-center justify-center hover:bg-neutral-50 transition-all text-neutral-700"
                        >
                          Banding
                        </button>
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            alert(`${product.name} dimasukkan ke tas belanja!`);
                          }}
                          className="bg-black hover:bg-neutral-800 text-white p-2 flex items-center justify-center transition-colors"
                          title="Tambah ke Keranjang"
                        >
                          <ShoppingBag size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
