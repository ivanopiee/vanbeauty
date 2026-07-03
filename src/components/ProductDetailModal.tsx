import { X, ShieldCheck, ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddCompare: (product: Product) => void;
  compareList: Product[];
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onAddCompare,
  compareList
}: ProductDetailModalProps) {
  if (!product) return null;

  const isAlreadyComparing = compareList.some(p => p.id === product.id);

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-neutral-300 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative rounded-none p-6 md:p-8 shadow-2xl"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {/* Image and quick facts */}
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-100 overflow-hidden border border-neutral-200">
              <img 
                src={product.image} 
                alt={product.name} 
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* Certifications Box */}
            <div className="bg-emerald-50/50 border border-emerald-200 p-4 flex items-start gap-3">
              <ShieldCheck className="text-emerald-700 mt-0.5 shrink-0" size={18} />
              <div>
                <h5 className="text-[10px] tracking-wider text-emerald-800 font-bold uppercase">SERTIFIKASI BPOM RESMI</h5>
                <p className="text-xs font-bold text-neutral-900 mt-0.5 tracking-wider">{product.bpomCode}</p>
                <p className="text-[10px] text-neutral-500 mt-1 uppercase leading-normal">
                  Kandungan formula ini telah diverifikasi, terdaftar resmi di database Badan Pengawas Obat dan Makanan RI, dan 100% aman digunakan sesuai standar klinis.
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[9px] tracking-[0.25em] text-neutral-400 uppercase font-bold block">{product.brand}</span>
                <h3 className="text-xl font-bold uppercase text-black tracking-wide mt-1">{product.name}</h3>
                <span className="inline-block bg-neutral-100 text-neutral-600 text-[9px] font-bold px-2.5 py-1 tracking-wider uppercase mt-2">
                  {product.subCategory}
                </span>
              </div>

              <div>
                <span className="text-[9px] tracking-widest text-neutral-400 block uppercase font-medium">HARGA RESMI</span>
                <p className="text-xl font-serif font-bold text-black">Rp {product.price.toLocaleString('id-ID')}</p>
              </div>

              <div>
                <span className="text-[9px] tracking-widest text-neutral-400 block uppercase font-medium">DESKRIPSI FORMULA</span>
                <p className="text-xs text-neutral-600 leading-relaxed uppercase tracking-wide mt-1">
                  {product.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-[9px] tracking-widest text-neutral-400 block uppercase font-semibold">KANDUNGAN BAHAN AKTIF (KEY INGREDIENTS):</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.keyIngredients.map((item, idx) => (
                    <span key={idx} className="bg-neutral-900 text-white text-[9px] tracking-wider font-bold px-3 py-1 uppercase">
                      ★ {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] tracking-widest text-neutral-400 block uppercase font-semibold">TIPE KULIT & KEBUTUHAN:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.skinType.map((item, idx) => (
                    <span key={idx} className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-[9px] tracking-wider px-2.5 py-1 uppercase font-bold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-neutral-100">
                <span className="text-[9px] tracking-widest text-neutral-400 block uppercase font-semibold">KANDUNGAN LENGKAP (INGREDIENTS LIST):</span>
                <p className="text-[10px] text-neutral-500 normal-case leading-relaxed font-sans font-medium tracking-normal">
                  {product.ingredients.join(', ')}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  if (isAlreadyComparing) {
                    alert('Produk sudah ada di daftar perbandingan!');
                    return;
                  }
                  onAddCompare(product);
                  alert(`${product.name} dimasukkan ke daftar perbandingan!`);
                }}
                className={`py-3.5 text-xs tracking-widest font-bold uppercase border transition-all flex items-center justify-center gap-1.5 ${
                  isAlreadyComparing 
                    ? 'bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed'
                    : 'bg-white border-black text-black hover:bg-neutral-50'
                }`}
              >
                <Heart size={14} /> {isAlreadyComparing ? 'SUDAH DIBANDINGKAN' : 'BANDINGKAN'}
              </button>
              
              <button
                onClick={() => {
                  onAddToCart(product);
                  alert(`${product.name} dimasukkan ke tas belanja!`);
                }}
                className="bg-black hover:bg-neutral-800 text-white py-3.5 text-xs tracking-widest font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingBag size={14} /> MASUKKAN TAS
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
