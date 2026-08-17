# Bab al Awir — Web App

> **Fresh every day, for every home** — a calm, premium multilingual grocery shopping experience.

**Bab al Awir** is a full-featured multilingual grocery e-commerce platform built as a production-ready proof-of-concept.
It pairs an **Angular** single-page front end with a lightweight **Laravel** JSON API to
demonstrate a polished, region- and language-aware storefront — no heavy database required.

---

## What is this application?

Bab al Awir is a neighbourhood-supermarket storefront reimagined for the web.
Visitors are greeted by a branded **flash screen**, then guided through a **welcome gateway** where they pick
their **region** and **language** before entering the shop. From there they can browse
categories, products, offers, brands, news, FAQs, store locations, delivery options, and manage
their profile — all in their chosen language, with right-to-left layout for Arabic.

The app is a **front-end-first prototype**: all catalogue data (regions, languages, categories,
products, users) lives in a single config file on the Laravel side, so the whole experience can
be explored and demoed without setting up a database.

---

## Features

- **4 languages out of the box** — English, Arabic (RTL), Malayalam, Tamil.
- **Auth flow** — Login, Sign Up, and Forgot Password screens wrapped in a branded `AuthShell`.
- **Product imagery** — product cards show real photos with an emoji fallback when an image is missing.
- **Flash screen** — a branded splash that loads before the welcome gateway.
- **Resilient welcome gateway** — loading spinner + graceful fallback to defaults if the API is unavailable.
- **Shopping cart** — add-to-cart with a slide-in cart drawer.
- **Wishlist** — save products for later.
- **Offers** — discount badges and offer listings.
- **Brands** — brand showcase with logos.
- **News** — news articles and blog posts.
- **FAQ** — accordion FAQ section.
- **Store locations** — store locator page.
- **Delivery options** — delivery method information.
- **Testimonials** — customer reviews.
- **Checkout & Orders** — checkout flow, order confirmation, and order history.
- **Profile** — loyalty points, tier, member-since, and order history.
- **Responsive** — mobile-first layout with reduced-motion support.
- **Dark theme** — toggle between light and dark modes.
- **Green supermarket theme** — fresh, premium grocery identity with light green accents.
- **RTL support** — full Arabic layout mirroring.
- **AJAX-style interactions** — instant filtering, cart updates, and smooth transitions.
- **Homepage** — hero banners, category grid, deals, featured products, brands, and more.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Laravel (PHP) | 12.x |
| Frontend | Angular (TypeScript) | 22.x |
| Database | SQLite (Laravel internals only) | — |
| i18n | `@ngx-translate/core` | 16.x |
| Styling | CSS custom properties (no framework) | — |
| State | Angular Signals + RxJS | — |
| Testing | Vitest (frontend), PHPUnit (backend) | — |
| Deployment | Docker (backend), Render Static (frontend) | — |

---

## Architecture

```
Browser (Angular SPA)              Laravel API Backend
  :4200 (ng serve)                   :8000 (php artisan serve)
       |                                  |
       |-- GET /api/regions ------------->|-- config('dummy.regions')
       |-- GET /api/languages ----------->|-- config('dummy.languages')
       |-- GET /api/sections ------------>|-- config('dummy.sections')
       |-- GET /api/categories ---------->|-- config('dummy.categories')
       |-- GET /api/products ------------>|-- config('dummy.products')
       |-- GET /api/products/{id} ------->|-- config('dummy.products')
       |-- GET /api/offers -------------->|-- config('dummy.offers')
       |-- GET /api/brands -------------->|-- config('dummy.brands')
       |-- GET /api/promo-banners ------->|-- config('dummy.promo_banners')
       |-- GET /api/testimonials -------->|-- config('dummy.testimonials')
       |-- GET /api/brand-values -------->|-- config('dummy.brand.values')
       |-- GET /api/store-locations ----->|-- config('dummy.store.locations')
       |-- GET /api/delivery-options ---->|-- config('dummy.delivery.options')
       |-- GET /api/faq ----------------->|-- config('dummy.faq')
       |-- GET /api/team-members -------->|-- config('dummy.team.members')
       |-- GET /api/news ---------------->|-- config('dummy.news')
       |-- GET /api/user/profile -------->|-- config('dummy.user')
       |-- POST /api/login -------------->|-- config('dummy.auth.users')
       |-- POST /api/signup ------------->|-- config('dummy.auth.users')
       |-- POST /api/forgot-password ---->|-- config('dummy.auth')
       |                                  |
       |<--- JSON { success, message, data }
```

- **No database for store content** — all catalogue data is hardcoded in `backend/config/dummy.php`.
- SQLite handles only Laravel internals (sessions, cache, queue).
- Angular is a **standalone SPA** (no `NgModule`), bootstrapped via `bootstrapApplication`.
- All API responses are cached in `localStorage` for 24 hours for offline resilience.

---

## Routing & Flow

| Path | Screen | Description |
|------|--------|-------------|
| `/flash` | Flash screen | Branded splash shown on first load |
| `/welcome` | Welcome gateway | Region + language selection before entering the app |
| `/login` | Login | User login |
| `/signup` | Sign Up | New account registration |
| `/forgot-password` | Forgot Password | Password reset |
| `/` | Layout shell | Main app: header, nav, footer + child routes |
| `/home` | Home | Hero banners + categories + deals + featured products + brands |
| `/categories` | Categories | Category grid with product images |
| `/products` | Products | Filterable product grid by category |
| `/products/:id` | Product Detail | Individual product page |
| `/offers` | Offers | Product cards with discount badges |
| `/brands` | Brands | Brand showcase |
| `/promos` | Promos | Promotional banners and deals |
| `/section/:key` | Section | Dynamic section pages |
| `/about` | About | Brand story |
| `/contact` | Contact | Contact form + business info |
| `/profile` | Profile | User profile, loyalty points, order history |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Checkout flow |
| `/order-confirmation` | Order Confirmation | Post-purchase confirmation |
| `/orders` | Orders | Order history |
| `/wishlist` | Wishlist | Saved products |
| `/faq` | FAQ | Frequently asked questions |
| `/store-locations` | Store Locator | Store locations and hours |
| `/delivery-options` | Delivery Options | Delivery methods info |
| `/testimonials` | Testimonials | Customer reviews |
| `/news` | News | News articles |
| `/news/:id` | News Detail | Individual news article |
| `/privacy-policy` | Privacy Policy | Privacy policy page |
| `/terms` | Terms | Terms and conditions |
| `/design-showcase` | Design Showcase | Internal design system reference |
| `/**` | — | Wildcard redirects to `/flash` |

The `welcomeGuard` blocks access to `/` and its children until a region is selected.

---

## Internationalization

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

## Getting Started

### Backend

```bash
cd backend
composer install
cp .env.example .env          # SQLite is pre-configured
php artisan key:generate
php artisan migrate            # Creates internal tables
php artisan serve              # → http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
ng serve                       # → http://localhost:4200
```

The Angular dev server talks to the Laravel API at `http://localhost:8000/api/*`.

> **Demo credentials** — use a seeded account (e.g. `aisha.rahman@babalawir.ae` / `password123`)
> from `backend/config/dummy.php` to explore the authenticated experience.

---

## Deployment (Render)

The project is configured for deployment on [Render](https://render.com) via `render.yaml` (Blueprint).

### Services

| Service | Type | Runtime | URL |
|---------|------|---------|-----|
| `bab-al-awir-api` | Web Service | Docker | `https://bab-al-awir-api.onrender.com` |
| `bab-al-awir-frontend` | Static Site | Render Static | `https://bab-al-awir-frontend.onrender.com` |

### Backend (Docker)

The Laravel backend is deployed as a Docker container since Render has no native PHP runtime.
The `Dockerfile` is located at `backend/Dockerfile` and uses `php:8.3-cli` with `php artisan serve`.

**Key environment variables set in Render:**

| Variable | Value |
|----------|-------|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | `https://bab-al-awir-api.onrender.com` |
| `DB_CONNECTION` | `sqlite` |
| `SESSION_DRIVER` | `file` |
| `CACHE_STORE` | `file` |
| `QUEUE_CONNECTION` | `sync` |

### Frontend (Static)

The Angular SPA is built and served as a static site. The build command generates
`environment.prod.ts` with the correct API URL via `scripts/gen-env.mjs`.

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `24.15.0` |
| `API_URL` | `https://bab-al-awir-api.onrender.com/api` |

### Deploying

Push to the `main` branch on GitHub. Render auto-deploys when connected to the repository.
To deploy manually, trigger a deploy from the Render dashboard.

---

## API Endpoints

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
| GET | `/api/store-locations` | Store locations + hours |
| GET | `/api/delivery-options` | Delivery methods |
| GET | `/api/faq` | FAQ items |
| GET | `/api/team-members` | Team member profiles |
| GET | `/api/news` | News articles |
| GET | `/api/user/profile` | Mock user profile with orders |
| POST | `/api/login` | Issue a demo auth token |
| POST | `/api/signup` | Create a demo account |
| POST | `/api/forgot-password` | Send a (mock) reset link |

---

## Design System

A fresh, green supermarket identity built on CSS custom properties (`frontend/src/styles.scss`):

| Token | Value | Usage |
|-------|-------|-------|
| Primary Green | `#16823B` | Brand mark, accents, CTAs, links |
| Dark Green | `#0B5D2A` | Sub-nav, footer, active states |
| Bright Green | `#27A844` | Hover states, highlights |
| Soft Green | `#EAF7EE` | Light backgrounds, hover states |
| Very Soft Green | `#F5FBF7` | Section backgrounds |
| White | `#FFFFFF` | Surfaces, cards, text on dark |
| Amber | `#F59E0B` | Discount badges, countdown, highlights |
| Dark Green BG | `#0B5D2A` | App promo section, footer |
| Muted | `#6B746E` | Secondary text |
| Line | `rgba(32,37,34,0.12)` | Borders, dividers |

- **Typography** — Inter (Latin) with Tajawal / Noto Sans Malayalam / Noto Sans Tamil per locale.
- **Radius** — `8px` (`--radius-sm`), `14px` (`--radius-md`), `22px` (`--radius-lg`), `999px` pill.
- **Spacing** — `12px` base unit (`--space-1`) scaled by multiples (`24 / 36 / 48 / 72px`).
- **Depth** — flat surfaces with subtle shadows on hover; green-tinted backgrounds for sections.
- **Dark Theme** — toggle via header button; persists in `localStorage` (`baw_theme`).

---

## Project Structure

```
Bab al awir - Web app/
├── README.md                    ← This file
├── Aboutwebapp.md               ← Detailed architecture notes
├── render.yaml                  ← Render Blueprint deployment config
├── backend/                     ← Laravel JSON API
│   ├── Dockerfile               ← Docker config for Render deployment
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── RegionController.php
│   │   │   ├── LanguageController.php
│   │   │   ├── SectionController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── ProductController.php
│   │   │   ├── ProductDataService.php
│   │   │   ├── ContentController.php
│   │   │   ├── UserController.php
│   │   │   └── RespondsWithJson.php
│   │   └── Providers/AppServiceProvider.php
│   ├── config/dummy.php          ← All store + auth data
│   ├── database/
│   │   ├── database.sqlite
│   │   └── migrations/
│   ├── routes/
│   │   ├── api.php               ← API routes
│   │   ├── web.php
│   │   └── console.php
│   └── composer.json
├── frontend/                     ← Angular standalone SPA
│   ├── scripts/gen-env.mjs       ← Generates environment.prod.ts at build time
│   ├── proxy.conf.json           ← Dev server API proxy
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts / app.html / app.config.ts / app.routes.ts
│   │   │   ├── core/
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── wishlist.service.ts
│   │   │   │   ├── language.service.ts
│   │   │   │   ├── region.service.ts
│   │   │   │   ├── hero.config.ts
│   │   │   │   ├── localize.ts
│   │   │   │   ├── models.ts
│   │   │   │   └── welcome.guard.ts
│   │   │   ├── features/
│   │   │   │   ├── about/
│   │   │   │   ├── auth/              (login, signup, forgot-password)
│   │   │   │   ├── brands/
│   │   │   │   ├── cart/
│   │   │   │   ├── categories/
│   │   │   │   ├── checkout/
│   │   │   │   ├── contact/
│   │   │   │   ├── delivery-options/
│   │   │   │   ├── design-showcase/
│   │   │   │   ├── faq/
│   │   │   │   ├── flash-screen/
│   │   │   │   ├── home/
│   │   │   │   ├── layout/
│   │   │   │   ├── news/
│   │   │   │   ├── news-detail/
│   │   │   │   ├── offers/
│   │   │   │   ├── order-confirmation/
│   │   │   │   ├── orders/
│   │   │   │   ├── privacy-policy/
│   │   │   │   ├── product-detail/
│   │   │   │   ├── products/
│   │   │   │   ├── profile/
│   │   │   │   ├── promos/
│   │   │   │   ├── section/
│   │   │   │   ├── store-locations/
│   │   │   │   ├── terms/
│   │   │   │   ├── testimonials/
│   │   │   │   ├── welcome-gateway/
│   │   │   │   └── wishlist/
│   │   │   └── shared/
│   │   │       ├── auth-shell/
│   │   │       ├── bg-image.directive.ts
│   │   │       ├── flag-icon/
│   │   │       ├── page-hero/
│   │   │       ├── product-card/
│   │   │       └── shared.module.ts
│   │   ├── assets/i18n/
│   │   │   ├── en.json
│   │   │   ├── ar.json
│   │   │   ├── ml.json
│   │   │   └── ta.json
│   │   ├── environments/
│   │   │   ├── environment.ts
│   │   │   └── environment.prod.ts
│   │   ├── styles.scss
│   │   ├── index.html
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Notes

- This is a **prototype / POC** — auth uses hardcoded demo data, not real password hashing.
- `.env` is gitignored; no secrets are committed.
- Built to demonstrate a multilingual, region-aware storefront end-to-end.
- Product images are sourced from Unsplash and are product-specific.
- Designed for UAE supermarket experience with AED pricing and Arabic RTL support.
- All store data lives in `backend/config/dummy.php` — no database migrations needed for content.

---

## Contributing

This is a private project for **Bab al Awir Supermarket**. All contributions are welcome!
Please follow the existing code style and commit conventions.

---

<p align="center">Made with fresh produce & good intentions at <strong>Bab al Awir</strong>.</p>
<p align="center">Fresh every day, for every home</p>
