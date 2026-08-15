# Bab Al Awir — Premium Home Page Redesign Plan

## Goal
Redesign ONLY the home page (`frontend/src/app/features/home/`) to Grogin-level marketplace density and polish, branded with the Bab Al Awir green system. All other routes and the layout wrapper remain untouched.

## Locked Decisions
- **Product card**: extend `shared/product-card` with optional inputs (Option A).
- **Color**: add new Bab Al Awir green tokens in `styles.scss`; preserve all existing tokens.
- **Announcement**: layout's existing `.promo-bar` serves this role; no second bar in home.
- **Side cart**: already implemented in `layout.html` as `<app-cart>` slide-out drawer; do not rebuild.
- **Loading**: per-section skeleton placeholders that disappear independently as data arrives.
- **Module**: keep `standalone: false` + `HomeModule`.
- **Images**: all external Unsplash URLs matching actual content; no local assets.

## Files To Change
1. `frontend/src/app/features/home/home.ts`
2. `frontend/src/app/features/home/home.html`
3. `frontend/src/app/features/home/home.scss`
4. `frontend/src/styles.scss` (add green tokens)
5. `frontend/src/app/shared/product-card/product-card.ts`
6. `frontend/src/app/shared/product-card/product-card.html`
7. `frontend/src/app/shared/product-card/product-card.scss`

---

## Step 1 — Global Tokens (`styles.scss`)

Inside `:root`, **add** these aliases without touching existing ones:

```scss
--green-primary: #15803D;
--green-dark: #166534;
--green-deep: #14532D;
--green-light: #DCFCE7;
--green-very-light: #F0FDF4;
--surface-alt: #F8FAF9;
--ink: #17201A;
--ink-secondary: #66736B;
--ink-muted: #8A958E;
--line: #E5EAE7;
```

Existing tokens (`--green: #1f7a3d`, `--accent: #ff7a18`, `--navy`, etc.) remain untouched. Other pages continue using them. The home page explicitly references the new tokens.

---

## Step 2 — Shared Product Card Extension

### New `@Input` / `@Output` bindings
```ts
oldPrice = input<number | null>(null);
discountPercent = input<number | null>(null);
stockText = input<string | null>(null);
showAddToCart = input<boolean>(false);
showQuickView = input<boolean>(false);
quickView = output<Product>();
```

`addToCart` output already exists; reuse it.

### Template additions (after `.product-card__foot`)
```html
@if (oldPrice() || discountPercent()) {
  <div class="product-card__pricing-row">
    @if (oldPrice()) {
      <span class="product-card__old-price">{{ symbol() }} {{ oldPrice() | number: '1.2-2' }}</span>
    }
    @if (discountPercent()) {
      <span class="product-card__discount">-{{ discountPercent() }}%</span>
    }
  </div>
}
@if (stockText()) {
  <span class="product-card__stock">{{ stockText() }}</span>
}
<div class="product-card__actions">
  @if (showAddToCart()) {
    <button type="button" class="product-card__add-btn" (click)="onAddToCart()">+ Add</button>
  }
  @if (showQuickView()) {
    <button type="button" class="product-card__quick-view" (click)="quickView.emit(product())">Quick View</button>
  }
</div>
```

### Styles
- `.product-card__pricing-row`: `display: flex; align-items: baseline; gap: 8px;`
- `.product-card__old-price`: `text-decoration: line-through; color: var(--ink-muted); font-size: 13px;`
- `.product-card__discount`: `background: var(--green-light); color: var(--green-dark); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-pill);`
- `.product-card__stock`: `color: #b45309; font-size: 12px; font-weight: 600;`
- `.product-card__actions`: `display: flex; gap: 8px; margin-top: auto;`
- `.product-card__add-btn`: `background: var(--green-primary); color: white; border: none; border-radius: var(--radius-sm); padding: 8px 14px; font-weight: 600; cursor: pointer; transition: background 0.15s ease, transform 0.15s ease;`
- `.product-card__add-btn:hover`: `background: var(--green-dark); transform: translateY(-1px);`
- `.product-card__quick-view`: `background: transparent; border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 8px 14px; font-weight: 600; cursor: pointer; transition: border-color 0.15s ease;`
- `.product-card__quick-view:hover`: `border-color: var(--green-primary); color: var(--green-primary);`

**Backward compatibility**: all new inputs default to hidden/null. Other pages pass nothing and render identically.

---

## Step 3 — Home Data Layer (`home.ts`)

### New signals
```ts
offers = signal<Offer[]>([]);
promos = signal<PromoBanner[]>([]);
testimonials = signal<Testimonial[]>([]);
brandValues = signal<BrandValue[]>([]);
news = signal<NewsPost[]>([]);
productsReady = signal(false);
categoriesReady = signal(false);
offersReady = signal(false);
promosReady = signal(false);
testimonialsReady = signal(false);
brandValuesReady = signal(false);
newsReady = signal(false);
```

### Computed helpers
```ts
featured = computed(() => this.products().slice(0, 8));
recommended = computed(() => {
  const featuredIds = new Set(this.featured().map(p => p.id));
  return this.products().filter(p => !featuredIds.has(p.id)).slice(0, 8);
});
symbol = computed(() => (this.lang() === 'ar' ? 'د.إ' : 'AED'));
cartSubtotal = computed(() => this.cartSvc.cartSubtotal());
freeDeliveryMin = computed(() => this.region()?.free_delivery_min ?? 100);
freeDeliveryProgress = computed(() => Math.min((this.cartSubtotal() / this.freeDeliveryMin()) * 100, 100));
freeDeliveryRemaining = computed(() => Math.max(this.freeDeliveryMin() - this.cartSubtotal(), 0));
```

### Constructor
```ts
constructor(
  private api: ApiService,
  private langSvc: LanguageService,
  private cartSvc: CartService,
  private regionSvc: RegionService,
) {
  this.lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  this.api.getProducts().subscribe(r => { this.products.set(r.data ?? []); this.productsReady.set(true); });
  this.api.getCategories().subscribe(r => { this.categories.set(r.data ?? []); this.categoriesReady.set(true); });
  this.api.getOffers().subscribe(r => { this.offers.set(r.data ?? []); this.offersReady.set(true); });
  this.api.getPromoBanners().subscribe(r => { this.promos.set(r.data ?? []); this.promosReady.set(true); });
  this.api.getTestimonials().subscribe(r => { this.testimonials.set(r.data ?? [])); this.testimonialsReady.set(true); });
  this.api.getBrandValues().subscribe(r => { this.brandValues.set(r.data ?? []); this.brandValuesReady.set(true); });
  this.api.getNews().subscribe(r => { this.news.set(r.data ?? []); this.newsReady.set(true); });
}
```

Remove old `catIcons`, `banners`, `discover` arrays.

### Helper methods
```ts
name(c: Category): string {
  return localized(c, this.lang());
}

getOfferProduct(offer: Offer): Product | undefined {
  return this.products().find(p => p.id === offer.product_id);
}

getOldPrice(offer: Offer): number {
  const product = this.getOfferProduct(offer);
  if (!product) return 0;
  return +(product.price / (1 - offer.percent / 100)).toFixed(2);
}

isOfferExpired(offer: Offer): boolean {
  return new Date(offer.valid_until) < new Date();
}

categoryImage(category: Category): string {
  return category.image || this.categoryImageFallback[category.slug] || '';
}

prev(): void {
  const el = document.querySelector('.bestseller__track');
  el?.scrollBy({ left: -260, behavior: 'smooth' });
}

next(): void {
  const el = document.querySelector('.bestseller__track');
  el?.scrollBy({ left: 260, behavior: 'smooth' });
}
```

---

## Step 4 — Home Template (`home.html`)

### Section Order

**A. Hero**
Full-width gradient background: `linear-gradient(135deg, #14532D 0%, #1a332b 60%, #0f1f17 100%)`.
Left: eyebrow `FRESH EVERY DAY`, H1 `Everything You Need,<br>Delivered Fresh.`, subtext, search input (functional, navigates to `/products?q=...`), primary CTA `Shop Now` (`/products`), secondary `Explore Deals` (`/offers`), trust strip (3 micro-items).
Right: hero image `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=90` with 3 floating produce badges (gentle float animation, staggered delays).

Hero search behavior: `(keyup.enter)` and `(blur)` navigate to `/products` with `?q=` query param.

**B. Category Quick Access**
Horizontal scroll row, first 10 categories. Each card: 64px rounded-square with category `icon` emoji, localized `name` below. Link to `/section/{category.slug}`.

**C. Featured Categories**
4-column grid (desktop), 3 (tablet), 2 (mobile). Each card: large image with green gradient overlay, category name. Use `categoryImage(c)` helper; backend `category.image` first, fallback map second.

Fallback map:
```ts
categoryImageFallback: Record<string, string> = {
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
  vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'dairy-eggs': 'https://images.unsplash.com/photo-1628088062854-b1870b1e2079?auto=format&fit=crop&w=600&q=80',
  'bakery-bread': 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80',
};
```

**D. Free Delivery Progress Strip**
Full-width strip between categories and deals. Shows: "You're AED {{remaining}} away from FREE DELIVERY" with a green progress bar. Reads `freeDeliveryProgress()` and `freeDeliveryRemaining()` computed from `CartService.cartSubtotal()` and `region().free_delivery_min`. Hidden when `freeDeliveryRemaining() <= 0`.

**E. Flash Deals**
Header: `Today's Deals` + countdown `02:14:35` (static) + `View All →` link to `/offers`.
Background: `var(--green-very-light)`.
Filter `offers()` to exclude expired ones (`!isOfferExpired(offer)`).
Responsive grid (5 desktop, 3 tablet, 2 mobile).
Each card uses extended `app-product-card` with:
- `[product]="getOfferProduct(offer)"`
- `[oldPrice]="getOldPrice(offer)"`
- `[discountPercent]="offer.percent"`
- `[showAddToCart]="true"`
- `[symbol]="symbol()"`

Cards where `getOfferProduct(offer)` returns `undefined` are skipped with `@if`.

**F. Best Sellers**
Header: `Best Sellers` + carousel arrows (`‹` `›`).
Horizontal scrolling track using `featured()` with existing `app-product-card`.

**G. Promotional Banner**
Full-width deep green (`#14532D`) banner, `border-radius: var(--radius-lg)`.
2-column: text left, image right.
Text: `Freshness You Can Count On` + `Quality groceries at prices your family will love.` + `Shop Fresh Food` CTA (`/products`).
Image: `https://images.unsplash.com/photo-1610859496324-86b7eaa41b12?auto=format&fit=crop&w=800&q=90`

**H. Fresh Produce**
Header: `Fresh From The Market` + `Picked for quality. Delivered with care.`
3-column large image cards:
- Fresh Fruits: `https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80`
- Fresh Vegetables: `https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80`
- Herbs & Organic: `https://images.unsplash.com/photo-1530836369250-ef72a3f5cdaa?auto=format&fit=crop&w=600&q=80`

Each card: `aspect-ratio: 3/2`, green gradient overlay, category name label.

**I. Brand Values**
Header: `Why Choose Bab Al Awir`
4-column cards from `brandValues()`. Each: emoji `icon`, `label_en`, `desc_en`. Use `localized` helper for i18n.

**J. Latest News**
Header: `Latest News` + `View All →` link to `/news`.
3-column grid of cards from `news()` (first 3). Each: image, date, `title_en`, `Read More` link.

**K. Recommended Products**
Header: `Recommended For You`
Grid of 8 products from `recommended()` computed.

**L. Trust Strip**
4 equal columns with inline SVG icons:
- 🥬 Fresh Products — quality checked
- 🚚 Fast Delivery — 2-3 business days
- 💳 Secure Payments — 100% secure
- 🎧 Customer Support — here for you

**M. Newsletter / App Promotion**
Green background (`var(--green-primary)`), `border-radius: var(--radius-lg)`, 2-column.
Text: `Fresh groceries are just a tap away.` + subtext + `Download the App` CTA.
Two badge buttons (App Store / Google Play) as styled text links.

**N. Footer**
Layout-owned. Renders automatically after `<router-outlet>`. No changes.

---

## Step 5 — Home Styles (`home.scss`)

### Skeleton Loader
```scss
.skeleton {
  background: linear-gradient(90deg, var(--line) 25%, var(--surface-alt) 50%, var(--line) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton--text { height: 14px; margin-bottom: 8px; }
.skeleton--title { height: 28px; width: 60%; margin-bottom: 16px; }
.skeleton--card { height: 220px; border-radius: var(--radius-lg); }
```

### Hero
- `min-height: 580px` desktop, `420px` mobile.
- Gradient: `linear-gradient(135deg, #14532D, #1a332b 60%, #0f1f17)`.
- `border-radius: 0 0 var(--radius-lg) var(--radius-lg)`.
- Search input: `background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); color: white;`
- CTA primary: `background: var(--green-primary); color: white; border-radius: var(--radius-sm); padding: 14px 32px; font-weight: 700; transition: background 0.15s ease, transform 0.2s ease;`
- CTA primary hover: `background: var(--green-dark); transform: translateY(-1px);`
- CTA secondary: `background: transparent; border: 1px solid rgba(255,255,255,0.4); color: white;`
- Trust strip: `display: flex; gap: 24px; font-size: 13px; color: rgba(255,255,255,0.85);`
- Floating badges: `animation: float 4s ease-in-out infinite`, staggered `animation-delay: 0.5s, 1s, 1.5s`.

### Free Delivery Progress Strip
- `background: var(--green-very-light); border-top: 1px solid var(--green-light); border-bottom: 1px solid var(--green-light);`
- `padding-block: var(--space-2);`
- Progress bar: `height: 8px; background: var(--line); border-radius: var(--radius-pill); overflow: hidden;`
- Fill: `height: 100%; background: var(--green-primary); border-radius: var(--radius-pill); transition: width 0.5s ease;`
- Text: `font-size: 14px; font-weight: 600; color: var(--green-dark);`

### Category Quick Access
- `display: flex; gap: var(--space-2); overflow-x: auto; scroll-snap-type: x mandatory; padding-block: var(--space-2);`
- `scrollbar-width: none;`
- Each card: `scroll-snap-align: start; min-width: 80px; display: flex; flex-direction: column; align-items: center; gap: 8px; text-decoration: none;`
- Emoji container: `width: 64px; height: 64px; border-radius: var(--radius-md); background: var(--green-very-light); display: flex; align-items: center; justify-content: center; font-size: 28px; transition: background 0.15s ease, transform 0.2s ease;`
- Hover: `background: var(--green-light); transform: translateY(-3px);`
- Label: `font-size: 12px; font-weight: 600; color: var(--ink);`

### Featured Categories
- Grid: `grid-template-columns: repeat(4, 1fr)` desktop, `repeat(3, 1fr)` tablet (`max-width: 1199px`), `repeat(2, 1fr)` mobile (`max-width: 767px`).
- `gap: var(--space-2);`
- Card: `aspect-ratio: 4/3; border-radius: var(--radius-lg); overflow: hidden; position: relative; cursor: pointer;`
- Overlay: `position: absolute; inset: 0; background: linear-gradient(0deg, rgba(20,42,28,0.7) 0%, transparent 60%); transition: opacity 0.3s ease;`
- Hover: overlay deepens to `rgba(20,42,28,0.85)`, image scales `1.05`.
- Label: `position: absolute; bottom: 12px; left: 12px; color: white; font-weight: 700; font-size: 16px;`
- `[dir='rtl']` override: label `right: 12px` instead of left.

### Flash Deals
- Section background: `var(--green-very-light)`.
- `padding-block: var(--space-5);`
- Header: `display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);`
- Countdown: `font-family: monospace; font-variant-numeric: tabular-nums; font-weight: 700; color: var(--green-dark); font-size: 18px;`
- Product grid: `grid-template-columns: repeat(5, 1fr)` desktop, `repeat(3, 1fr)` tablet, `repeat(2, 1fr)` mobile.
- Deal card accent: `border-left: 3px solid var(--green-primary);` (`border-right` in RTL).

### Best Sellers Track
- `display: grid; grid-auto-flow: column; grid-auto-columns: minmax(220px, 1fr); gap: var(--space-2); overflow-x: auto; scroll-behavior: smooth; padding-bottom: var(--space-1);`
- `scrollbar-width: none;`
- Carousel buttons: `position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; background: white; border: 1px solid var(--line); cursor: pointer; transition: border-color 0.15s ease, transform 0.2s ease;`
- `[dir='rtl'] .bestseller__track { direction: rtl; }`

### Promotional Banner
- `background: #14532D; border-radius: var(--radius-lg);`
- Inner: `display: grid; grid-template-columns: 1fr auto; gap: var(--space-4); align-items: center;`
- Text: `color: white;`
- Heading: `font-size: 32px; font-weight: 800; margin-bottom: 8px;`
- Subtext: `font-size: 16px; color: rgba(255,255,255,0.85); margin-bottom: var(--space-2);`
- CTA: `background: var(--green-primary); color: white; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 700; transition: background 0.15s ease, transform 0.2s ease;`
- CTA hover: `background: var(--green-dark); transform: translateY(-1px);`
- Image: `max-width: 400px; border-radius: var(--radius-md);`

### Fresh Produce
- 3-column grid, large cards: `aspect-ratio: 3/2; border-radius: var(--radius-lg); overflow: hidden; position: relative;`
- Overlay: `position: absolute; inset: 0; background: linear-gradient(0deg, rgba(20,42,28,0.6) 0%, transparent 50%); transition: background 0.3s ease;`
- Hover: overlay deepens to `rgba(20,42,28,0.8)`, image scales `1.05`.
- Label: `position: absolute; bottom: 16px; left: 16px; color: white; font-weight: 700; font-size: 18px;`
- `[dir='rtl']` override: label `right: 16px`.

### Brand Values
- 4-column grid, centered text.
- `gap: var(--space-3);`
- Icon: `font-size: 32px; margin-bottom: 12px;`
- Label: `font-weight: 700; font-size: 16px; color: var(--ink); margin-bottom: 8px;`
- Desc: `color: var(--ink-secondary); font-size: 14px; line-height: 1.5;`

### Latest News
- 3-column grid.
- Card: `background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); overflow: hidden; transition: border-color 0.15s ease, transform 0.2s ease;`
- Hover: `border-color: var(--green-primary); transform: translateY(-3px);`
- Image: `width: 100%; height: 180px; object-fit: cover;`
- Body: `padding: var(--space-2);`
- Date: `font-size: 12px; color: var(--ink-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;`
- Title: `font-size: 15px; font-weight: 700; color: var(--ink); margin-top: 4px;`
- Link: `font-size: 13px; font-weight: 700; color: var(--green-primary); margin-top: 8px; display: inline-block;`

### Recommended Products
- Same grid as Best Sellers but static (no carousel arrows).
- 5 desktop, 3 tablet, 2 mobile.

### Trust Strip
- `border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding-block: var(--space-3);`
- Grid: `grid-template-columns: repeat(4, 1fr); gap: 24px;`
- Each item: `display: flex; align-items: center; gap: 12px;`
- Icon: `width: 24px; height: 24px; color: var(--green-primary); flex-shrink: 0;`
- Text: `font-size: 14px; font-weight: 600; color: var(--ink);`

### Newsletter
- `background: var(--green-primary); border-radius: var(--radius-lg);`
- 2-column: `grid-template-columns: 1fr auto; gap: var(--space-4); align-items: center;`
- Heading: `font-size: 28px; font-weight: 800; color: white; margin-bottom: 8px;`
- Subtext: `font-size: 15px; color: rgba(255,255,255,0.9); margin-bottom: var(--space-2);`
- CTA buttons: `background: white; color: var(--green-dark); padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 700; transition: transform 0.15s ease;`
- CTA hover: `transform: translateY(-1px);`

### Staggered Section Reveal
```scss
.section {
  opacity: 0;
  transform: translateY(24px);
  animation: fadeInUp 0.6s ease-out forwards;
}
.section:nth-child(1) { animation-delay: 0.05s; }
.section:nth-child(2) { animation-delay: 0.1s; }
.section:nth-child(3) { animation-delay: 0.15s; }
.section:nth-child(4) { animation-delay: 0.2s; }
.section:nth-child(5) { animation-delay: 0.25s; }
.section:nth-child(6) { animation-delay: 0.3s; }
.section:nth-child(7) { animation-delay: 0.35s; }
.section:nth-child(8) { animation-delay: 0.4s; }
.section:nth-child(9) { animation-delay: 0.45s; }
.section:nth-child(10) { animation-delay: 0.5s; }
.section:nth-child(11) { animation-delay: 0.55s; }
.section:nth-child(12) { animation-delay: 0.6s; }
.section:nth-child(13) { animation-delay: 0.65s; }
```

### Responsive Breakpoints
```scss
// Desktop 1440px+
@media (min-width: 1440px) {
  .featured-categories__grid { grid-template-columns: repeat(4, 1fr); }
  .flash-deals__grid { grid-template-columns: repeat(5, 1fr); }
  .recommended-grid { grid-template-columns: repeat(5, 1fr); }
}

// Tablet 768–1199px
@media (max-width: 1199px) {
  .featured-categories__grid { grid-template-columns: repeat(3, 1fr); }
  .flash-deals__grid { grid-template-columns: repeat(3, 1fr); }
  .recommended-grid { grid-template-columns: repeat(3, 1fr); }
  .hero__grid { grid-template-columns: 3fr 2fr; }
}

// Mobile 320–767px
@media (max-width: 767px) {
  .hero { min-height: 420px; }
  .hero__grid { grid-template-columns: 1fr; }
  .hero__visual { display: none; }
  .featured-categories__grid { grid-template-columns: repeat(2, 1fr); }
  .flash-deals__grid { grid-template-columns: repeat(2, 1fr); }
  .recommended-grid { grid-template-columns: repeat(2, 1fr); }
  .fresh-produce__grid { grid-template-columns: 1fr; }
  .promo-banner__inner { grid-template-columns: 1fr; }
  .newsletter__inner { grid-template-columns: 1fr; text-align: center; }
  .trust-strip__grid { grid-template-columns: repeat(2, 1fr); }
}
```

### RTL Support
All horizontal layouts use `margin-inline`, `padding-inline`, `text-align: start`.
Carousel scroll direction: `[dir='rtl'] .bestseller__track { direction: rtl; }`
Deal card accent: `[dir='rtl'] .deal-card { border-left: none; border-right: 3px solid var(--green-primary); }`
Category label positioning: `[dir='rtl'] .category-card__label { right: 12px; left: auto; }`

---

## Step 6 — Image Policy

All Unsplash URLs follow:
```
https://images.unsplash.com/photo-<ID>?auto=format&fit=crop&w=<WIDTH>&q=80
```

Content-matched image assignments:
- Hero produce basket: `photo-1542838132-92c53300491e` (`w=800`, `q=90`)
- Fruits card: `photo-1619566636858-adf3ef46400b`
- Vegetables card: `photo-1540420773420-3366772f4999`
- Dairy card: `photo-1628088062854-b1870b1e2079`
- Bakery card: `photo-1509365465985-25d11c17e812`
- Promo banner: `photo-1610859496324-86b7eaa41b12`
- Herbs & Organic: `photo-1530836369250-ef72a3f5cdaa`
- Product images: use `product.image` from backend directly (already Unsplash)

Add `onerror="this.style.display='none'"` to all `<img>` tags. Category cards also show the category `icon` emoji as fallback text when image fails.

---

## Step 7 — Validation

1. `ng build` — zero compilation errors.
2. `ng serve` — home page renders all 13 sections in correct order with skeletons appearing first, then content.
3. Navigate to `/products`, `/categories`, `/about`, `/offers` — verify visual unchanged (same product cards, same layout).
4. Switch language to Arabic — verify RTL mirrors correctly (carousel direction, text alignment, category label positions, margins).
5. Resize to mobile width — verify 2-column grids, stacked hero, hidden hero visual, bottom nav (existing) remains functional.
6. Hover every card and button — verify micro-interactions fire smoothly (translateY, border-color, image scale).
7. Add a product to cart from home page — verify side cart drawer opens with correct item, subtotal updates, free delivery progress strip updates.
8. Test with empty cart — verify free delivery strip shows "You're AED 100 away from FREE DELIVERY" with 0% progress.
9. Test with cart subtotal >= free_delivery_min — verify strip hides or shows "You qualify for FREE DELIVERY!"

---

## Out of Scope (Do Not Touch)
- `layout.html`, `layout.scss`, `layout.ts`
- `shared/product-card` beyond the optional inputs defined in Step 2
- Any feature module other than `home`
- Backend `dummy.php` or API routes
- Cart, checkout, auth flows
- Footer (layout-owned)

---

## Risk Register

| Risk | Mitigation |
|------|-----------|
| 7 API calls slow initial render | `ApiService` caches GET in `localStorage` 24h; per-section skeletons mask latency independently |
| Product card changes leak to other pages | All new inputs optional with safe defaults; other pages pass nothing |
| Unsplash URLs break | `onerror` fallback; backend `category.image` used first; emoji fallback for categories |
| Computed old price inaccurate | Acceptable for display; backend only exposes `percent` |
| Home.scss conflicts with global styles | Home.scss uses new token names; no existing token overrides |
| RTL carousel direction wrong | Explicit `[dir='rtl']` override for `.bestseller__track` and deal card borders |
| Free delivery strip shows wrong amount | Reads from `CartService.cartSubtotal()` and `region().free_delivery_min` reactively |
| Category quick access links wrong | Links to `/section/{slug}` which is the most specific existing route |
