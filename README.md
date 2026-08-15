# 🛒 Bab al Awir — Web App

> 🌿 **Fresh every day, for every home** — a calm, premium multilingual grocery shopping experience. 🛍️

**Bab al Awir** 🏪 is a full-featured multilingual grocery e-commerce platform built as a production-ready proof-of-concept.
It pairs an **Angular** 🅰️ single-page front end with a lightweight **Laravel** 🐘 JSON API to
demonstrate a polished, region- and language-aware storefront — no heavy database required. 🇦🇪

---

## ✨ What is this application?

Bab al Awir is a neighbourhood-supermarket storefront reimagined for the web. 🛒
Visitors are greeted by a splash **flash screen** ✨, then guided through a **welcome gateway** 🚪 where they pick
their 🌍 **region** and 🗣️ **language** before entering the shop. From there they can browse
📦 categories, 🥦 products, 🏷️ offers, read the 💚 brand story, contact the store, and manage
their 👤 profile — all in their chosen language, with right-to-left layout for Arabic. 📱

The app is a **front-end-first prototype**: all catalogue data (regions, languages, categories,
products, users) lives in a single config file on the Laravel side, so the whole experience can
be explored and demoed without setting up a database. 🧪

---

## 🌟 Features

- 🌍 **4 languages out of the box** — English, Arabic (RTL), Malayalam, Tamil.
- 🔐 **Auth flow** — Login, Sign Up, and Forgot Password screens wrapped in a branded `AuthShell`.
- 🖼️ **Product imagery** — product cards show real photos with an emoji fallback when an image is missing.
- ⚡ **Flash screen** — a branded splash that loads before the welcome gateway.
- 💡 **Resilient welcome gateway** — loading spinner + graceful fallback to defaults if the API is unavailable.
- 🛒 **Shopping cart** — add-to-cart with a slide-in cart drawer.
- 🏷️ **Offers** — discount badges and offer listings.
- 👤 **Profile** — loyalty points, tier, member-since, and order history.
- 📱 **Responsive** — mobile-first layout with reduced-motion support.
- 🌙 **Dark theme** — toggle between light and dark modes.
- 🎨 **Green supermarket theme** — fresh, premium grocery identity with light green accents.
- 🔄 **RTL support** — full Arabic layout mirroring.
- ⚡ **AJAX-style interactions** — instant filtering, cart updates, and smooth transitions.
- 🏠 **Grogin-inspired homepage** — hero banners, category grid, deals, featured products, brands, and more.

---

## 🧱 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| 🐘 Backend | Laravel (PHP) | 12.x |
| 🅰️ Frontend | Angular (TypeScript) | 22.x |
| 🗄️ Database | SQLite (Laravel internals only) | — |
| 🌐 i18n | `@ngx-translate/core` | 16.x |
| 🎨 Styling | CSS custom properties (no framework) | — |
| 🔄 State | Angular Signals + RxJS | — |
| 🧪 Testing | Vitest (frontend), PHPUnit (backend) | — |

---

## 🗂️ Architecture

```
🖥️  Browser (Angular SPA)            🐘  Laravel API Backend
   :4200 (ng serve)                     :8000 (php artisan serve)
        │                                     │
        │── GET /api/regions ───────────────▶│── config('dummy.regions')
        │── GET /api/languages ─────────────▶│── config('dummy.languages')
        │── GET /api/sections ──────────────▶│── config('dummy.sections')
        │── GET /api/categories ────────────▶│── config('dummy.categories')
        │── GET /api/products ──────────────▶│── config('dummy.products')
        │── GET /api/products/{id} ─────────▶│── config('dummy.products')
        │── GET /api/offers ────────────────▶│── config('dummy.offers')
        │── GET /api/brands ────────────────▶│── config('dummy.brands')
        │── GET /api/promo-banners ─────────▶│── config('dummy.promo_banners')
        │── GET /api/testimonials ──────────▶│── config('dummy.testimonials')
        │── GET /api/brand-values ──────────▶│── config('dummy.brand.values')
        │── GET /api/user/profile ──────────▶│── config('dummy.user')
        │── POST /api/login ────────────────▶│── config('dummy.auth.users')
        │── POST /api/signup ───────────────▶│── config('dummy.auth.users')
        │── POST /api/forgot-password ──────▶│── config('dummy.auth')
        │                                     │
        │◀── JSON { success, message, data }
```

- 🚫 **No database for store content** — all catalogue data is hardcoded in `backend/config/dummy.php`.
- 🗄️ SQLite handles only Laravel internals (sessions, cache, queue).
- 🅰️ Angular is a **standalone SPA** (no `NgModule`), bootstrapped via `bootstrapApplication`.
- 📦 All API responses are cached in `localStorage` for 24 hours for offline resilience.

---

## 🧭 Routing & Flow

| Path | Screen | Description |
|------|--------|-------------|
| `/flash` | 💡 Flash screen | Branded splash shown on first load |
| `/welcome` | 🌿 Welcome gateway | Region + language selection before entering the app |
| `/login` · `/signup` · `/forgot-password` | 🔐 Auth | Login, sign up, and password reset (inside `AuthShell`) |
| `/` | 🧱 Layout shell | Main app: header, nav, footer + child routes |
| `/` (child) | 🏠 Home | Hero banners + service benefits + categories + deals + featured products + brands |
| `/categories` | 📦 Categories | Category grid with product images |
| `/products` | 🥦 Products | Filterable product grid by category |
| `/offers` | 🏷️ Offers | Product cards with discount badges |
| `/about` | 💚 About | Brand story |
| `/contact` | 📞 Contact | Contact form + business info |
| `/profile` | 👤 Profile | User profile, loyalty points, order history |
| `/**` | — | Wildcard redirects to `/flash` |

The `welcomeGuard` blocks access to `/` and its children until a region is selected.

---

## 🌐 Internationalization

Four languages are supported, with automatic RTL for Arabic:

| Code | Language | Direction | Font |
|------|----------|-----------|------|
| `en` | English | LTR | Inter |
| `ar` | Arabic | RTL | Tajawal |
| `ml` | Malayalam | LTR | Noto Sans Malayalam |
| `ta` | Tamil | LTR | Noto Sans Tamil |

The chosen language is persisted in `localStorage` (`baw_lang`), and the `<html>` element's
`lang`, `dir`, and CSS class update on language change.

---

## 🚀 Getting Started

### 🐘 Backend

```bash
cd backend
composer install
cp .env.example .env          # SQLite is pre-configured
php artisan key:generate
php artisan migrate            # Creates internal tables
php artisan serve              # → http://localhost:8000
```

### 🅰️ Frontend

```bash
cd frontend
npm install
ng serve                       # → http://localhost:4200
```

The Angular dev server talks to the Laravel API at `http://localhost:8000/api/*`.

> 💡 **Demo credentials** — use a seeded account (e.g. `aisha.rahman@babalawir.ae` / `password123`)
> from `backend/config/dummy.php` to explore the authenticated experience.

---

## 🔌 API Endpoints

All endpoints return `{ success: true, message: string, data: T }`.

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/regions` | Regions with flags + currency |
| GET | `/api/languages` | Languages with direction + font |
| GET | `/api/sections` | Navigation sections (multilingual) |
| GET | `/api/categories` | Product categories with emoji icons |
| GET | `/api/products` | All products with prices + units |
| GET | `/api/products/{id}` | Single product or `404` |
| GET | `/api/offers` | Active offers with discounts |
| GET | `/api/brands` | Brand logos + names |
| GET | `/api/promo-banners` | Homepage promotional banners |
| GET | `/api/testimonials` | Customer testimonials |
| GET | `/api/brand-values` | Service benefit icons + text |
| GET | `/api/user/profile` | Mock user profile with orders |
| POST | `/api/login` | Issue a demo auth token |
| POST | `/api/signup` | Create a demo account |
| POST | `/api/forgot-password` | Send a (mock) reset link |

---

## 🎨 Design System

A fresh, green supermarket identity built on CSS custom properties (`frontend/src/styles.scss`):

| Token | Value | Usage |
|-------|-------|-------|
| 🟢 Primary Green | `#16823B` | Brand mark, accents, CTAs, links |
| 🟢 Dark Green | `#0B5D2A` | Sub-nav, footer, active states |
| 🟢 Bright Green | `#27A844` | Hover states, highlights |
| 🟢 Soft Green | `#EAF7EE` | Light backgrounds, hover states |
| 🟢 Very Soft Green | `#F5FBF7` | Section backgrounds |
| ⬜ White | `#FFFFFF` | Surfaces, cards, text on dark |
| 🟡 Amber | `#F59E0B` | Discount badges, countdown, highlights |
| ⬛ Dark Green BG | `#0B5D2A` | App promo section, footer |
| 🌫️ Muted | `#6B746E` | Secondary text |
| ➖ Line | `rgba(32,37,34,0.12)` | Borders, dividers |

- **Typography** — Inter (Latin) with Tajawal / Noto Sans Malayalam / Noto Sans Tamil per locale.
- **Radius** — `8px` (`--radius-sm`), `14px` (`--radius-md`), `22px` (`--radius-lg`), `999px` pill.
- **Spacing** — `12px` base unit (`--space-1`) scaled by multiples (`24 / 36 / 48 / 72px`).
- **Depth** — flat surfaces with subtle shadows on hover; green-tinted backgrounds for sections.
- **Dark Theme** — toggle via header button; persists in `localStorage` (`baw_theme`).

---

## 📁 Project Structure

```
Bab al awir - Web app/
├── 📄 README.md                ← This file
├── 📄 Aboutwebapp.md           ← Detailed architecture notes
├── 🐘 backend/                  ← Laravel JSON API
│   ├── app/
│   │   ├── Http/Controllers/Api/  ← API controllers
│   │   └── config/dummy.php       ← All store + auth data
│   ├── routes/api.php             ← API routes
│   └── composer.json
└── 🅰️ frontend/                ← Angular standalone SPA
    └── src/app/
        ├── core/               ← services, guard, models
        ├── features/           ← page modules
        │   ├── home/           ← Grogin-inspired homepage
        │   ├── layout/         ← Header, nav, footer shell
        │   ├── welcome-gateway/← Region + language picker
        │   ├── categories/     ← Category grid
        │   ├── products/       ← Product listing + filters
        │   ├── offers/         ← Discount offers
        │   ├── product-detail/ ← Product page
        │   ├── checkout/       ← Checkout flow
        │   ├── orders/         ← Order history
        │   ├── cart/           ← Cart drawer
        │   ├── wishlist/       ← Wishlist
        │   ├── about/          ← Brand story
        │   ├── contact/        ← Contact form
        │   ├── profile/        ← User profile
        │   └── shared/         ← Reusable components
        └── assets/i18n/         ← Translation files
```

---

## 🚧 Remaining Pages & Features

The following pages and features are **partially implemented** or **not yet completed**:

### ✅ Completed Pages
- 🏠 **Home** — Hero banners, service benefits, shop by category, trending deals, featured products, promotional banner, best sellers, shop by brand, UAE delivery section, app promotion
- 📦 **Categories** — Category grid
- 🥦 **Products** — Product listing (basic)
- 🏷️ **Offers** — Offer listings
- 💚 **About** — Brand story
- 📞 **Contact** — Contact form
- 👤 **Profile** — User profile with orders
- 🛒 **Cart** — Slide-in cart drawer
- ❤️ **Wishlist** — Wishlist page
- 🔐 **Auth** — Login, Sign Up, Forgot Password
- 🌿 **Welcome Gateway** — Region + language selection
- 💡 **Flash Screen** — Branded splash

### 🚧 Pages To Be Completed / Enhanced

| Page | Status | Description |
|------|--------|-------------|
| 🥦 **Products** | 🔄 In Progress | Add advanced filtering (price range, brand checkboxes, dietary filters, rating filter), sorting dropdown, AJAX filter experience, skeleton loading |
| 📦 **Categories** | 🔄 In Progress | Add subcategory navigation, category descriptions, product counts |
| 🏷️ **Offers** | 🔄 In Progress | Add offer tabs (All, Fruits, Dairy, Meat, Beverages, Household), countdown timers per offer |
| 📱 **Product Detail** | 🚧 Partial | Add image gallery with thumbnails, zoom feature, product videos, quantity selector, Buy Now button, delivery info, product tabs (Description, Ingredients, Nutrition, Specs, Reviews) |
| 💳 **Checkout** | 🚧 Partial | Complete delivery address form, delivery method selection (Standard/Express/Scheduled), payment method selection (Card, Apple Pay, Google Pay, COD), order summary panel |
| 📋 **Orders** | 🚧 Partial | Add order tracking, order status timeline, reorder functionality |
| 🔍 **Search** | 🚧 Partial | Add search suggestions with product images, recent searches, popular searches |
| ⚡ **Quick View Modal** | 🚧 Partial | Add modal with product image, name, rating, price, quantity, Add to Cart, Buy Now, Wishlist |
| 📱 **Mobile Bottom Navigation** | 🚧 Partial | Add fixed bottom nav for mobile (Home, Categories, Search, Wishlist, Cart) |
| 🗺️ **Store Locator** | ⏳ Not Started | Map integration, store details, hours, services |
| 📰 **News / Blog** | ⏳ Not Started | News articles, blog posts |
| ❓ **FAQ** | ⏳ Not Started | Accordion FAQ section |
| 🌟 **Testimonials** | ⏳ Not Started | Customer review carousel |
| 📱 **App Promotion** | ⏳ Not Started | Mobile app download section |
| 📧 **Newsletter** | ⏳ Not Started | Email subscription form |
| 🌙 **Dark Theme** | ✅ Done | Theme toggle implemented |
| 🔔 **Toast Notifications** | ⏳ Not Started | Add to cart confirmations, success messages |

---

## 📝 Notes

- 🧪 This is a **prototype / POC** — auth uses hardcoded demo data, not real password hashing.
- 🔒 `.env` is gitignored; no secrets are committed.
- 🌿 Built to demonstrate a multilingual, region-aware storefront end-to-end.
- 🖼️ Product images are sourced from Unsplash and are product-specific (e.g., mango nectar shows mango juice, not generic juice).
- 🌍 Designed for UAE supermarket experience with AED pricing and Arabic RTL support.

---

## 🤝 Contributing

This is a private project for **Bab al Awir Supermarket**. All contributions are welcome!
Please follow the existing code style and commit conventions.

---

<p align="center">💚 Made with fresh produce & good intentions at <strong>Bab al Awir</strong>.</p>
<p align="center">🌿 Fresh every day, for every home 🌿</p>
