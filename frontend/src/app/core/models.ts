export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Region {
  code: string;
  name: string;
  name_ar: string;
  flag: string;
  currency: string;
  currency_symbol: string;
  delivery_fee?: number;
  free_delivery_min?: number;
  timezone?: string;
}

export interface Language {
  code: string;
  name: string;
  native: string;
  dir: "ltr" | "rtl";
  font: string;
}

export interface Section {
  key: string;
  label_en: string;
  label_ar: string;
  label_ml: string;
  label_ta: string;
}

export interface Category {
  id: number;
  slug: string;
  icon: string;
  name_en: string;
  name_ar: string;
  name_ml: string;
  name_ta: string;
  desc_en?: string;
  desc_ar?: string;
  image?: string;
}

export interface Product {
   id: number;
   category_id: number;
   price: number;
   unit: string;
   icon: string;
   image?: string;
   brand?: string;
   origin?: string;
   badge?: string | null;
   name_en: string;
   name_ar: string;
   name_ml: string;
   name_ta: string;
   desc_en?: string;
   desc_ar?: string;
 }

export interface BrandValue {
  key: string;
  icon: string;
  label_en: string;
  label_ar: string;
  desc_en: string;
  desc_ar: string;
}

export interface Offer {
  product_id: number;
  percent: number;
  valid_until: string;
  label_en: string;
  label_ar: string;
}

export interface StoreLocation {
  id: number;
  name: string;
  name_ar: string;
  address: string;
  address_ar: string;
  phone: string;
  email: string;
  hours: Record<string, string>;
  services: string[];
  coordinates: { lat: number; lng: number };
}

export interface DeliveryOption {
  method: string;
  label_en: string;
  label_ar: string;
  desc_en: string;
  desc_ar: string;
  fee: number;
  free_above: number | null;
  estimated_days: string;
}

export interface SavedAddress {
  label: string;
  label_ar: string;
  address: string;
  address_ar: string;
  is_default: boolean;
}

export interface UserPreferences {
  language: string;
  region: string;
  notifications: boolean;
  marketing_emails: boolean;
  weekly_newsletter: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items?: number;
  delivery_method?: string;
  estimated_delivery?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  name_ar?: string;
  email: string;
  phone: string;
  phone_alt?: string;
  address: string;
  address_ar?: string;
  area?: string;
  city?: string;
  loyalty_points: number;
  loyalty_tier?: string;
  member_since: string;
  birthday?: string;
  preferences?: UserPreferences;
  saved_addresses?: SavedAddress[];
  orders: Order[];
}

export interface AuthUser {
  id: number;
  name: string;
  name_ar?: string;
  email: string;
  phone: string;
  token: string;
}

export interface Testimonial {
  id: number;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  rating: number;
  text_en: string;
  text_ar: string;
  avatar: string;
}

export interface FaqItem {
  id: number;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
}

export interface TeamMember {
  id: number;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  bio_en: string;
  bio_ar: string;
  avatar: string;
}

export interface NewsPost {
  id: number;
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  date: string;
  image: string;
  category: string;
}

export interface PromoBanner {
  id: number;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  image: string;
  link: string;
  badge_en: string;
  badge_ar: string;
  bg_color: string;
}
