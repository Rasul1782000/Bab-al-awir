# Bab al Awir Supermarket — Web Application

## Project Overview

A multilingual grocery e-commerce platform with a calm, premium welcome gateway. 
The brand name **Bab al Awir** replaces the Spinneys design system that inspired the visual language.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Laravel (PHP) | 12.x |
| Frontend | Angular (TypeScript) | 22.x |
| Database | SQLite (Laravel internal use only — store data is hardcoded) | — |
| i18n | @ngx-translate/core | 16.x |
| Styling | CSS custom properties (no framework) | — |

## Architecture

```
Browser (Angular SPA)          Laravel API Backend
  :4200 (ng serve)              :8000 (php artisan serve)
       |                              |
       |-- GET /api/regions --------->|-- config('dummy.regions')
       |-- GET /api/languages ------->|-- config('dummy.languages')
       |-- GET /api/sections -------->|-- config('dummy.sections')
       |-- GET /api/categories ------>|-- config('dummy.categories')
       |-- GET /api/products --------->|-- config('dummy.products')
       |-- GET /api/user/profile ----->|-- config('dummy.user')
       |                              |
       |<--- JSON {success,message,data}
```

- No database is used for store content — all data is hardcoded in `backend/config/dummy.php`.
- SQLite handles only Laravel internals (sessions, cache, queue).
- Angular is a standalone SPA (no `NgModule`), bootstrapped via `bootstrapApplication`.

## Design System

Inspired by the Spinneys brand language, adapted for Bab al Awir.

| Token | Value | Usage |
|-------|-------|-------|
| Green | `#124634` | Text, accents, brand mark, hover states |
| White | `#FFFFFF` | Backgrounds, surface, CTA button fill |
| Muted | `rgba(18,70,52,0.62)` | Secondary text |
| Line | `rgba(18,70,52,0.12)` | Borders and dividers |
| Green soft | `rgba(18,70,52,0.06)` | Subtle hover/selected backgrounds |

- **Typography**: GT America (with Inter, Tajawal, Noto Sans Malayalam, Noto Sans Tamil as fallbacks per locale).
- **Radius**: 6px standard (`--radius-sm`), 12px large (`--radius-md`), 18px (`--radius-lg`), 999px pill.
- **Spacing**: 12px base unit (`--space-1`), scaled by multiples (24px, 36px, 48px, 72px).
- **Depth**: Flat surfaces — no shadows, no glass effects, no elevation.
- **Buttons**: Primary CTA is white fill + green text + white border (appears borderless) + 6px radius.

## Routing Flow

| Path | Component | Description |
|------|-----------|-------------|
| `/welcome` | `WelcomeGateway` | Region + language selection before entering app |
| `/` | `Layout` (shell) | Main app with header, nav, footer, and child routes |
| `/` (child) | `Home` | Hero section + featured products grid |
| `/categories` | `Categories` | Category grid with emoji icons |
| `/products` | `Products` | Filterable product grid by category |
| `/offers` | `Offers` | Product cards with discount badges |
| `/about` | `About` | Brand story |
| `/contact` | `Contact` | Contact form + business info |
| `/profile` | `Profile` | User profile, loyalty points, order history |
| `/**` | — | Wildcard redirects to `/welcome` |

The `welcomeGuard` prevents access to `/` and its children until a region is selected.

## Folder Structure

```
Bab al awir - Web app/
├── Aboutwebapp.md              ← This file
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/
│   │   │   │   │   ├── RegionController.php
│   │   │   │   │   ├── LanguageController.php
│   │   │   │   │   ├── SectionController.php
│   │   │   │   │   ├── CategoryController.php
│   │   │   │   │   ├── ProductController.php
│   │   │   │   │   └── UserController.php
│   │   │   │   └── Controller.php
│   │   │   │   └── Api/RespondsWithJson.php
│   │   │   ├── Models/User.php
│   │   │   └── Providers/AppServiceProvider.php
│   │   ├── config/
│   │   │   ├── dummy.php            ← All store data
│   │   │   ├── cors.php
│   │   │   └── ... (standard Laravel config)
│   │   ├── database/
│   │   │   ├── database.sqlite
│   │   │   └── migrations/
│   │   ├── resources/views/welcome.blade.php
│   │   ├── routes/
│   │   │   ├── api.php              ← 7 JSON endpoints
│   │   │   ├── web.php              ← Single welcome route
│   │   │   └── console.php
│   │   └── composer.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts
│   │   │   ├── app.html
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── core/
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── language.service.ts
│   │   │   │   ├── region.service.ts
│   │   │   │   ├── welcome.guard.ts
│   │   │   │   ├── localize.ts
│   │   │   │   └── models.ts
│   │   │   ├── features/
│   │   │   │   ├── welcome-gateway/
│   │   │   │   ├── layout/
│   │   │   │   ├── home/
│   │   │   │   ├── categories/
│   │   │   │   ├── products/
│   │   │   │   ├── offers/
│   │   │   │   ├── about/
│   │   │   │   ├── contact/
│   │   │   │   └── profile/
│   │   │   └── shared/
│   │   │       ├── flag-icon/
│   │   │       └── product-card/
│   │   ├── assets/i18n/
│   │   │   ├── en.json
│   │   │   ├── ar.json
│   │   │   ├── ml.json
│   │   │   └── ta.json
│   │   ├── styles.scss
│   │   ├── index.html
│   │   └── main.ts
│   ├── angular.json
│   │   ├── package.json
│   │   └── tsconfig.json
└── README.md
```

## Internationalization

Four languages are supported:

| Code | Language | Direction | Font |
|------|----------|-----------|------|
| `en` | English | LTR | Inter |
| `ar` | Arabic | RTL | Tajawal |
| `ml` | Malayalam | LTR | Noto Sans Malayalam |
| `ta` | Tamil | LTR | Noto Sans Tamil |

Language is persisted to `localStorage` (`baw_lang`). The `<html>` element's `lang`, `dir`, and CSS class update on language change.

## Setup & Running

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
ng serve                      # → http://localhost:4200
```

The Angular dev server proxies API calls to `http://localhost:8000/api/*` via the configured `ApiService.baseUrl`.

## API Endpoints

All return `{ success: true, message: string, data: T }`.

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/regions` | Array of regions with flags, currency |
| GET | `/api/languages` | Array of languages with direction, font |
| GET | `/api/sections` | Navigation sections (multilingual labels) |
| GET | `/api/categories` | Product categories with emoji icons |
| GET | `/api/products` | All products with prices and units |
| GET | `/api/products/{id}` | Single product or 404 |
| GET | `/api/user/profile` | Mock user profile with orders |

## Key Design Decisions

1. **No real database for store data** — All products, categories, regions, and languages are hardcoded in `config/dummy.php` for rapid prototyping. API controllers read from config, not the database.

2. **Standalone Angular components** — No `NgModule` wrappers; each component is self-contained with `imports` arrays.
