import { Sparkles, Trash2, Plus, ArrowRight, HelpCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCompareProps {
  compareList: Product[];
  onRemoveCompare: (productId: string) => void;
  onClearAll: () => void;
  products: Product[];
  onAddCompare: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCompare({
  compareList,
  onRemoveCompare,
  onClearAll,
  products,
  onAddCompare,
  onAddToCart
}: ProductCompareProps) {

  // Products not already in compare list
  const availableToCompare = products.filter(
    p => !compareList.some(comp => comp.id === p.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 font-sans">
      {/* Editorial Header */}
      <div className="text-center mb-10">
        <span className="text-[10px] tracking-[0.3em] text-neutral-400 font-bold uppercase block mb-2">FORMULA CLINICAL COMPARISON</span>
        <h2 className="text-3xl md:text-4.5xl tracking-tight font-serif text-black font-semibold mb-3">
          PERBANDINGAN PRODUK
        </h2>
        <p className="text-xs text-neutral-500 uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
          Bandingkan kandungan aktif, harga, kesesuaian biologis kulit, dan sertifikasi BPOM resmi secara berdampingan untuk keputusan kecantikan yang cerdas.
        </p>
      </div>

      {compareList.length === 0 ? (
        // Empty state with quick add options
        <div className="space-y-8">
          <div className="bg-neutral-50 border border-neutral-200 border-dashed p-12 text-center">
            <HelpCircle size={32} className="mx-auto text-neutral-400 stroke-[1.2] mb-3" />
            <h3 className="text-xs tracking-[0.2em] font-bold text-neutral-800 uppercase">DAFTAR PERBANDINGAN ANDA KOSONG</h3>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wider mt-2 max-w-md mx-auto">
              Silakan cari dan pilih hingga 3 produk dari daftar produk di bawah atau dari toko kami untuk melihat detail perbandingan secara berdampingan.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-widest font-bold uppercase text-black mb-4">REKOMENDASI PRODUK UNTUK DIBANDINGKAN:</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {products.slice(0, 4).map((p) => (
                <div key={p.id} className="bg-white border border-neutral-200 p-4 flex flex-col justify-between group">
                  <div className="aspect-square bg-neutral-50 overflow-hidden relative mb-3">
                    <img src={p.image} alt={p.name} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-400 tracking-widest uppercase block font-semibold">{p.brand}</span>
                    <h5 className="text-xs font-bold uppercase text-black line-clamp-1 mt-0.5">{p.name}</h5>
                    <p className="text-[10px] font-serif font-medium text-neutral-800">Rp {p.price.toLocaleString('id-ID')}</p>
                  </div>
                  <button
                    onClick={() => onAddCompare(p)}
                    className="mt-3 w-full border border-black hover:bg-black hover:text-white py-2 text-[9px] tracking-widest font-bold uppercase transition-all"
                  >
                    + BANDINGKAN
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Comparison Matrix
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <span className="text-xs tracking-widest text-neutral-500 uppercase">
              Membandingkan <span className="font-bold text-black">{compareList.length} dari 3</span> Produk Maksimal
            </span>
            <button 
              onClick={onClearAll}
              className="text-[10px] tracking-widest font-bold uppercase text-neutral-400 hover:text-black border-b border-transparent hover:border-black transition-all"
            >
              Kosongkan Semua
            </button>
          </div>

          {/* Selector block if comparison has room */}
          {compareList.length < 3 && (
            <div className="bg-neutral-50 p-4 border border-neutral-200 flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs tracking-wider text-neutral-700 uppercase">
                Tambahkan produk lain untuk melengkapi perbandingan:
              </span>
              <div className="flex gap-2">
                <select 
                  onChange={(e) => {
                    const found = products.find(p => p.id === e.target.value);
                    if (found) {
                      onAddCompare(found);
                      e.target.value = '';
                    }
                  }}
                  className="bg-white border border-neutral-300 text-[10px] tracking-wider uppercase px-4 py-2 font-semibold focus:outline-none focus:border-black"
                >
                  <option value="">Pilih Produk...</option>
                  {availableToCompare.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.brand.toUpperCase()}] - {p.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Matrix table */}
          <div className="bg-white border border-neutral-200 overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="w-1/4 p-6 text-[10px] tracking-widest text-neutral-400 uppercase font-bold">Spesifikasi Formula</th>
                  {compareList.map((product) => (
                    <th key={product.id} className="p-6 border-l border-neutral-200 w-1/4 relative group">
                      <button 
                        onClick={() => onRemoveCompare(product.id)}
                        className="absolute top-4 right-4 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Hapus dari perbandingan"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="space-y-3">
                        <div className="aspect-square bg-neutral-100 w-24 mx-auto overflow-hidden border border-neutral-100">
                          <img src={product.image} alt={product.name} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                        </div>
                        <div className="text-center">
                          <span className="text-[8px] text-neutral-400 tracking-widest uppercase block font-semibold">{product.brand}</span>
                          <h4 className="text-xs font-bold uppercase text-black tracking-wide mt-1 line-clamp-2">{product.name}</h4>
                          <p className="text-xs font-serif text-neutral-800 font-bold mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Empty slots for visual balance */}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <th key={idx} className="p-6 border-l border-neutral-200 text-center text-neutral-300 w-1/4 bg-neutral-50/50">
                      <div className="space-y-2 py-8">
                        <Plus size={20} className="mx-auto opacity-30" />
                        <span className="text-[9px] tracking-widest uppercase block text-neutral-400">Slot Kosong</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[11px] tracking-wider uppercase text-neutral-600">
                {/* Category */}
                <tr className="border-b border-neutral-100">
                  <td className="p-4 pl-6 font-bold text-neutral-900 bg-neutral-50/30">KATEGORI</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-l border-neutral-100">{product.subCategory}</td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <td key={idx} className="p-4 border-l border-neutral-100 bg-neutral-50/10"></td>
                  ))}
                </tr>

                {/* BPOM Code */}
                <tr className="border-b border-neutral-100">
                  <td className="p-4 pl-6 font-bold text-neutral-900 bg-neutral-50/30">SERTIFIKASI BPOM</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-l border-neutral-100">
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] px-2 py-1 font-bold rounded-sm">
                        ✓ {product.bpomCode}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <td key={idx} className="p-4 border-l border-neutral-100 bg-neutral-50/10"></td>
                  ))}
                </tr>

                {/* Size */}
                <tr className="border-b border-neutral-100">
                  <td className="p-4 pl-6 font-bold text-neutral-900 bg-neutral-50/30">UKURAN BERSIH</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-l border-neutral-100 font-bold text-black">{product.size}</td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <td key={idx} className="p-4 border-l border-neutral-100 bg-neutral-50/10"></td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-b border-neutral-100">
                  <td className="p-4 pl-6 font-bold text-neutral-900 bg-neutral-50/30">RATING KEPUASAN</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-l border-neutral-100 text-amber-500 font-bold">
                      ★ {product.rating} / 5.0
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <td key={idx} className="p-4 border-l border-neutral-100 bg-neutral-50/10"></td>
                  ))}
                </tr>

                {/* Key Active Ingredients */}
                <tr className="border-b border-neutral-100">
                  <td className="p-4 pl-6 font-bold text-neutral-900 bg-neutral-50/30">BAHAN AKTIF UTAMA</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-l border-neutral-100 text-black">
                      <div className="flex flex-wrap gap-1">
                        {product.keyIngredients.map((ki, idx) => (
                          <span key={idx} className="bg-neutral-100 border border-neutral-200 text-[9px] px-1.5 py-0.5">
                            {ki}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <td key={idx} className="p-4 border-l border-neutral-100 bg-neutral-50/10"></td>
                  ))}
                </tr>

                {/* Skin Type Suitability */}
                <tr className="border-b border-neutral-100">
                  <td className="p-4 pl-6 font-bold text-neutral-900 bg-neutral-50/30">TIPE KULIT COCOK</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-l border-neutral-100">
                      <div className="flex flex-wrap gap-1">
                        {product.skinType.map((st, idx) => (
                          <span key={idx} className="bg-neutral-100 text-[9px] px-2 py-0.5 font-bold">
                            {st}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <td key={idx} className="p-4 border-l border-neutral-100 bg-neutral-50/10"></td>
                  ))}
                </tr>

                {/* Skin Concerns Solved */}
                <tr className="border-b border-neutral-100">
                  <td className="p-4 pl-6 font-bold text-neutral-900 bg-neutral-50/30">TARGET MASALAH</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-l border-neutral-100">
                      <div className="flex flex-wrap gap-1">
                        {product.skinConcern.length > 0 ? (
                          product.skinConcern.map((sc, idx) => (
                            <span key={idx} className="bg-neutral-50 border border-neutral-200 text-[9px] px-1.5 py-0.5 text-neutral-500">
                              {sc}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] text-neutral-400">UMUM / SEGALA KONDISI</span>
                        )}
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <td key={idx} className="p-4 border-l border-neutral-100 bg-neutral-50/10"></td>
                  ))}
                </tr>

                {/* Full Ingredients List */}
                <tr className="border-b border-neutral-100">
                  <td className="p-4 pl-6 font-bold text-neutral-900 bg-neutral-50/30">KANDUNGAN LENGKAP</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-l border-neutral-100 text-[10px] normal-case text-neutral-500 tracking-normal leading-relaxed font-sans">
                      {product.ingredients.join(', ')}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <td key={idx} className="p-4 border-l border-neutral-100 bg-neutral-50/10"></td>
                  ))}
                </tr>

                {/* Buy Button row */}
                <tr>
                  <td className="p-4 pl-6 bg-neutral-50/30"></td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-6 border-l border-neutral-100 text-center">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          alert(`${product.name} dimasukkan ke tas belanja!`);
                        }}
                        className="bg-black hover:bg-neutral-800 text-white text-[10px] tracking-widest uppercase font-bold py-3.5 px-6 w-full"
                      >
                        Beli Sekarang
                      </button>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <td key={idx} className="p-6 border-l border-neutral-100 bg-neutral-50/10"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
