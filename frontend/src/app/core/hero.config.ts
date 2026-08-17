export interface HeroConfig {
  title: string;
  subtitle: string;
  eyebrow: string;
  image: string;
  cta: string;
  ctaLink: string | null;
}

export const HERO_IMAGES: Record<string, string> = {
  home: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1920&q=100",
  categories: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1920&q=100",
  products: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1920&q=100",
  offers: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1920&q=100",
  about: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1920&q=100",
  contact: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=100",
  profile: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=100",
  welcome: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1920&q=100",
  fruits: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1920&q=100",
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1920&q=100",
  juices: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=1920&q=100",
  "dairy-eggs": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1920&q=100",
  "bakery-bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=100",
  "snacks-biscuits": "https://images.unsplash.com/photo-1575377427642-087cf684f29d?auto=format&fit=crop&w=1920&q=100",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1920&q=100",
  "pulses-grams": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1920&q=100",
  water: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1920&q=100",
  pickles: "https://images.unsplash.com/photo-1585435465945-bef5a93f8849?auto=format&fit=crop&w=1920&q=100",
  instant: "https://images.unsplash.com/photo-1628610688436-e635552020fc?auto=format&fit=crop&w=1920&q=100",
  washing: "https://images.unsplash.com/photo-1563456160-6ef088d53f31?auto=format&fit=crop&w=1920&q=100",
  "personal-care": "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1920&q=100",
  stationary: "https://images.unsplash.com/photo-1495076339972-911a8a7ecae3?auto=format&fit=crop&w=1920&q=100",
  mats: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1920&q=100",
  "frozen-icecream": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1920&q=100",
};

interface PageHeroMap {
  categories: HeroConfig;
  products: HeroConfig;
  offers: HeroConfig;
  about: HeroConfig;
  contact: HeroConfig;
  profile: HeroConfig;
}

export const PAGE_HEROES: PageHeroMap = {
  categories: { title: "catPage", subtitle: "catSub", eyebrow: "homeShopByCategory", image: HERO_IMAGES["categories"], cta: "viewAll", ctaLink: "/products" },
  products: { title: "prodPage", subtitle: "prodSub", eyebrow: "homeEyebrow", image: HERO_IMAGES["products"], cta: "", ctaLink: null },
  offers: { title: "offerPage", subtitle: "offerSub", eyebrow: "homeEyebrow", image: HERO_IMAGES["offers"], cta: "", ctaLink: null },
  about: { title: "aboutPage", subtitle: "aboutSub", eyebrow: "homeEyebrow", image: HERO_IMAGES["about"], cta: "", ctaLink: null },
  contact: { title: "contactPage", subtitle: "contactSub", eyebrow: "homeEyebrow", image: HERO_IMAGES["contact"], cta: "", ctaLink: null },
  profile: { title: "profilePage", subtitle: "profilePersonalInfo", eyebrow: "navProfile", image: HERO_IMAGES["profile"], cta: "", ctaLink: null },
};