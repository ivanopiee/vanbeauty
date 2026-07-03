import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, CheckSquare, Search, Flame, ThumbsUp, Upload, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { Product, IngredientInfo, BeforeAfterItem } from '../types';
import { INGREDIENT_LIST } from '../data/ingredients';

interface SkincareHubProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewProductDetail: (product: Product) => void;
}

export default function SkincareHub({
  products,
  onAddToCart,
  onViewProductDetail
}: SkincareHubProps) {
  // Navigation for Sub-views inside Skincare Hub
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'routine' | 'ingredients' | 'match' | 'gallery'>('diagnosis');

  // Diagnosis State
  const [diagnosedType, setDiagnosedType] = useState<'oily' | 'dry' | 'combination' | 'sensitive' | 'normal' | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [tempTypeAnswers, setTempTypeAnswers] = useState<Record<string, string>>({});
  const [isDiagnosed, setIsDiagnosed] = useState(false);

  // Routine Tracker State (loaded from localStorage or empty)
  const [routineTracker, setRoutineTracker] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('vanbeauty_routine_tracker');
    return saved ? JSON.parse(saved) : {
      'am_cleanse': false,
      'am_toner': false,
      'am_serum': false,
      'am_moisturizer': false,
      'am_sunscreen': false,
      'pm_double': false,
      'pm_cleanse': false,
      'pm_exfoliate': false,
      'pm_hydrate': false,
      'pm_cream': false
    };
  });

  // Save routine tracking state to localStorage on edit
  useEffect(() => {
    localStorage.setItem('vanbeauty_routine_tracker', JSON.stringify(routineTracker));
  }, [routineTracker]);

  const toggleTracker = (stepId: string) => {
    setRoutineTracker(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const resetTracker = () => {
    setRoutineTracker({
      'am_cleanse': false,
      'am_toner': false,
      'am_serum': false,
      'am_moisturizer': false,
      'am_sunscreen': false,
      'pm_double': false,
      'pm_cleanse': false,
      'pm_exfoliate': false,
      'pm_hydrate': false,
      'pm_cream': false
    });
  };

  // Ingredient Checker State
  const [ingredientQuery, setIngredientQuery] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientInfo | null>(null);

  // Before & After Gallery State
  const [galleryItems, setGalleryItems] = useState<BeforeAfterItem[]>(() => {
    const saved = localStorage.getItem('vanbeauty_gallery');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ba1',
        userName: 'Sarah Amanda',
        skinType: 'Oily & Acne-Prone',
        duration: '4 Minggu',
        beforeImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400',
        afterImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        notes: 'Berkat The Brightening Solution Niacinamide Serum dan Gentle Salicylic Acid Acne Cleanser dari VanBeauty, jerawat aktif kempes dalam 1 minggu, dan bekas kehitaman memudar drastis setelah 1 bulan pemakaian rutin!',
        likes: 124
      },
      {
        id: 'ba2',
        userName: 'Devi Lestari',
        skinType: 'Dry & Dehydrated',
        duration: '2 Minggu',
        beforeImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        afterImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
        notes: 'Kulit terasa sangat kering bersisik di area hidung dan dahi. Setelah rutin pakai Hydra Beauty Micro Sérum pagi dan malam, kulit saya jadi super lembab, plumpy, dan glowy alami.',
        likes: 95
      }
    ];
  });

  const [newBA, setNewBA] = useState({
    userName: '',
    skinType: '',
    duration: '',
    notes: '',
    beforeImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400', // Template beauty images
    afterImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
  });
  const [showBAForm, setShowBAForm] = useState(false);

  const handleLikeBA = (id: string) => {
    const updated = galleryItems.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    setGalleryItems(updated);
    localStorage.setItem('vanbeauty_gallery', JSON.stringify(updated));
  };

  const handleAddBA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBA.userName || !newBA.skinType || !newBA.duration) return;

    const newItem: BeforeAfterItem = {
      id: `ba_${Date.now()}`,
      userName: newBA.userName,
      skinType: newBA.skinType,
      duration: newBA.duration,
      notes: newBA.notes || 'Sangat puas dengan hasilnya! Formula VanBeauty bekerja sempurna untuk kulit saya.',
      beforeImage: newBA.beforeImage,
      afterImage: newBA.afterImage,
      likes: 0
    };

    const updated = [newItem, ...galleryItems];
    setGalleryItems(updated);
    localStorage.setItem('vanbeauty_gallery', JSON.stringify(updated));
    setShowBAForm(false);
    setNewBA({
      userName: '',
      skinType: '',
      duration: '',
      notes: '',
      beforeImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      afterImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
    });
    alert('Transformasi Before & After Anda berhasil ditambahkan ke galeri!');
  };

  // Diagnosis Handler
  const handleTypeQuizSubmit = () => {
    const sebum = tempTypeAnswers.sebum || 'moderate';
    const peeling = tempTypeAnswers.peeling || 'no';
    const pores = tempTypeAnswers.pores || 'medium';
    const red = tempTypeAnswers.red || 'no';

    let determinedType: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal' = 'normal';

    if (red === 'yes') {
      determinedType = 'sensitive';
    } else if (sebum === 'high' && pores === 'large') {
      determinedType = 'oily';
    } else if (sebum === 'low' && peeling === 'yes') {
      determinedType = 'dry';
    } else if (sebum === 'mixed') {
      determinedType = 'combination';
    } else {
      determinedType = 'normal';
    }

    setDiagnosedType(determinedType);
    setIsDiagnosed(true);
    setActiveTab('routine'); // Auto route to generated routine
  };

  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  // Filter products for Product Match
  const getMatchedProducts = () => {
    const typeToFilter = diagnosedType || 'normal';
    return products.filter(p => {
      // Must be skincare category
      if (p.category !== 'skincare') return false;
      
      // Match skin type
      const matchesType = p.skinType.includes(typeToFilter);
      
      // Match concerns (at least one)
      const matchesConcern = selectedConcerns.length === 0 || 
        selectedConcerns.some(c => p.skinConcern.includes(c));

      return matchesType || matchesConcern;
    });
  };

  // Generated Skincare steps
  const getRoutineSteps = () => {
    const type = diagnosedType || 'normal';
    const hasAcne = selectedConcerns.includes('jerawat') || selectedConcerns.includes('bekas jerawat');
    const hasDull = selectedConcerns.includes('kusam');

    const morning = [
      {
        id: 'am_cleanse',
        step: 'Langkah 1: Cleansing Wajah',
        desc: type === 'oily' || hasAcne 
          ? 'Gunakan sabun wajah berbasis Salicylic Acid (BHA) untuk mengangkat minyak berlebih.' 
          : 'Gunakan sabun wajah hidrasi ringan tanpa busa berlebih untuk melembabkan.',
        product: type === 'oily' || hasAcne ? 'Gentle Salicylic Acid Acne Cleanser' : 'Pembersih lembut non-alkohol',
        isCheck: routineTracker.am_cleanse
      },
      {
        id: 'am_toner',
        step: 'Langkah 2: Hydrating Toner',
        desc: 'Tepuk-tepuk toner hidrasi kaya Centella Asiatica atau Hyaluronic Acid untuk menyeimbangkan pH kulit.',
        product: 'Hydra Balance Hydrating Toner',
        isCheck: routineTracker.am_toner
      },
      {
        id: 'am_serum',
        step: 'Langkah 3: Serum Pelindung',
        desc: hasDull 
          ? 'Gunakan serum Vitamin C atau Niacinamide pagi hari untuk mencerahkan dan melindungi dari radikal bebas.'
          : 'Gunakan serum Hydra Beauty Micro Sérum untuk hidrasi mendalam.',
        product: hasDull ? 'The Brightening Solution 10% Niacinamide Serum' : 'Hydra Beauty Micro Sérum',
        isCheck: routineTracker.am_serum
      },
      {
        id: 'am_moisturizer',
        step: 'Langkah 4: Pelembab Ringan',
        desc: type === 'dry' 
          ? 'Gunakan pelembab bertekstur krim kaya ceramide untuk mengunci kelembapan.' 
          : 'Gunakan pelembab bertekstur gel-krim ringan agar bebas kilap.',
        product: 'L’Extrait Supreme Youth Retinol Cream / Gel moisturizer',
        isCheck: routineTracker.am_moisturizer
      },
      {
        id: 'am_sunscreen',
        step: 'Langkah 5: Tabir Surya (Sunscreen)',
        desc: 'WAJIB. Gunakan tabir surya SPF 50 PA++++ minimal 2 ruas jari untuk melindungi dari penuaan dini.',
        product: 'Eksklusif Sun Protect SPF 50',
        isCheck: routineTracker.am_sunscreen
      }
    ];

    const night = [
      {
        id: 'pm_double',
        step: 'Langkah 1: First Cleanse',
        desc: 'Hapus debu, makeup, dan sunscreen berbasis silikon menggunakan cleansing balm atau micellar water.',
        product: 'Micellar Water / Oil Cleansing',
        isCheck: routineTracker.pm_double
      },
      {
        id: 'pm_cleanse',
        step: 'Langkah 2: Second Cleanse',
        desc: 'Bersihkan wajah secara mendalam dari sisa kotoran mikro menggunakan pembersih lembut.',
        product: type === 'oily' || hasAcne ? 'Gentle Salicylic Acid Acne Cleanser' : 'Pembersih lembut non-alkohol',
        isCheck: routineTracker.pm_cleanse
      },
      {
        id: 'pm_exfoliate',
        step: 'Langkah 3: Perawatan Aktif (Eksfoliasi / Retinol)',
        desc: type === 'dry' || selectedConcerns.includes('kerutan halus')
          ? 'Malam hari sangat ideal untuk mengoleskan Retinol Cream guna merangsang kolagen baru (2-3 kali seminggu).'
          : 'Gunakan BHA untuk mengikis komedo dan sel kulit mati penyumbat pori.',
        product: type === 'dry' || selectedConcerns.includes('kerutan halus') ? 'L’Extrait Supreme Youth Retinol Cream' : 'Serum eksfoliasi aktif',
        isCheck: routineTracker.pm_exfoliate
      },
      {
        id: 'pm_hydrate',
        step: 'Langkah 4: Hidrasi Intensif',
        desc: 'Oleskan serum Hydra Beauty Micro Sérum untuk memulihkan elastisitas kulit saat tidur malam hari.',
        product: 'Hydra Beauty Micro Sérum',
        isCheck: routineTracker.pm_hydrate
      },
      {
        id: 'pm_cream',
        step: 'Langkah 5: Night Moisture Barrier',
        desc: 'Kunci seluruh rangkaian dengan krim malam kaya Ceramide NP dan botanical oils untuk regenerasi sel.',
        product: 'Ceramide Barrier Night Cream',
        isCheck: routineTracker.pm_cream
      }
    ];

    return { morning, night };
  };

  const { morning: morningSteps, night: nightSteps } = getRoutineSteps();

  // Ingredient search filter
  const filteredIngredients = INGREDIENT_LIST.filter(item => 
    item.name.toLowerCase().includes(ingredientQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(ingredientQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 font-sans">
      {/* Page Title */}
      <div className="text-center mb-10">
        <span className="text-[10px] tracking-[0.3em] text-neutral-400 font-bold uppercase block mb-2">ADVANCED SKIN CLINICAL HARMONY</span>
        <h2 className="text-3xl md:text-4.5xl tracking-tight font-serif text-black font-semibold mb-3">
          SKINCARE HUB & DIAGNOSIS
        </h2>
        <p className="text-xs text-neutral-500 uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
          Sistem intelijen yang dirancang untuk menganalisis kondisi kulit, menguratori bahan aktif premium, menyusun rutinitas harian, dan mendokumentasikan progres Anda.
        </p>
      </div>

      {/* Internal Sub-navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-neutral-200 pb-4 mb-8 text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
        <button
          onClick={() => setActiveTab('diagnosis')}
          className={`px-4 py-2 hover:text-black transition-colors ${activeTab === 'diagnosis' ? 'text-black border-b border-black' : ''}`}
        >
          1. Skin Diagnosis
        </button>
        <button
          onClick={() => {
            if (!isDiagnosed) {
              alert('Lakukan diagnosis tipe kulit terlebih dahulu di Tab "Skin Diagnosis"!');
              return;
            }
            setActiveTab('routine');
          }}
          className={`px-4 py-2 hover:text-black transition-colors ${activeTab === 'routine' ? 'text-black border-b border-black' : ''} ${!isDiagnosed ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          2. Routine Builder & Tracker
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`px-4 py-2 hover:text-black transition-colors ${activeTab === 'ingredients' ? 'text-black border-b border-black' : ''}`}
        >
          3. Ingredient Checker
        </button>
        <button
          onClick={() => {
            if (!isDiagnosed) {
              alert('Lakukan diagnosis tipe kulit terlebih dahulu di Tab "Skin Diagnosis" untuk melihat rekomendasi produk!');
              return;
            }
            setActiveTab('match');
          }}
          className={`px-4 py-2 hover:text-black transition-colors ${activeTab === 'match' ? 'text-black border-b border-black' : ''} ${!isDiagnosed ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          4. Curated Product Match
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 hover:text-black transition-colors ${activeTab === 'gallery' ? 'text-black border-b border-black' : ''}`}
        >
          5. Before & After Gallery
        </button>
      </div>

      {/* Render Sub-views */}
      <div className="bg-neutral-50 border border-neutral-200 p-6 md:p-10 shadow-sm">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DIAGNOSIS (Skin Type & Concerns) */}
          {activeTab === 'diagnosis' && (
            <motion.div
              key="diagnosisTab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="border-b border-neutral-200 pb-6 text-center">
                <span className="text-[10px] tracking-widest text-neutral-400 font-bold uppercase">TAHAP PERTAMA</span>
                <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-neutral-900 mt-1">ANALISIS KULIT PERSONAL</h3>
                <p className="text-xs text-neutral-500 uppercase mt-1 tracking-wide">Jawab pertanyaan singkat di bawah ini untuk mengidentifikasi tipe biologis kulit Anda.</p>
              </div>

              {/* Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Q1 */}
                <div className="bg-white p-6 border border-neutral-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-4">
                    1. Bagaimana kondisi sebum/minyak di wajah Anda pada siang hari?
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'low', label: 'Sangat kering, bersisik, atau terasa kencang tertarik.' },
                      { id: 'moderate', label: 'Normal, lembab alami di area pipi namun sedikit berminyak di dahi.' },
                      { id: 'high', label: 'Berminyak di seluruh area wajah, mudah terlihat mengkilap.' },
                      { id: 'mixed', label: 'Berminyak di dahi/hidung (T-Zone), namun pipi sangat kering.' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-start gap-3 p-2 hover:bg-neutral-50 cursor-pointer text-xs uppercase tracking-wide text-neutral-600">
                        <input
                          type="radio"
                          name="sebum"
                          checked={tempTypeAnswers.sebum === item.id}
                          onChange={() => setTempTypeAnswers({ ...tempTypeAnswers, sebum: item.id })}
                          className="mt-0.5 accent-black"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div className="bg-white p-6 border border-neutral-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-4">
                    2. Apakah kulit Anda sering mengalami pengelupasan halus atau garis dehidrasi?
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'yes', label: 'Ya, sering sekali terutama di area sekitar bibir dan cuping hidung.' },
                      { id: 'no', label: 'Tidak pernah, kulit saya selalu halus dan kencang.' },
                      { id: 'sometimes', label: 'Hanya jika terlalu lama berada di dalam ruangan ber-AC.' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-start gap-3 p-2 hover:bg-neutral-50 cursor-pointer text-xs uppercase tracking-wide text-neutral-600">
                        <input
                          type="radio"
                          name="peeling"
                          checked={tempTypeAnswers.peeling === item.id}
                          onChange={() => setTempTypeAnswers({ ...tempTypeAnswers, peeling: item.id })}
                          className="mt-0.5 accent-black"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q3 */}
                <div className="bg-white p-6 border border-neutral-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-4">
                    3. Bagaimana visualisasi pori-pori kulit wajah Anda jika dilihat dekat?
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'small', label: 'Sangat rapat, halus, bahkan hampir tidak terlihat sama sekali.' },
                      { id: 'medium', label: 'Terlihat di dahi dan samping hidung saja.' },
                      { id: 'large', label: 'Sangat besar, terbuka jelas, dan rentan terhadap komedo.' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-start gap-3 p-2 hover:bg-neutral-50 cursor-pointer text-xs uppercase tracking-wide text-neutral-600">
                        <input
                          type="radio"
                          name="pores"
                          checked={tempTypeAnswers.pores === item.id}
                          onChange={() => setTempTypeAnswers({ ...tempTypeAnswers, pores: item.id })}
                          className="mt-0.5 accent-black"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q4 */}
                <div className="bg-white p-6 border border-neutral-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-4">
                    4. Apakah wajah Anda mudah kemerahan, perih, atau gatal saat mencoba produk kosmetik baru?
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'yes', label: 'Ya, kulit saya sangat reaktif dan mudah mengalami iritasi merah.' },
                      { id: 'no', label: 'Jarang sekali atau hampir tidak pernah mengalami masalah sensitivitas.' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-start gap-3 p-2 hover:bg-neutral-50 cursor-pointer text-xs uppercase tracking-wide text-neutral-600">
                        <input
                          type="radio"
                          name="red"
                          checked={tempTypeAnswers.red === item.id}
                          onChange={() => setTempTypeAnswers({ ...tempTypeAnswers, red: item.id })}
                          className="mt-0.5 accent-black"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skin Concerns Section */}
              <div className="pt-6 border-t border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-4 text-center">
                  Pilih Kekhawatiran Masalah Kulit Utama Anda (Multi-pilihan):
                </h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    'jerawat', 'bekas jerawat', 'kusam', 'pori besar', 'kemerahan', 'kulit kering', 'kerutan halus', 'minyak berlebih'
                  ].map((concern) => (
                    <button
                      key={concern}
                      onClick={() => toggleConcern(concern)}
                      className={`px-5 py-2.5 text-xs tracking-wider uppercase border transition-all cursor-pointer ${
                        selectedConcerns.includes(concern)
                          ? 'bg-black text-white border-black font-bold'
                          : 'bg-white text-neutral-600 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Submit */}
              <div className="text-center pt-8">
                <button
                  onClick={handleTypeQuizSubmit}
                  className="bg-black hover:bg-neutral-800 text-white text-xs tracking-[0.2em] font-semibold uppercase px-12 py-4 shadow-sm transition-all luxury-btn"
                >
                  PROSES DIAGNOSIS KULIT
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ROUTINE BUILDER & TRACKER */}
          {activeTab === 'routine' && isDiagnosed && (
            <motion.div
              key="routineTab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="border-b border-neutral-200 pb-6 text-center flex justify-between items-center flex-wrap gap-4">
                <div className="text-left">
                  <span className="text-[10px] tracking-widest text-neutral-400 font-bold uppercase">URUTAN PRODUK TERKUSTOMISASI</span>
                  <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-neutral-900 mt-1">DAILY ROUTINE TRACKER</h3>
                  <p className="text-xs text-neutral-500 uppercase mt-0.5 tracking-wide">
                    Tipe Kulit: <span className="font-bold text-black">{diagnosedType?.toUpperCase()}</span> 
                    {selectedConcerns.length > 0 && ` | Masalah: ${selectedConcerns.join(', ').toUpperCase()}`}
                  </p>
                </div>
                <button 
                  onClick={resetTracker}
                  className="flex items-center gap-1.5 border border-neutral-300 px-3 py-1.5 text-[10px] text-neutral-500 hover:text-black hover:border-black transition-all uppercase tracking-wider"
                >
                  <RefreshCw size={10} /> Reset Centang Hari Ini
                </button>
              </div>

              {/* Routine grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Morning Routine */}
                <div className="space-y-4">
                  <div className="bg-amber-50 text-amber-900 p-4 border border-amber-200/50 flex items-center gap-3">
                    <span className="text-sm font-bold tracking-widest uppercase">☀️ PAGI (MORNING)</span>
                  </div>

                  <div className="space-y-3">
                    {morningSteps.map((step) => (
                      <div 
                        key={step.id} 
                        onClick={() => toggleTracker(step.id)}
                        className={`p-4 bg-white border cursor-pointer transition-all flex items-start gap-4 hover:shadow-sm ${
                          step.isCheck ? 'border-neutral-300 bg-neutral-50 opacity-65' : 'border-neutral-200'
                        }`}
                      >
                        <div className="mt-0.5">
                          <CheckSquare 
                            size={18} 
                            className={`stroke-[1.5] ${step.isCheck ? 'text-neutral-500 fill-neutral-200' : 'text-neutral-400'}`} 
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-xs font-bold uppercase tracking-wider ${step.isCheck ? 'line-through text-neutral-500' : 'text-neutral-800'}`}>
                            {step.step}
                          </h4>
                          <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wide leading-normal">
                            Rekomendasi Formula: <span className="text-neutral-700 font-semibold">{step.product}</span>
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Night Routine */}
                <div className="space-y-4">
                  <div className="bg-indigo-50 text-indigo-900 p-4 border border-indigo-200/50 flex items-center gap-3">
                    <span className="text-sm font-bold tracking-widest uppercase">🌙 MALAM (NIGHT)</span>
                  </div>

                  <div className="space-y-3">
                    {nightSteps.map((step) => (
                      <div 
                        key={step.id} 
                        onClick={() => toggleTracker(step.id)}
                        className={`p-4 bg-white border cursor-pointer transition-all flex items-start gap-4 hover:shadow-sm ${
                          step.isCheck ? 'border-neutral-300 bg-neutral-50 opacity-65' : 'border-neutral-200'
                        }`}
                      >
                        <div className="mt-0.5">
                          <CheckSquare 
                            size={18} 
                            className={`stroke-[1.5] ${step.isCheck ? 'text-neutral-500 fill-neutral-200' : 'text-neutral-400'}`} 
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-xs font-bold uppercase tracking-wider ${step.isCheck ? 'line-through text-neutral-500' : 'text-neutral-800'}`}>
                            {step.step}
                          </h4>
                          <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wide leading-normal">
                            Rekomendasi Formula: <span className="text-neutral-700 font-semibold">{step.product}</span>
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tracking Stats bar */}
              <div className="bg-neutral-900 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4 font-sans uppercase">
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-neutral-300">PROGRESS PENERAPAN HARI INI</h4>
                  <p className="text-[10px] text-neutral-400 tracking-wide mt-1">
                    Disiplin dan konsistensi adalah rahasia terbesar kulit glowing bersinar alami.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-bold font-serif">
                      {Object.values(routineTracker).filter(Boolean).length} / 10
                    </span>
                    <span className="text-[10px] text-neutral-400 tracking-wider block">Langkah Selesai</span>
                  </div>
                  <div className="w-32 bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-white h-full transition-all duration-300"
                      style={{ width: `${(Object.values(routineTracker).filter(Boolean).length / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: INGREDIENT CHECKER */}
          {activeTab === 'ingredients' && (
            <motion.div
              key="ingredientsTab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-neutral-200 pb-6 text-center">
                <span className="text-[10px] tracking-widest text-neutral-400 font-bold uppercase">KANDUNGAN & MANFAAT BAHAN</span>
                <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-neutral-900 mt-1">ACTIVE INGREDIENT CHECKER</h3>
                <p className="text-xs text-neutral-500 uppercase mt-1 tracking-wide">Pelajari cara kerja, fungsi ilmiah, dan kecocokan setiap bahan aktif kecantikan pada kulit Anda.</p>
              </div>

              {/* Search bar inside */}
              <div className="max-w-xl mx-auto flex border border-neutral-300 focus-within:border-black transition-colors">
                <div className="p-3 bg-white text-neutral-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="CARI BAHAN AKTIF (MISAL: RETINOL, NIACINAMIDE)..."
                  value={ingredientQuery}
                  onChange={(e) => setIngredientQuery(e.target.value)}
                  className="flex-1 py-3 px-2 bg-white text-xs tracking-widest focus:outline-none uppercase text-black"
                />
              </div>

              {/* Ingredients list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {filteredIngredients.map((ing) => (
                  <div 
                    key={ing.name}
                    onClick={() => setSelectedIngredient(selectedIngredient?.name === ing.name ? null : ing)}
                    className={`p-6 bg-white border transition-all cursor-pointer hover:border-black ${
                      selectedIngredient?.name === ing.name ? 'border-black ring-1 ring-black' : 'border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] tracking-widest text-neutral-400 font-bold uppercase block">{ing.category}</span>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-black mt-0.5">{ing.name}</h4>
                      </div>
                      <Plus 
                        size={14} 
                        className={`text-neutral-400 transition-transform ${selectedIngredient?.name === ing.name ? 'rotate-45 text-black' : ''}`} 
                      />
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {ing.benefits.slice(0, 2).map((b, idx) => (
                        <span key={idx} className="bg-neutral-100 text-neutral-700 text-[9px] tracking-wider px-2 py-0.5 border border-neutral-200 uppercase font-medium">
                          ✓ {b}
                        </span>
                      ))}
                    </div>

                    {/* Expandable details */}
                    <AnimatePresence>
                      {selectedIngredient?.name === ing.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-4 pt-4 border-t border-neutral-100 space-y-3 text-xs leading-relaxed text-neutral-600"
                        >
                          <p className="uppercase tracking-wide text-neutral-500 text-[10px] font-semibold">MEKANISME KERJA BIO-SEL:</p>
                          <p className="normal-case text-neutral-700 font-sans">{ing.details}</p>
                          
                          <div className="p-3 bg-neutral-900 text-white border border-neutral-800">
                            <span className="text-[9px] tracking-widest text-neutral-400 font-bold block uppercase mb-1">PROFIL KESESUAIAN:</span>
                            <p className="text-[11px] normal-case tracking-wide leading-normal font-sans text-neutral-200">{ing.suitability}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {filteredIngredients.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-neutral-400 text-xs tracking-wider uppercase bg-white border border-dashed">
                    Tidak ditemukan bahan aktif dengan kata kunci "{ingredientQuery}".
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: PRODUCT MATCH */}
          {activeTab === 'match' && isDiagnosed && (
            <motion.div
              key="matchTab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-neutral-200 pb-6 text-center">
                <span className="text-[10px] tracking-widest text-neutral-400 font-bold uppercase">HASIL REKOMENDASI FORMULA</span>
                <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-neutral-900 mt-1">CURATED PRODUCT MATCH</h3>
                <p className="text-xs text-neutral-500 uppercase mt-1 tracking-wide">
                  Rekomendasi di bawah disaring secara ilmiah agar 100% aman bagi tipe kulit <span className="font-bold text-black">{diagnosedType?.toUpperCase()}</span> Anda.
                </p>
              </div>

              {/* Matching products grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {getMatchedProducts().map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white border border-neutral-200 p-5 flex flex-col justify-between group transition-all hover:shadow-md"
                  >
                    <div className="aspect-square w-full relative overflow-hidden mb-4 bg-neutral-100 border border-neutral-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        referrerPolicy="no-referrer"
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] tracking-widest text-neutral-400 uppercase font-semibold">
                        <span>{product.brand}</span>
                        <span className="text-emerald-600 font-bold">✓ BPOM REGISTERED</span>
                      </div>
                      <h4 className="text-xs font-bold uppercase text-black line-clamp-1 mt-1">{product.name}</h4>
                      <p className="text-xs font-serif text-neutral-800 font-medium pb-2">Rp {product.price.toLocaleString('id-ID')}</p>
                      
                      {/* Active components indicator */}
                      <div className="pt-2 border-t border-neutral-100">
                        <span className="text-[8px] tracking-wider text-neutral-400 uppercase font-medium">Bahan Aktif Utama:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.keyIngredients.map((ki, idx) => (
                            <span key={idx} className="bg-neutral-50 text-neutral-600 text-[8px] tracking-wider px-2 py-0.5 border border-neutral-200 uppercase font-medium">
                              ★ {ki}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-neutral-100">
                      <button
                        onClick={() => onViewProductDetail(product)}
                        className="border border-neutral-200 hover:border-black py-2.5 text-[9px] tracking-widest uppercase text-neutral-700 font-semibold hover:bg-neutral-50 transition-all text-center"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          alert(`${product.name} berhasil ditambahkan ke keranjang belanja Anda!`);
                        }}
                        className="bg-black hover:bg-neutral-800 text-white py-2.5 text-[9px] tracking-widest uppercase font-semibold transition-colors text-center"
                      >
                        Beli Sekarang
                      </button>
                    </div>
                  </div>
                ))}

                {getMatchedProducts().length === 0 && (
                  <div className="col-span-3 text-center py-12 text-neutral-400 text-xs tracking-wider uppercase bg-white border border-dashed">
                    Belum ada produk yang cocok dengan spesifikasi tipe kulit Anda saat ini.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 5: BEFORE & AFTER GALLERY */}
          {activeTab === 'gallery' && (
            <motion.div
              key="galleryTab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="border-b border-neutral-200 pb-6 text-center flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-center md:text-left">
                  <span className="text-[10px] tracking-widest text-neutral-400 font-bold uppercase">BUKTI KLINIS REAL</span>
                  <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-neutral-900 mt-1">BEFORE & AFTER GALLERY</h3>
                  <p className="text-xs text-neutral-500 uppercase mt-0.5 tracking-wide">Kumpulan hasil pembuktian nyata dari para pengguna rangkaian formula premium VanBeauty.</p>
                </div>
                <button
                  onClick={() => setShowBAForm(!showBAForm)}
                  className="bg-black hover:bg-neutral-800 text-white text-[10px] tracking-widest font-bold uppercase px-5 py-2.5 flex items-center gap-1.5 self-center"
                >
                  <Upload size={12} /> {showBAForm ? 'Tutup Form' : 'Unggah Transformasi Saya'}
                </button>
              </div>

              {/* Form to submit transform logs */}
              <AnimatePresence>
                {showBAForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white border border-neutral-300 p-6"
                  >
                    <form onSubmit={handleAddBA} className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-2 flex items-center gap-1">
                        <Plus size={14} /> INFORMASI KEMAJUAN PERAWATAN KULIT ANDA
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[9px] tracking-wider text-neutral-400 uppercase font-bold block mb-1">NAMA LENGKAP</label>
                          <input 
                            type="text" 
                            required
                            placeholder="MISAL: AMANDA LATIPAH" 
                            value={newBA.userName}
                            onChange={(e) => setNewBA({ ...newBA, userName: e.target.value })}
                            className="w-full border border-neutral-300 text-xs px-3 py-2 uppercase bg-neutral-50 focus:outline-none focus:border-black font-sans"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] tracking-wider text-neutral-400 uppercase font-bold block mb-1">TIPE & KONDISI KULIT</label>
                          <input 
                            type="text" 
                            required
                            placeholder="MISAL: OILY & JERAWAT MERADANG" 
                            value={newBA.skinType}
                            onChange={(e) => setNewBA({ ...newBA, skinType: e.target.value })}
                            className="w-full border border-neutral-300 text-xs px-3 py-2 uppercase bg-neutral-50 focus:outline-none focus:border-black font-sans"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] tracking-wider text-neutral-400 uppercase font-bold block mb-1">DURASI PEMAKAIAN ROUTINE</label>
                          <input 
                            type="text" 
                            required
                            placeholder="MISAL: 3 MINGGU" 
                            value={newBA.duration}
                            onChange={(e) => setNewBA({ ...newBA, duration: e.target.value })}
                            className="w-full border border-neutral-300 text-xs px-3 py-2 uppercase bg-neutral-50 focus:outline-none focus:border-black font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] tracking-wider text-neutral-400 uppercase font-bold block mb-1">ULASAN HASIL & CATATAN</label>
                        <textarea 
                          rows={3}
                          placeholder="JELASKAN KONDISI KULIT SEBELUMNYA DAN BAGAIMANA PERUBAHAN YANG DIRASAKAN SETELAH MENGGUNAKAN FORMULA KAMI..."
                          value={newBA.notes}
                          onChange={(e) => setNewBA({ ...newBA, notes: e.target.value })}
                          className="w-full border border-neutral-300 text-xs px-3 py-2 uppercase bg-neutral-50 focus:outline-none focus:border-black font-sans resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border border-neutral-200 bg-neutral-50 text-[10px] text-neutral-500 uppercase tracking-wide">
                          <span>Foto Sebelum (Before):</span>
                          <p className="text-[9px] text-neutral-400 mt-0.5 normal-case">Foto representasi keindahan kulit alamiah ditarik otomatis sebagai contoh simulasi porselen.</p>
                        </div>
                        <div className="p-3 border border-neutral-200 bg-neutral-50 text-[10px] text-neutral-500 uppercase tracking-wide">
                          <span>Foto Sesudah (After):</span>
                          <p className="text-[9px] text-neutral-400 mt-0.5 normal-case">Hasil pencerahan natural kulit bercahaya ditarik dari template klinis beresolusi tinggi.</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowBAForm(false)}
                          className="px-6 py-2.5 border border-neutral-300 hover:border-black text-xs uppercase tracking-widest transition-colors font-semibold"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-2.5 bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-widest transition-colors font-bold"
                        >
                          Kirim Review
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gallery Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {galleryItems.map((item) => (
                  <div key={item.id} className="bg-white border border-neutral-200 p-6 space-y-4">
                    
                    {/* Before & after comparison container */}
                    <div className="grid grid-cols-2 gap-2 relative">
                      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-100">
                        <img 
                          src={item.beforeImage} 
                          alt="Before" 
                          referrerPolicy="no-referrer"
                          className="object-cover w-full h-full"
                        />
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[8px] tracking-widest font-bold px-2 py-0.5 uppercase">
                          BEFORE
                        </span>
                      </div>

                      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-100">
                        <img 
                          src={item.afterImage} 
                          alt="After" 
                          referrerPolicy="no-referrer"
                          className="object-cover w-full h-full"
                        />
                        <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[8px] tracking-widest font-bold px-2 py-0.5 uppercase">
                          AFTER
                        </span>
                      </div>

                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black text-[9px] font-bold w-14 h-14 rounded-full border border-neutral-300 flex flex-col items-center justify-center shadow-lg uppercase leading-none tracking-tighter">
                        <span>{item.duration}</span>
                        <span className="text-[7px] text-neutral-400 mt-0.5">RUTIN</span>
                      </div>
                    </div>

                    {/* Metadata & Description */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                        <div>
                          <h4 className="text-xs font-bold uppercase text-black">{item.userName}</h4>
                          <span className="text-[9px] tracking-wider text-neutral-400 uppercase font-medium">Tipe Kulit: {item.skinType}</span>
                        </div>
                        <button 
                          onClick={() => handleLikeBA(item.id)}
                          className="flex items-center gap-1.5 text-[10px] text-neutral-500 hover:text-black hover:bg-neutral-50 border border-neutral-200 px-2.5 py-1 transition-all uppercase tracking-wider"
                        >
                          <ThumbsUp size={10} /> Suka ({item.likes})
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-600 leading-relaxed font-sans normal-case">
                        "{item.notes}"
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
