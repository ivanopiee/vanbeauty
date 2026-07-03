import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Eye, Heart, HelpCircle, Sparkles, ShieldCheck, Trash2, ArrowRight, X, Star } from 'lucide-react';
import { Product } from './types';
import { SEED_PRODUCTS } from './data/products';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SkinToneQuiz from './components/SkinToneQuiz';
import SkincareHub from './components/SkincareHub';
import ProductCompare from './components/ProductCompare';
import ProductDetailModal from './components/ProductDetailModal';
import { isSupabaseConfigured, supabase } from './lib/supabase';

export default function App() {
  // Navigation & View State (Routing)
  const [currentView, setView] = useState<string>(() => {
    // Read from URL hash if exists
    const hash = window.location.hash.replace('#/', '');
    const validViews = ['home', 'shop', 'skin-tone', 'skincare', 'compare'];
    return validViews.includes(hash) ? hash : 'home';
  });

  // Keep hash in sync
  useEffect(() => {
    window.location.hash = `#/${currentView}`;
  }, [currentView]);

  // Product List (loaded from Supabase if configured, fallback to Seed Data)
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interactive cart & comparison list states
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vanbeauty_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareList, setCompareList] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vanbeauty_compare');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch from Supabase on mount if configured
  useEffect(() => {
    async function fetchProducts() {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        setLoadingProducts(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          // Map database snake_case fields to React camelCase fields
          const mapped: Product[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            category: item.category,
            subCategory: item.sub_category,
            price: Number(item.price),
            image: item.image,
            ingredients: item.ingredients || [],
            keyIngredients: item.key_ingredients || [],
            bpomCode: item.bpom_code,
            skinType: item.skin_type || [],
            skinConcern: item.skin_concern || [],
            description: item.description,
            shades: item.shades,
            size: item.size,
            rating: Number(item.rating)
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Gagal mengambil data dari Supabase:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('vanbeauty_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vanbeauty_compare', JSON.stringify(compareList));
  }, [compareList]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const getCartTotal = () => {
    return cart.reduce((total, p) => total + p.price, 0);
  };

  // Compare operations
  const handleAddCompare = (product: Product) => {
    if (compareList.some((p) => p.id === product.id)) {
      return; // Already exists
    }
    if (compareList.length >= 3) {
      alert('Anda hanya dapat membandingkan maksimal 3 produk secara berdampingan. Hapus salah satu produk terlebih dahulu.');
      return;
    }
    setCompareList((prev) => [...prev, product]);
  };

  const handleRemoveCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  // Search filter helper
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getFilteredProducts = () => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bpomCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Premium Luxury Navigation */}
      <Navbar
        currentView={currentView}
        setView={setView}
        cartCount={cart.length}
        wishlistCount={compareList.length}
        onSearch={handleSearch}
        isSupabaseConnected={isSupabaseConfigured}
      />

      {/* Main Container */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: HOME PAGE (Chanel Luxury Screenshot look) */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-16"
            >
              {/* Hero Banner 1: Haute Couture & Fashion look (Margot Robbie background style) */}
              <div className="relative h-[80vh] md:h-[90vh] w-full bg-neutral-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1600"
                  alt="VanBeauty Velvet"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
                />
                {/* Visual Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
                
                {/* Central Overlay Box (Chanel signature format) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="bg-white/95 backdrop-blur-xs p-8 md:p-12 max-w-lg border border-black/10 shadow-xl space-y-4">
                    <span className="text-[10px] tracking-[0.3em] text-neutral-500 font-bold uppercase">MAKEUP LUXURY</span>
                    <h2 className="text-2xl md:text-4xl font-serif tracking-tight text-black font-bold uppercase leading-tight">
                      ROUGE ALLURE VELVET EDISI TERBATAS
                    </h2>
                    <p className="text-[11px] text-neutral-500 uppercase tracking-widest leading-relaxed">
                      Eksplorasi pigmen mewah matte dengan kenyamanan luar biasa. Formula khusus yang bersertifikasi BPOM resmi untuk bibir menawan.
                    </p>
                    <button
                      onClick={() => setView('shop')}
                      className="inline-block bg-black hover:bg-neutral-800 text-white text-[10px] tracking-widest font-semibold uppercase px-8 py-3.5 transition-colors cursor-pointer"
                    >
                      LIHAT SELENGKAPNYA
                    </button>
                  </div>
                </div>
              </div>

              {/* Core Feature Quick Links (Interactive Grid) */}
              <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Link 1: Skin tone Matcher */}
                <div className="relative group overflow-hidden bg-neutral-100 aspect-[4/3] border border-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
                    alt="Skin tone match"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-6 text-white space-y-2">
                    <span className="text-[9px] tracking-widest text-neutral-300 font-bold uppercase">INTELLIGENT BEAUTY SYSTEM</span>
                    <h3 className="text-base font-serif font-semibold uppercase">FIND YOUR SKIN TONE</h3>
                    <p className="text-[10px] text-neutral-200 uppercase leading-normal tracking-wider">
                      Cek rona kulit Anda, shade match foundation, dan lipstik paling natural.
                    </p>
                    <button
                      onClick={() => setView('skin-tone')}
                      className="text-[10px] font-bold tracking-widest uppercase underline text-white hover:text-neutral-300 self-start pt-1"
                    >
                      Mulai Tes Sekarang →
                    </button>
                  </div>
                </div>

                {/* Link 2: Skincare Hub */}
                <div className="relative group overflow-hidden bg-neutral-100 aspect-[4/3] border border-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800"
                    alt="Skincare Diagnosis"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-6 text-white space-y-2">
                    <span className="text-[9px] tracking-widest text-neutral-300 font-bold uppercase">CLINICAL SKIN DIAGNOSIS</span>
                    <h3 className="text-base font-serif font-semibold uppercase">SKINCARE HUB</h3>
                    <p className="text-[10px] text-neutral-200 uppercase leading-normal tracking-wider">
                      Analisis tipe kulit, susun urutan routine pagi & malam, dan cek bahan aktif.
                    </p>
                    <button
                      onClick={() => setView('skincare')}
                      className="text-[10px] font-bold tracking-widest uppercase underline text-white hover:text-neutral-300 self-start pt-1"
                    >
                      Buka Skincare Hub →
                    </button>
                  </div>
                </div>

                {/* Link 3: Compare Products */}
                <div className="relative group overflow-hidden bg-neutral-100 aspect-[4/3] border border-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1631730359575-38e4755d772b?auto=format&fit=crop&q=80&w=800"
                    alt="Compare Products"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-6 text-white space-y-2">
                    <span className="text-[9px] tracking-widest text-neutral-300 font-bold uppercase">SMART COMPARISON MATRIX</span>
                    <h3 className="text-base font-serif font-semibold uppercase">BANDINGKAN PRODUK</h3>
                    <p className="text-[10px] text-neutral-200 uppercase leading-normal tracking-wider">
                      Bandingkan kandungan ingredients dan nomor sertifikat BPOM 3 produk sekaligus.
                    </p>
                    <button
                      onClick={() => setView('compare')}
                      className="text-[10px] font-bold tracking-widest uppercase underline text-white hover:text-neutral-300 self-start pt-1"
                    >
                      Bandingkan Formula →
                    </button>
                  </div>
                </div>

              </div>

              {/* Hero Banner 2: Fragrance look (Jacob Elordi Bleu de Chanel style) */}
              <div className="relative h-[80vh] w-full bg-neutral-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1600"
                  alt="Bleu de Chanel vibe"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-[10px] tracking-[0.4em] text-neutral-300 font-bold uppercase mb-2">FRAGRANCE EKSKLUSIF</span>
                  <h3 className="text-3xl md:text-5xl font-serif text-white tracking-widest uppercase font-semibold leading-none">
                    BLEU DE VANBEAUTY
                  </h3>
                  <p className="text-xs text-neutral-300 uppercase tracking-widest max-w-md mx-auto mt-4 leading-relaxed mb-6">
                    Aromatik kayu dengan sillage keemasan yang menawan. Kebebasan tiada batas dalam kemasan kemewahan maskulin.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('parfum');
                      setView('shop');
                    }}
                    className="bg-white text-black hover:bg-neutral-100 text-[10px] tracking-widest font-semibold uppercase px-10 py-3.5 transition-colors cursor-pointer"
                  >
                    TEMUKAN PARFUM TERBARU
                  </button>
                </div>
              </div>

              {/* Fine Jewelry & Accessories look (Chess game luxury mockup screenshot look) */}
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Block left */}
                <div className="flex flex-col justify-center space-y-6 p-6 bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] tracking-[0.3em] text-neutral-400 font-bold uppercase">HAUTE HORLOGERIE & JOAILLERIE</span>
                  <h3 className="text-2xl md:text-3.5xl font-serif font-semibold uppercase leading-tight text-black">
                    KOLEKSI PREMIUM VANBEAUTY
                  </h3>
                  <p className="text-xs text-neutral-500 uppercase leading-relaxed tracking-wider">
                    Kemewahan tidak hanya terletak pada apa yang terlihat, namun pada presisi detail dan standardisasi yang tinggi. Setiap keping produk kosmetik kami dirancang dengan riset bahan aktif mendalam dan uji klinis BPOM yang menjamin kesempurnaan performa.
                  </p>
                  <button
                    onClick={() => setView('shop')}
                    className="border border-black px-8 py-3 text-[10px] tracking-widest font-bold uppercase hover:bg-black hover:text-white transition-all self-start"
                  >
                    LIHAT YANG LAINNYA
                  </button>
                </div>

                {/* Block right (Image chess or luxury jewelry) */}
                <div className="aspect-[4/3] bg-neutral-900 relative overflow-hidden border border-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"
                    alt="Luxury gold jewelry"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

              </div>
            </motion.div>
          )}

          {/* VIEW 2: SHOP PAGE (The E-commerce catalog) */}
          {currentView === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-12"
            >
              <div className="text-center mb-12">
                <span className="text-[10px] tracking-[0.3em] text-neutral-400 font-bold uppercase block mb-2">LA COMTESSE COLLECTION</span>
                <h2 className="text-3xl md:text-4.5xl tracking-tight font-serif text-black font-semibold mb-3">
                  KATALOG PRODUK PREMIUM
                </h2>
                <p className="text-xs text-neutral-500 uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
                  Jelajahi seluruh rangkaian produk kecantikan, kosmetik, parfum, dan perawatan kulit VanBeauty yang terjamin berizin resmi BPOM Indonesia.
                </p>
              </div>

              {/* Category Filter Horizontal Selector */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-neutral-200 pb-6 mb-10 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                {[
                  { id: 'all', label: 'SEMUA PRODUK' },
                  { id: 'makeup', label: 'KOSMETIK & MAKEUP' },
                  { id: 'skincare', label: 'PERAWATAN KULIT' },
                  { id: 'parfum', label: 'WEWANGIAN / PARFUM' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 hover:text-black transition-colors ${
                      selectedCategory === cat.id ? 'text-black font-extrabold border-b border-black' : ''
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Products list grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {getFilteredProducts().map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-neutral-200 p-5 flex flex-col justify-between group transition-all hover:shadow-md relative"
                  >
                    {/* BPOM badge on hover or top corner */}
                    <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-800 text-[8px] tracking-widest font-bold px-2 py-0.5 border border-emerald-200 uppercase z-10">
                      ✓ BPOM APPROVED
                    </div>

                    <div className="aspect-square w-full relative overflow-hidden mb-4 bg-neutral-100 border border-neutral-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-semibold block">{product.brand}</span>
                      <h4 className="text-xs font-bold uppercase text-black line-clamp-1">{product.name}</h4>
                      <p className="text-xs font-serif text-neutral-800 font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
                      
                      <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                        <span className="text-amber-500 font-bold">★ {product.rating}</span>
                        <span>• {product.size}</span>
                      </div>

                      {/* Display Key Ingredients */}
                      <div className="pt-2">
                        <span className="text-[8px] tracking-wider text-neutral-400 uppercase block font-medium">Bahan Aktif:</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {product.keyIngredients.slice(0, 2).map((ki, idx) => (
                            <span key={idx} className="bg-neutral-50 text-neutral-600 text-[8px] tracking-wider px-1.5 py-0.5 border border-neutral-200 uppercase font-medium">
                              {ki}
                            </span>
                          ))}
                          {product.keyIngredients.length > 2 && <span className="text-[8px] text-neutral-400">+ lebih banyak</span>}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons (Detail, Compare, Buy) */}
                    <div className="grid grid-cols-3 gap-1.5 mt-5 pt-3 border-t border-neutral-100">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="border border-neutral-200 hover:border-black p-2.5 flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
                        title="Lihat Kandungan & BPOM Resmi"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => {
                          handleAddCompare(product);
                          alert(`${product.name} berhasil ditambahkan ke daftar perbandingan!`);
                        }}
                        className="border border-neutral-200 hover:border-black text-[9px] tracking-wider font-bold uppercase flex items-center justify-center hover:bg-neutral-50 transition-all text-neutral-700"
                      >
                        Banding
                      </button>
                      <button
                        onClick={() => {
                          handleAddToCart(product);
                          alert(`${product.name} dimasukkan ke tas belanja!`);
                        }}
                        className="bg-black hover:bg-neutral-800 text-white p-2.5 flex items-center justify-center transition-colors"
                        title="Tambah ke Keranjang"
                      >
                        <ShoppingBag size={13} />
                      </button>
                    </div>

                  </div>
                ))}

                {getFilteredProducts().length === 0 && (
                  <div className="col-span-4 text-center py-16 text-neutral-400 text-xs tracking-wider uppercase bg-neutral-50 border border-dashed border-neutral-300">
                    Tidak ditemukan produk kecantikan dengan kueri "{searchQuery}".
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* VIEW 3: SKIN TONE MATCH */}
          {currentView === 'skin-tone' && (
            <motion.div
              key="skin-tone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkinToneQuiz
                products={products}
                onAddCompare={handleAddCompare}
                onAddToCart={handleAddToCart}
                onViewProductDetail={(p) => setSelectedProduct(p)}
              />
            </motion.div>
          )}

          {/* VIEW 4: SKINCARE HUB */}
          {currentView === 'skincare' && (
            <motion.div
              key="skincare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkincareHub
                products={products}
                onAddToCart={handleAddToCart}
                onViewProductDetail={(p) => setSelectedProduct(p)}
              />
            </motion.div>
          )}

          {/* VIEW 5: COMPARE */}
          {currentView === 'compare' && (
            <motion.div
              key="compare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductCompare
                compareList={compareList}
                onRemoveCompare={handleRemoveCompare}
                onClearAll={handleClearCompare}
                products={products}
                onAddCompare={handleAddCompare}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Shopping Bag slide-out Drawer (Chanel Luxe Drawer Vibe) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsCartOpen(false)} />
            
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="w-screen max-w-md bg-white border-l border-neutral-200"
              >
                <div className="h-full flex flex-col justify-between">
                  
                  {/* Cart header */}
                  <div className="px-6 py-6 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="text-xs tracking-[0.25em] font-bold text-black uppercase flex items-center gap-2">
                      <ShoppingBag size={14} /> TAS BELANJA ANDA ({cart.length})
                    </h3>
                    <button onClick={() => setIsCartOpen(false)} className="text-neutral-400 hover:text-black transition-colors">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Cart items */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 border-b border-neutral-100 pb-4 relative group">
                        <button 
                          onClick={() => handleRemoveFromCart(idx)}
                          className="absolute top-0 right-0 text-neutral-400 hover:text-black transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 size={12} />
                        </button>
                        
                        <div className="w-16 h-16 bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          <img src={item.image} alt={item.name} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                        </div>
                        
                        <div className="space-y-0.5 pr-6">
                          <span className="text-[8px] text-neutral-400 tracking-widest uppercase block font-semibold">{item.brand}</span>
                          <h4 className="text-xs font-bold uppercase text-black line-clamp-1">{item.name}</h4>
                          <span className="text-[9px] text-neutral-500 uppercase tracking-wide block">BPOM: {item.bpomCode}</span>
                          <p className="text-xs font-serif text-black font-semibold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    ))}

                    {cart.length === 0 && (
                      <div className="text-center py-20 text-neutral-400 uppercase text-[10px] tracking-widest space-y-2">
                        <ShoppingBag size={24} className="mx-auto text-neutral-300 stroke-[1.2] mb-1" />
                        <span>Tas belanja Anda kosong</span>
                      </div>
                    )}
                  </div>

                  {/* Cart footer */}
                  <div className="p-6 bg-neutral-50 border-t border-neutral-200 space-y-4">
                    <div className="flex justify-between text-xs tracking-wider uppercase">
                      <span className="text-neutral-500">Estimasi Pengemasan:</span>
                      <span className="font-bold text-black">Gratis (Box Eksklusif)</span>
                    </div>
                    <div className="flex justify-between text-xs tracking-wider uppercase border-b border-neutral-200 pb-3">
                      <span className="text-neutral-500">Subtotal:</span>
                      <span className="font-bold text-neutral-900 text-sm">Rp {getCartTotal().toLocaleString('id-ID')}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (cart.length === 0) return;
                        alert('Terima kasih! Simulasi pemesanan produk kecantikan VanBeauty Anda berhasil diproses.');
                        setCart([]);
                        setIsCartOpen(false);
                      }}
                      disabled={cart.length === 0}
                      className="w-full bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-[11px] tracking-[0.2em] font-bold uppercase py-4 transition-colors text-center"
                    >
                      SELESAIKAN PEMBAYARAN
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Floating Cart trigger */}
      {cart.length > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-black text-white hover:bg-neutral-800 p-4 shadow-2xl z-40 transition-transform hover:scale-105 flex items-center gap-3.5 border border-white/20 font-sans tracking-widest font-bold text-[10px] uppercase"
        >
          <ShoppingBag size={16} />
          <span>TAS BELANJA ({cart.length})</span>
        </button>
      )}

      {/* Elegant Product Details modal popup */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            onAddCompare={handleAddCompare}
            compareList={compareList}
          />
        )}
      </AnimatePresence>

      {/* Elegant Luxury Footer */}
      <Footer />
    </div>
  );
}
