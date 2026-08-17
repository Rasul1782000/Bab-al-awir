import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { CartService } from "../../core/cart.service";
import { LanguageService } from "../../core/language.service";
import { RegionService } from "../../core/region.service";
import { localized } from "../../core/localize";
import { Brand, Category, Offer, Product, PromoBanner, Testimonial, BrandValue } from "../../core/models";

@Component({
  selector: "app-home",
  standalone: false,
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  public cartSvc = inject(CartService);
  private regionSvc = inject(RegionService);
  private router = inject(Router);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  offers = signal<Offer[]>([]);
  promos = signal<PromoBanner[]>([]);
  testimonials = signal<Testimonial[]>([]);
  brandValues = signal<BrandValue[]>([]);
  brands = signal<Brand[]>([]);
  failedBrandImgs = signal<Set<number>>(new Set());

  productsReady = signal(false);
  categoriesReady = signal(false);
  offersReady = signal(false);
  promosReady = signal(false);
  testimonialsReady = signal(false);
  brandValuesReady = signal(false);
  brandsReady = signal(false);

  featured = computed(() => this.products().slice(0, 8));
  bestSellers = computed(() => this.products().slice(4, 12));
  symbol = computed(() => (this.lang() === "ar" ? "د.إ" : "AED"));
  region = computed(() => this.regionSvc.current);
  cartSubtotal = computed(() => {
    const cart = this.cartSvc.cart$();
    return cart.subtotal;
  });
  freeDeliveryMin = computed(() => {
    const r = this.regionSvc.current;
    const reg = r as any;
    return reg ? reg.free_delivery_min : 100;
  });
  freeDeliveryProgress = computed(() => {
    const min = this.freeDeliveryMin();
    if (!min) return 100;
    return Math.min((this.cartSubtotal() / min) * 100, 100);
  });
  freeDeliveryRemaining = computed(() => {
    const min = this.freeDeliveryMin();
    if (!min) return 0;
    return Math.max(min - this.cartSubtotal(), 0);
  });

  activeOffers = computed(() => {
    const now = new Date();
    return this.offers().filter((o) => new Date(o.valid_until) >= now);
  });

  mainPromo = computed(() => this.promos()[0] ?? null);
  heroSidePromos = computed(() => this.promos().slice(1, 3));
  bottomPromo = computed(() => this.promos()[2] ?? null);

  constructor() {
    this.api.getProducts().subscribe((r) => {
      this.products.set(r.data ?? []);
      this.productsReady.set(true);
    });
    this.api.getCategories().subscribe((r) => {
      this.categories.set(r.data ?? []);
      this.categoriesReady.set(true);
    });
    this.api.getOffers().subscribe((r) => {
      this.offers.set(r.data ?? []);
      this.offersReady.set(true);
    });
    this.api.getPromoBanners().subscribe((r) => {
      this.promos.set(r.data ?? []);
      this.promosReady.set(true);
    });
    this.api.getTestimonials().subscribe((r) => {
      this.testimonials.set(r.data ?? []);
      this.testimonialsReady.set(true);
    });
    this.api.getBrandValues().subscribe((r) => {
      this.brandValues.set(r.data ?? []);
      this.brandValuesReady.set(true);
    });
    this.api.getBrands().subscribe((r) => {
      this.brands.set(r.data ?? []);
      this.brandsReady.set(true);
    });
  }

  name(c: Category): string {
    return localized(c, this.lang());
  }

  onBrandImgError(brand: Brand): void {
    this.failedBrandImgs.update((s) => {
      const next = new Set(s);
      next.add(brand.id);
      return next;
    });
  }

  getOfferProduct(offer: Offer): Product | undefined {
    return this.products().find((p) => p.id === offer.product_id);
  }

  getOldPrice(offer: Offer): number {
    const product = this.getOfferProduct(offer);
    if (!product) return 0;
    return +(product.price / (1 - offer.percent / 100)).toFixed(2);
  }

  isOfferExpired(offer: Offer): boolean {
    return new Date(offer.valid_until) < new Date();
  }

  getOldPriceFromProduct(product: Product): number | null {
    const offer = this.offers().find((o) => o.product_id === product.id && !this.isOfferExpired(o));
    if (!offer) return null;
    return +(product.price / (1 - offer.percent / 100)).toFixed(2);
  }

  getDiscountFromProduct(product: Product): number | null {
    const offer = this.offers().find((o) => o.product_id === product.id && !this.isOfferExpired(o));
    return offer ? offer.percent : null;
  }

  getRandomRating(): number {
    return 3 + Math.floor(Math.random() * 3);
  }

  getStockProgress(): number {
    return 20 + Math.floor(Math.random() * 60);
  }

  getTimeRemaining(): string {
    const hours = 1 + Math.floor(Math.random() * 12);
    const mins = Math.floor(Math.random() * 60);
    return `${hours}h ${mins}m`;
  }

  onHeroSearch(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const q = input.value.trim();
    if (q.length >= 2) {
      this.router.navigate(["/products"], { queryParams: { q } });
    }
  }

  prev(): void {
    const el = document.querySelector(".bestseller__track");
    el?.scrollBy({ left: -260, behavior: "smooth" });
  }

  next(): void {
    const el = document.querySelector(".bestseller__track");
    el?.scrollBy({ left: 260, behavior: "smooth" });
  }

  changeRegion(): void {
    this.router.navigate(["/welcome"]);
  }
}
