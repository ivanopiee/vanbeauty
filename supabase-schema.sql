-- ==========================================================
-- SUPABASE / POSTGRESQL DATABASE SCHEMA FOR VANBEAUTY
-- Copy and paste this script into your Supabase SQL Editor!
-- ==========================================================

-- 1. Create the Products Table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  sub_category VARCHAR(100),
  price NUMERIC(12, 2) NOT NULL,
  image TEXT,
  ingredients TEXT[] NOT NULL,
  key_ingredients TEXT[] NOT NULL,
  bpom_code VARCHAR(50) NOT NULL,
  skin_type TEXT[] NOT NULL,
  skin_concern TEXT[] NOT NULL,
  description TEXT,
  shades TEXT[],
  size VARCHAR(20),
  rating NUMERIC(3, 2) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the Before-After Gallery Table
CREATE TABLE IF NOT EXISTS before_after_gallery (
  id VARCHAR(50) PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  skin_type VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  before_image TEXT NOT NULL,
  after_image TEXT NOT NULL,
  notes TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE before_after_gallery ENABLE ROW LEVEL SECURITY;

-- Create Policies for Products (Everyone can view, admins can write)
CREATE POLICY "Allow public read-only access to products" ON products
  FOR SELECT TO public USING (true);

-- Create Policies for Before-After Gallery (Everyone can read, everyone can submit/insert)
CREATE POLICY "Allow public read access to gallery" ON before_after_gallery
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public inserts to gallery" ON before_after_gallery
  FOR INSERT TO public WITH CHECK (true);

-- ==========================================================
-- SEED DATA INSERTS
-- ==========================================================

-- Insert Products
INSERT INTO products (id, name, brand, category, sub_category, price, image, ingredients, key_ingredients, bpom_code, skin_type, skin_concern, description, shades, size, rating)
VALUES
(
  'p1',
  'Rouge Allure Velvet Extreme',
  'VanBeauty Luxury',
  'makeup',
  'Lipstick',
  685000,
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600',
  ARRAY['Octyldodecanol', 'Synthetic Wax', 'Silica', 'Diisostearyl Malate', 'Prunus Amygdalus Dulcis (Sweet Almond) Oil', 'Butyrospermum Parkii (Shea) Butter', 'Tocopherol (Vitamin E)', 'Titanium Dioxide (CI 77891)', 'Iron Oxides (CI 77491, CI 77492, CI 77499)'],
  ARRAY['Sweet Almond Oil', 'Shea Butter', 'Vitamin E'],
  'NA18231302561',
  ARRAY['normal', 'dry', 'oily', 'combination', 'sensitive'],
  ARRAY['bibir kering', 'warna tidak merata'],
  'Lipstik matte ultra-nyaman dengan pigmentasi tinggi yang memberikan hasil akhir velvety-matte namun tetap menjaga bibir terhidrasi sepanjang hari berkat ekstrak almond manis dan shea butter.',
  ARRAY['Terracotta', 'Nude Peach', 'Brick Red', 'Classic Crimson'],
  '3.5g',
  4.80
),
(
  'p2',
  'Ultra Le Teint Velvet Foundation',
  'VanBeauty Luxury',
  'makeup',
  'Foundation',
  940000,
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600',
  ARRAY['Water (Aqua)', 'Dimethicone', 'Isododecane', 'Silica', 'Alcohol Denat.', 'Butylene Glycol', 'Glycerin', 'Laminaria Ochroleuca Extract', 'Zinc Oxide', 'Phenoxyethanol'],
  ARRAY['Laminaria Ochroleuca Extract', 'Glycerin', 'Zinc Oxide'],
  'NA18220300185',
  ARRAY['oily', 'combination', 'normal'],
  ARRAY['minyak berlebih', 'pori besar', 'noda hitam'],
  'Foundation cair berbobot ringan dengan hasil akhir semi-matte alami. Menyamarkan ketidaksempurnaan kulit, meratakan warna kulit dengan ketahanan hingga 12 jam, bebas kilap.',
  ARRAY['Fair Beige', 'Warm Beige', 'Golden Beige', 'Tan Honey', 'Deep Amber'],
  '30ml',
  4.70
),
(
  'p3',
  'Le Correcteur Velvet Concealer',
  'VanBeauty Luxury',
  'makeup',
  'Concealer',
  610000,
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600',
  ARRAY['Water', 'Cyclopentasiloxane', 'Glycerin', 'Peg-9 Polydimethylsiloxyethyl Dimethicone', 'Niacinamide', 'Squalane', 'Alumina', 'Titanium Dioxide'],
  ARRAY['Niacinamide', 'Squalane', 'Glycerin'],
  'NA18230300947',
  ARRAY['normal', 'dry', 'combination', 'sensitive', 'oily'],
  ARRAY['mata panda', 'bekas jerawat', 'kemerahan'],
  'Concealer cair dengan coverage medium-to-full yang tahan lama. Formula diperkaya Niacinamide dan Squalane untuk mencerahkan noda hitam serta melembabkan area bawah mata tanpa cracking.',
  ARRAY['Light Ivory', 'Warm Beige', 'Honey Gold', 'Tan Bronze'],
  '7.5g',
  4.60
),
(
  'p4',
  'Joues Contraste Powder Blush',
  'VanBeauty Luxury',
  'makeup',
  'Blush',
  795000,
  'https://images.unsplash.com/photo-1631730359575-38e4755d772b?auto=format&fit=crop&q=80&w=600',
  ARRAY['Talc', 'Mica', 'Zea Mays (Corn) Starch', 'Octyldodecyl Stearoyl Stearate', 'Simmondsia Chinensis (Jojoba) Seed Oil', 'Tocopheryl Acetate', 'Dimethicone'],
  ARRAY['Jojoba Seed Oil', 'Vitamin E'],
  'NA18211204899',
  ARRAY['normal', 'dry', 'combination', 'oily', 'sensitive'],
  ARRAY['pipi pucat'],
  'Perona pipi bubuk ikonik yang memberikan sentuhan warna segar berkilau alami. Teksturnya yang halus sangat mudah dibaurkan dan dilapisi minyak jojoba pelindung kulit.',
  ARRAY['Rosewood', 'Coral Glow', 'Peach Pink', 'Golden Amber'],
  '4g',
  4.90
),
(
  'p5',
  'Hydra Beauty Micro Sérum',
  'VanBeauty Organics',
  'skincare',
  'Serum',
  1650000,
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
  ARRAY['Water', 'Glycerin', 'Camellia Japonica Flower Extract', 'Zingiber Officinale (Ginger) Root Extract', 'Sodium Hyaluronate (Hyaluronic Acid)', 'Butylene Glycol', 'Ammonium Acryloyldimethyltaurate/Vp Copolymer', 'Phenoxyethanol'],
  ARRAY['Camellia Alba PFA', 'Blue Ginger PFA', 'Hyaluronic Acid'],
  'NA18230103445',
  ARRAY['dry', 'normal', 'combination', 'sensitive'],
  ARRAY['kulit kering', 'dehidrasi', 'kusam'],
  'Serum pelembab intensif pertama dengan mikro-tetesan Camellia. Memberikan hidrasi mendalam berkat hidrolisat botani camellia alba yang dipatenkan dan ekstrak jahe biru sebagai antioksidan protektif.',
  NULL,
  '30ml',
  4.90
),
(
  'p6',
  'L’Extrait Supreme Youth Retinol Cream',
  'VanBeauty Organics',
  'skincare',
  'Moisturizer',
  2100000,
  'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600',
  ARRAY['Water', 'Caprylic/Capric Triglyceride', 'Squalane', 'Retinol (0.1%)', 'Ceramide NP', 'Lecithin', 'Sodium Hyaluronate', 'Butyrospermum Parkii Butter', 'Centella Asiatica Extract', 'Adenosine'],
  ARRAY['Retinol', 'Ceramide NP', 'Centella Asiatica'],
  'NA18222000091',
  ARRAY['dry', 'normal', 'combination'],
  ARRAY['kerutan halus', 'bekas jerawat', 'kendur'],
  'Krim malam anti-aging premium yang menggabungkan kemurnian Retinol aktif dengan kekuatan restoratif Ceramide NP dan Centella Asiatica untuk mengencangkan kulit sekaligus meminimalisir iritasi.',
  NULL,
  '50ml',
  4.80
),
(
  'p7',
  'The Brightening Solution Niacinamide',
  'VanBeauty Organics',
  'skincare',
  'Serum',
  450000,
  'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600',
  ARRAY['Water', 'Niacinamide (10%)', 'Zinc PCA (1%)', 'Glycerin', 'Centella Asiatica Extract', 'Allantoin', 'Xanthan Gum', 'Ethylhexylglycerin'],
  ARRAY['Niacinamide 10%', 'Zinc PCA 1%', 'Cica Extract'],
  'NA18231901122',
  ARRAY['oily', 'combination', 'normal', 'sensitive'],
  ARRAY['jerawat', 'bekas jerawat', 'kusam', 'minyak berlebih'],
  'Serum konsentrat mencerahkan dengan 10% Niacinamide murni dan 1% Zinc PCA. Membantu menyamarkan noda hitam sisa jerawat, mengontrol kelebihan produksi sebum, dan meredakan jerawat aktif.',
  NULL,
  '20ml',
  4.70
),
(
  'p8',
  'Gentle Salicylic Acne Cleanser',
  'VanBeauty Organics',
  'skincare',
  'Cleanser',
  295000,
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
  ARRAY['Water', 'Cocamidopropyl Betaine', 'Sodium Lauroyl Methyl Isethionate', 'Salicylic Acid (1.5%)', 'Melaleuca Alternifolia (Tea Tree) Leaf Oil', 'Centella Asiatica Extract', 'Glycerin', 'Allantoin'],
  ARRAY['Salicylic Acid BHA', 'Tea Tree Oil', 'Allantoin'],
  'NA18221200421',
  ARRAY['oily', 'combination', 'sensitive'],
  ARRAY['jerawat', 'pori besar', 'komedo'],
  'Pembersih wajah berbusa lembut bebas sulfat dengan kandungan Salicylic Acid 1.5% dan minyak Tea Tree asli. Melarutkan kotoran penyumbat pori tanpa membuat kulit terasa kering tertarik.',
  NULL,
  '150ml',
  4.50
),
(
  'p9',
  'Bleu Intense Eau de Parfum',
  'VanBeauty Prestige',
  'parfum',
  'Eau De Parfum',
  2250000,
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
  ARRAY['Alcohol Denat.', 'Parfum (Fragrance)', 'Water (Aqua)', 'Limonene', 'Linalool', 'Citronellol', 'Coumarin', 'Citral'],
  ARRAY['Cedar Wood', 'Sandalwood', 'Citrus Accord'],
  'NA18210600234',
  ARRAY['normal'],
  ARRAY[]::TEXT[],
  'Wewangian aromatik-kayu yang sensual dan berani dengan perpaduan citrus yang segar, cedar kering, serta kehangatan sandalwood dari Kaledonia Baru. Memberikan aura elegan nan misterius.',
  NULL,
  '100ml',
  4.90
),
(
  'p10',
  'N°5 L’Eau Sublime',
  'VanBeauty Prestige',
  'parfum',
  'Eau De Parfum',
  2650000,
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
  ARRAY['Alcohol', 'Fragrance', 'Water', 'Linalool', 'Benzyl Salicylate', 'Limonene', 'Alpha-Isomethyl Ionone', 'Geraniol', 'Coumarin'],
  ARRAY['Aldehydes', 'Ylang-Ylang', 'May Rose', 'Jasmine'],
  'NA18220600122',
  ARRAY['normal'],
  ARRAY[]::TEXT[],
  'Interpretasi modern dari parfum legendaris dunia. Mengedepankan citrus bersemangat dipadu kemewahan buket bunga May Rose, Jasmine, dan Ylang-Ylang dengan sillage aldehida yang lembut.',
  NULL,
  '100ml',
  5.00
);

-- Insert Before & After Gallery Items
INSERT INTO before_after_gallery (id, user_name, skin_type, duration, before_image, after_image, notes, likes)
VALUES
(
  'ba1',
  'Sarah Amanda',
  'Oily & Acne-Prone',
  '4 Weeks',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
  'Berkat The Brightening Solution Niacinamide Serum dan Gentle Salicylic Acid Acne Cleanser, jerawat aktif kempes dalam 1 minggu, dan bekas kehitaman memudar drastis setelah 1 bulan pemakaian rutin!',
  42
),
(
  'ba2',
  'Devi Lestari',
  'Dry & Dehydrated',
  '2 Weeks',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300',
  'Kulit terasa sangat kering bersisik di area hidung dan dahi. Setelah rutin pakai Hydra Beauty Micro Sérum pagi dan malam, kulit saya jadi super lembab, plumpy, dan glowy alami.',
  28
);
