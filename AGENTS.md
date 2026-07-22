# Bab al Awir Web Application - Agent Guide

## Project Overview

A multilingual grocery e-commerce platform with a calm, premium welcome gateway. The brand name "Bab al Awir" replaces the Spinneys design system that inspired the visual language.

## Tech Stack

**Backend**
- Laravel (PHP) 12.x
- SQLite (for Laravel internals only - sessions, cache, queue)
- All store data is hardcoded in `backend/config/dummy.php`

**Frontend**
- Angular (TypeScript) 22.x
- Standalone SPA (no `NgModule`), bootstrapped via `bootstrapApplication`
- No CSS framework - uses CSS custom properties
- Internationalization: `@ngx-translate/core` 16.x

**Language Support**
- 4 languages: English (`en`), Arabic (`ar`), Malayalam (`ml`), Tamil (`ta`)
- Language persisted in `localStorage` (`baw_lang`)
- Right-to-left (RTL) support for Arabic

## Directory Structure

```
Bab al awir - Web app/
├── Aboutwebapp.md              ← Project documentation
├── backend/                   ← Laravel API
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
│   │   │   └── (standard Laravel config)
│   │   ├── database/
│   │   │   ├── database.sqlite
│   │   │   └── migrations/
│   │   ├── resources/views/welcome.blade.php
│   │   ├── routes/
│   │   │   ├── api.php              ← 7 JSON endpoints
│   │   │   ├── web.php              ← Single welcome route
│   │   │   └── console.php
│   │   └── composer.json
├── frontend/                  ← Angular SPA
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

## Essential Commands

### Backend (Laravel)

```bash
cd backend
composer install
# Configure environment
cp .env.example .env
php artisan key:generate
# Create internal tables (SQLite)
php artisan migrate
# Run Laravel development server
php artisan serve  # → http://localhost:8000
```

### Frontend (Angular)

```bash
cd frontend
npm install
# Start Angular dev server (also proxies API calls to Laravel)
ng serve  # → http://localhost:4200

# Build for production
ng build

# Run unit tests
ng test
```

### Testing

**Unit Tests**
```bash
cd backend
phpunit  # Runs PHPUnit tests in tests/ directory

# Or via composer scripts
cd backend
composer test
```

**Frontend Tests**
```bash
cd frontend
ng test  # Runs Vitest unit tests
```

### Development Scripts

**Backend package.json scripts**
```bash
cd backend
# Full development stack (server + queue + logs + queue listener)
composer dev

# Common Laravel commands
cd backend
php artisan route:list
php artisan config:show
php artisan cache:clear
php artisan route:clear
```

## Code Organization and Architecture

### Backend Architecture

**Laravel Structure**
- Standard Laravel 12.x structure
- PSR-4 autoload: `App\` namespace maps to `app/` directory
- API controllers in `app/Http/Controllers/Api/`
- Common trait `RespondsWithJson` in `app/Http/Controllers/Api/RespondsWithJson.php`

**API Pattern**
- All endpoints return consistent JSON format: `{ success: true, message: string, data: T }`
- API routes defined in `backend/routes/api.php`
- Data source: `backend/config/dummy.php` (hardcoded, no database for store data)

**Key Controllers**
- `RegionController`: `/api/regions`
- `LanguageController`: `/api/languages`
- `SectionController`: `/api/sections`
- `CategoryController`: `/api/categories`
- `ProductController`: `/api/products`, `/api/products/{id}`
- `UserController`: `/api/user/profile`
- `ContentController`: Various content endpoints

### Frontend Architecture

**Angular Structure**
- Standalone components (no `NgModule` wrappers)
- Each component is self-contained with `imports` arrays
- Feature modules under `features/` directory
- Core utilities in `core/` directory
- Shared components in `shared/` directory

**Key Services**
- `api.service.ts`: Makes HTTP requests to Laravel backend
- `language.service.ts`: Handles language switching
- `region.service.ts`: Manages region selection
- `localize.ts`: Internationalization utilities

**Routing**
- `app.routes.ts`: Main application routes
- `welcome.guard.ts`: Prevents access before region/language selection
- Public route `/welcome` for initial setup
- Main app accessible at `/` after welcome completion

## Naming Conventions and Style Patterns

### PHP (Laravel)
- Uses standard Laravel naming conventions
- Controller methods use camelCase (e.g., `index()`, `profile()`)
- Trait `RespondsWithJson` uses method `ok()` for successful responses
- Config values accessed via `config('key')`

### TypeScript (Angular)
- Component files: `component-name.component.ts/html`
- Service files: snake_case (e.g., `api.service.ts`)
- Feature directories: kebab-case (e.g., `welcome-gateway`, `product-card`)
- Language files: `en.json`, `ar.json`, etc.

### CSS/SCSS
- CSS custom properties for design tokens
- `$` variables for Sass (if used)
- BEM-like naming in SCSS

## Testing Approach and Patterns

### Backend Testing
- Uses PHPUnit (PHPUnit 11.5.3)
- Test directory: `tests/`
- No Eloquent models used for store data (everything from config)

### Frontend Testing
- Uses Vitest as test runner
- Component-based architecture with inline templates
- Standalone components make testing easier
- No `NgModule` complexity

### Integration Testing
- Backend and frontend both run locally (ports 8000 and 4200)
- Angular dev server can proxy API calls
- No external database dependencies

## Important Gotchas and Non-Obvious Patterns

### Backend Gotchas

1. **No Database for Store Data**
   - ALL products, categories, regions, languages are hardcoded in `config/dummy.php`
   - Only SQLite is used for Laravel internals (sessions, cache, queue)
   - No migrations needed for store data
   - Be careful not to overwrite `config/dummy.php`

2. **Hardcoded Country Flags**
   - Regions use simple country codes (`ae`, `sa`) for flags
   - Icons are based on country codes, not image files

3. **Angular Proxy Configuration**
   - Ensure Angular dev server proxies API calls correctly
   - Check `angular.json` for proxy configuration

### Frontend Gotchas

1. **Standalone Components**
   - Each component has its own `imports` array
   - No `NgModule` declarations to worry about
   - Components might import each other directly

2. **Angular 22 Features**
   - Uses `bootstrapApplication` instead of `NgModule` bootstrap
   - Components are self-contained
   - Reactive forms may be used

3. **Language Direction**
   - Arabic uses RTL (`dir='rtl'`)
   - HTML element `lang` and `dir` attributes change with language
   - `localStorage` key is `baw_lang`

4. **CSS Variables**
   - All styling uses CSS custom properties
   - Design tokens defined in `styles.scss`
   - No external CSS frameworks

### Working with Data

1. **Dummy.php Structure**
   - Multi-language data structure for all entities
   - Each item has `_en`, `_ar`, `_ml`, `_ta` variants where applicable
   - Images are hosted on external URLs (Unsplash)

2. **Image Hosting**
   - Product/images hosted on external Unsplash URLs
   - No local image assets to manage

### Configuration

1. **Environment Setup**
   ```bash
   # Backend (.env)
   APP_DEBUG=true
   DB_CONNECTION=sqlite
   APP_URL=http://localhost
   APP_ENV=local
   ```

2. **Frontend (.angular.json)**
   - API proxy configuration to `http://localhost:8000/api/*`

## Common Development Tasks

### Adding New Language
1. Add language code to `languages` array in `dummy.php`
2. Create translation file in `frontend/assets/i18n/` (e.g., `es.json`)
3. Update Angular `localize.ts` if needed for direction/font
4. Ensure all multilingual strings are updated everywhere

### Adding New Product Category
1. Add entry to `categories` array in `dummy.php`
2. Must include: `id`, `slug`, `icon`, `name_*` (all languages), `desc_*` (all languages), `image` URL

### API Rate Limiting
No API rate limiting implemented by default. Use Laravel's throttle middleware if needed.

### Cache Management
- Use `php artisan cache:clear`
- Use `php artisan config:clear`
- Frontend: Angular build artifacts in `dist/`

## Project-Specific Context

This is a **proof-of-concept e-commerce platform** designed for rapid prototyping:
- No real database needed
- All data is in PHP array in `config/dummy.php`
- Designed to demonstrate multilingual frontend/backend integration
- Uses external image hosting to reduce build complexity
- Angular standalone components for modern architecture

## File References

- **Main documentation**: `Aboutwebapp.md`
- **Backend code organization**: `backend/README.md`
- **Frontend code organization**: `frontend/README.md`
- **All store data**: `backend/config/dummy.php`
- **API endpoints**: `backend/routes/api.php`
