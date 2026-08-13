# 🛒 Bab al Awir — Web App

> 🌿 **Fresh every day, for every home** — a calm, premium multilingual grocery shopping experience.

**Bab al Awir** is a multilingual grocery 🛒 e-commerce platform built as a proof-of-concept.
It pairs an **Angular** single-page front end with a lightweight **Laravel** JSON API to
demonstrate a polished, region- and language-aware storefront — no heavy database required.

---

## ✨ What is this application?

Bab al Awir is a neighbourhood-supermarket storefront reimagined for the web. Visitors are
greeted by a splash **flash screen**, then guided through a **welcome gateway** where they pick
their 🌍 **region** and 🗣️ **language** before entering the shop. From there they can browse
📦 categories, 🥦 products, 🏷️ offers, read the 💚 brand story, contact the store, and manage
their 👤 profile — all in their chosen language, with right-to-left layout for Arabic.

The app is a **front-end-first prototype**: all catalogue data (regions, languages, categories,
products, users) lives in a single config file on the Laravel side, so the whole experience can
be explored and demoed without setting up a database.

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

---

## 🧱 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| 🐘 Backend | Laravel (PHP) | 12.x |
| 🅰️ Frontend | Angular (TypeScript) | 22.x |
| 🗄️ Database | SQLite (Laravel internals only) | — |
| 🌐 i18n | `@ngx-translate/core` | 16.x |
| 🎨 Styling | CSS custom properties (no framework) | — |

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

---

## 🧭 Routing & Flow

| Path | Screen | Description |
|------|--------|-------------|
| `/flash` | 💡 Flash screen | Branded splash shown on first load |
| `/welcome` | 🌿 Welcome gateway | Region + language selection before entering the app |
| `/login` · `/signup` · `/forgot-password` | 🔐 Auth | Login, sign up, and password reset (inside `AuthShell`) |
| `/` | 🧱 Layout shell | Main app: header, nav, footer + child routes |
| `/` (child) | 🏠 Home | Hero + featured products grid |
| `/categories` | 📦 Categories | Category grid with emoji icons |
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
| GET | `/api/user/profile` | Mock user profile with orders |
| POST | `/api/login` | Issue a demo auth token |
| POST | `/api/signup` | Create a demo account |
| POST | `/api/forgot-password` | Send a (mock) reset link |

---

## 🎨 Design System

A calm, flat visual language built on CSS custom properties (`frontend/src/styles.scss`):

| Token | Value | Usage |
|-------|-------|-------|
| 🟢 Green | `#1f7a3d` | Brand mark, accents, links |
| 🟠 Accent | `#ff7a18` | CTAs, highlights |
| ⬛ Dark green | `#1a332b` | Auth shell background |
| ⬜ White | `#ffffff` | Surfaces, text on dark |
| 🌫️ Muted | `#6b7785` | Secondary text |
| ➖ Line | `rgba(31,42,55,0.12)` | Borders, dividers |

- **Typography** — Montserrat (Latin) with Tajawal / Noto Sans Malayalam / Noto Sans Tamil per locale.
- **Radius** — `8px` (`--radius-sm`), `14px` (`--radius-md`), `22px` (`--radius-lg`), `999px` pill.
- **Spacing** — `12px` base unit (`--space-1`) scaled by multiples (`24 / 36 / 48 / 72px`).
- **Depth** — flat surfaces; subtle motion only.

---

## 📁 Project Structure

```
Bab al awir - Web app/
├── 📄 README.md                ← This file
├── 📄 Aboutwebapp.md           ← Detailed architecture notes
├── 🐘 backend/                  ← Laravel JSON API
│   └── config/dummy.php         ← All store + auth data
└── 🅰️ frontend/                ← Angular standalone SPA
    └── src/app/
        ├── core/               ← services, guard, models
        ├── features/           ← welcome, auth, layout, home, …
        └── shared/             ← product-card, auth-shell, flag-icon
```

---

## 📝 Notes

- 🧪 This is a **prototype / POC** — auth uses hardcoded demo data, not real password hashing.
- 🔒 `.env` is gitignored; no secrets are committed.
- 🌿 Built to demonstrate a multilingual, region-aware storefront end-to-end.

---

<p align="center">💚 Made with fresh produce & good intentions at <strong>Bab al Awir</strong>.</p>
