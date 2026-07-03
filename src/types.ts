export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'makeup' | 'skincare' | 'parfum' | 'kacamata' | 'jam tangan';
  subCategory: string;
  price: number;
  image: string;
  ingredients: string[];
  keyIngredients: string[];
  bpomCode: string;
  skinType: ('oily' | 'dry' | 'combination' | 'sensitive' | 'normal')[];
  skinConcern: string[];
  description: string;
  shades?: string[];
  size: string;
  rating: number;
}

export interface SkinToneQuizAnswer {
  veinColor: 'blue_purple' | 'green' | 'mixed';
  sunReaction: 'burns' | 'tan_then_burn' | 'tan_fast';
  jewelryMatch: 'silver' | 'gold' | 'both';
  currentSkinTone: 'fair' | 'light' | 'light_medium' | 'medium' | 'tan' | 'deep';
}

export interface SkinToneResult {
  undertone: 'Cool' | 'Warm' | 'Neutral';
  skinTone: string;
  foundation: string[];
  blush: string[];
  lipstick: string[];
  concealer: string[];
  eyeshadow: string[];
}

export interface IngredientInfo {
  name: string;
  category: string;
  benefits: string[];
  details: string;
  suitability: string;
}

export interface BeforeAfterItem {
  id: string;
  userName: string;
  skinType: string;
  duration: string;
  beforeImage: string;
  afterImage: string;
  notes: string;
  likes: number;
}
