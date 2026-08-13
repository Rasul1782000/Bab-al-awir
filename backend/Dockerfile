# Laravel backend for Render (PHP is deployed via Docker, not a native runtime)
FROM php:8.3-cli

# System deps + PHP extensions Laravel needs
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    pkg-config \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    libzip-dev \
    libsqlite3-dev \
    && docker-php-ext-install \
        pdo \
        pdo_sqlite \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        curl \
        zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP dependencies (copy lockfile first for layer caching)
COPY composer.json composer.lock ./
COPY artisan ./
COPY bootstrap ./bootstrap/
COPY routes ./routes/
COPY app ./app/
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction

# Application code
COPY . .

# Laravel bootstrap: env, app key, sqlite db, migrations
RUN cp .env.example .env || true \
    && php artisan key:generate --force \
    && touch database/database.sqlite \
    && php artisan migrate --force \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80

# Bind to Render's assigned port
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-80}"]
