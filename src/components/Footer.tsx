import { ShieldCheck, Truck, Sparkles, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 font-sans">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-100 text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center mb-3">
            <ShieldCheck size={20} className="text-black stroke-[1.2]" />
          </div>
          <h4 className="text-xs tracking-widest font-semibold uppercase mb-1">100% Terverifikasi BPOM</h4>
          <p className="text-[10px] text-neutral-400 max-w-xs uppercase tracking-wide leading-relaxed">
            Semua produk diuji laboratorium klinis & memiliki izin BPOM resmi Indonesia.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center mb-3">
            <Sparkles size={20} className="text-black stroke-[1.2]" />
          </div>
          <h4 className="text-xs tracking-widest font-semibold uppercase mb-1">Bahan Baku Premium</h4>
          <p className="text-[10px] text-neutral-400 max-w-xs uppercase tracking-wide leading-relaxed">
            Kandungan bahan aktif berkualitas premium, bebas zat berbahaya & aman untuk kulit.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center mb-3">
            <Truck size={20} className="text-black stroke-[1.2]" />
          </div>
          <h4 className="text-xs tracking-widest font-semibold uppercase mb-1">Pengiriman Eksklusif</h4>
          <p className="text-[10px] text-neutral-400 max-w-xs uppercase tracking-wide leading-relaxed">
            Dikemas elegan dengan box eksklusif, aman sampai ke seluruh Indonesia.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center mb-3">
            <HelpCircle size={20} className="text-black stroke-[1.2]" />
          </div>
          <h4 className="text-xs tracking-widest font-semibold uppercase mb-1">Konsultasi Kulit</h4>
          <p className="text-[10px] text-neutral-400 max-w-xs uppercase tracking-wide leading-relaxed">
            Fitur Skin Tone Quiz & Skincare Hub membantu Anda menemukan kecocokan produk yang sempurna.
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
        <div className="space-y-4">
          <h3 className="text-sm tracking-[0.2em] font-serif font-bold text-black uppercase">VANBEAUTY</h3>
          <p className="text-[11px] text-neutral-500 tracking-wider leading-relaxed">
            VanBeauty menghadirkan standar kemewahan baru dalam perawatan kecantikan dan kosmetik di Indonesia. Menggabungkan inovasi teknologi Skin Tone matching dan formula bahan aktif premium berizin resmi BPOM.
          </p>
        </div>

        <div>
          <h4 className="text-xs tracking-widest font-bold uppercase text-black mb-4">LAYANAN PELANGGAN</h4>
          <ul className="space-y-2 text-[11px] tracking-wider text-neutral-500">
            <li><a href="#" className="hover:text-black transition-colors uppercase">Hubungi Kami</a></li>
            <li><a href="#" className="hover:text-black transition-colors uppercase">Pengiriman & Pengembalian</a></li>
            <li><a href="#" className="hover:text-black transition-colors uppercase">Syarat & Ketentuan</a></li>
            <li><a href="#" className="hover:text-black transition-colors uppercase">Kebijakan Privasi</a></li>
            <li><a href="#" className="hover:text-black transition-colors uppercase">Cek Nomor BPOM Resmi</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-widest font-bold uppercase text-black mb-4">KATEGORI PRODUK</h4>
          <ul className="space-y-2 text-[11px] tracking-wider text-neutral-500">
            <li><a href="#" className="hover:text-black transition-colors uppercase">Makeup Wajah</a></li>
            <li><a href="#" className="hover:text-black transition-colors uppercase">Bibir & Mata</a></li>
            <li><a href="#" className="hover:text-black transition-colors uppercase">Skincare Premium</a></li>
            <li><a href="#" className="hover:text-black transition-colors uppercase">Wewangian Eksklusif</a></li>
            <li><a href="#" className="hover:text-black transition-colors uppercase">Koleksi Terbatas</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-widest font-bold uppercase text-black mb-4">NEWSLETTER EKSKLUSIF</h4>
          <p className="text-[11px] text-neutral-500 tracking-wider mb-4 leading-relaxed uppercase">
            Daftarkan email Anda untuk menerima informasi peluncuran produk baru, penawaran khusus, dan jurnal kecantikan eksklusif.
          </p>
          <form className="flex border border-neutral-300 overflow-hidden focus-within:border-black transition-colors">
            <input 
              type="email" 
              placeholder="ALAMAT EMAIL ANDA" 
              className="flex-1 px-3 py-2 text-[10px] tracking-wider placeholder-neutral-400 focus:outline-none uppercase bg-white text-black"
              required 
            />
            <button 
              type="submit" 
              className="bg-black text-white px-4 text-[10px] tracking-widest uppercase hover:bg-neutral-800 transition-colors font-medium"
            >
              DAFTAR
            </button>
          </form>
        </div>
      </div>

      {/* Copyright and BPOM Verification Badge */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-neutral-400 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} VANBEAUTY COSMETICS. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-6">
          <span className="text-[10px] text-neutral-400 tracking-widest uppercase flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            BADAN PENGAWAS OBAT DAN MAKANAN (BPOM) RI REGISTERED
          </span>
          <span className="text-[10px] text-neutral-400 tracking-widest uppercase">
            INDONESIA
          </span>
        </div>
      </div>
    </footer>
  );
}
