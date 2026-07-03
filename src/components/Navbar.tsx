import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  cartCount: number;
  wishlistCount: number;
  onSearch: (query: string) => void;
  isSupabaseConnected: boolean;
}

export default function Navbar({
  currentView,
  setView,
  cartCount,
  wishlistCount,
  onSearch,
  isSupabaseConnected
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'shop', label: 'SHOP' },
    { id: 'skin-tone', label: 'SKIN TONE MATCH' },
    { id: 'skincare', label: 'SKINCARE HUB' },
    { id: 'compare', label: 'COMPARE' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleNavClick = (viewId: string) => {
    setView(viewId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 font-sans">
      {/* Supabase Status Banner */}
      {!isSupabaseConnected && (
        <div className="bg-neutral-900 text-white text-[10px] py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2">
          <span>Mode Preview Offline (Local Storage)</span>
          <span className="opacity-50">|</span>
          <button 
            onClick={() => alert("Lihat petunjuk di bagian akhir penjelasan saya di kolom chat untuk cara mengaktifkan koneksi Supabase Anda!")}
            className="underline hover:text-gray-300 font-medium transition-colors"
          >
            Aktifkan Database Supabase
          </button>
        </div>
      )}

      {/* Primary Brand Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        {/* Left padding or Menu on mobile */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-gray-900 hover:text-neutral-600 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <div className="hidden md:flex w-24"></div>

        {/* Central Luxury Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="text-center focus:outline-none"
        >
          <h1 className="text-2xl md:text-3.5xl tracking-[0.25em] font-serif font-semibold text-black hover:opacity-85 transition-opacity">
            VANBEAUTY
          </h1>
          <p className="text-[8px] md:text-[9px] tracking-[0.4em] text-neutral-500 uppercase mt-1 font-sans">
            haute perfumerie & cosmétiques
          </p>
        </button>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 md:gap-5">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            className="text-gray-900 hover:text-neutral-500 transition-colors p-1"
            title="Cari Produk"
          >
            <Search size={18} className="stroke-[1.5]" />
          </button>
          
          <button 
            onClick={() => handleNavClick('compare')}
            className="relative text-gray-900 hover:text-neutral-500 transition-colors p-1"
            title="Bandingkan Produk"
          >
            <Heart size={18} className="stroke-[1.5]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-medium">
                {wishlistCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => handleNavClick('shop')}
            className="relative text-gray-900 hover:text-neutral-500 transition-colors p-1"
            title="Shopping Bag"
          >
            <ShoppingBag size={18} className="stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-medium">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Chanel Screenshot Look) */}
      <nav className="hidden md:block border-t border-gray-100 py-3 bg-white">
        <ul className="flex items-center justify-center gap-10 text-[11px] tracking-[0.2em] font-medium text-neutral-800">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 cursor-pointer transition-colors hover:text-black uppercase ${
                  currentView === item.id ? 'text-black font-semibold' : 'text-neutral-500'
                }`}
              >
                {item.label}
                {currentView === item.id && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-black"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Dynamic Search Dropdown */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-neutral-50 border-t border-gray-100"
          >
            <div className="max-w-4xl mx-auto px-6 py-4">
              <form onSubmit={handleSearchSubmit} className="flex gap-3">
                <input
                  type="text"
                  placeholder="CARI FORMULA KECANTIKAN, INGREDIENTS, ATAU KODE BPOM..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearch(e.target.value);
                  }}
                  className="flex-1 bg-white border border-neutral-300 text-xs tracking-wider px-4 py-3 focus:outline-none focus:border-black uppercase font-sans placeholder-neutral-400"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="bg-black text-white text-xs tracking-widest px-6 py-3 hover:bg-neutral-800 transition-colors uppercase font-medium"
                >
                  Cari
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="border border-neutral-300 px-4 py-3 hover:bg-gray-100 transition-colors text-xs text-neutral-600 uppercase"
                >
                  Batal
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-0 top-[110px] bg-white z-40 md:hidden flex flex-col border-r border-gray-100 w-4/5 shadow-xl"
          >
            <div className="flex flex-col p-6 gap-6 text-sm tracking-widest font-medium text-neutral-800">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2 border-b border-neutral-100 uppercase font-sans ${
                    currentView === item.id ? 'text-black font-semibold pl-2 border-l-2 border-l-black' : 'text-neutral-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="mt-auto p-6 bg-neutral-50 border-t border-neutral-100">
              <p className="text-[10px] tracking-widest text-neutral-400 uppercase text-center font-sans">
                VanBeauty Customer Care<br />
                support@vanbeauty.com
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
