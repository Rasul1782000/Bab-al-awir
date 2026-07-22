import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { localized } from "../../core/localize";
import { Category, Offer as OfferData, Product, PromoBanner } from "../../core/models";

interface OfferItem {
  product: Product;
  percent: number;
  valid_until: string;
  label_en?: string;
  label_ar?: string;
}

@Component({
  selector: "app-offers",
  standalone: false,
  templateUrl: "./offers.html",
  styleUrl: "./offers.scss",
})
export class Offers {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  products = signal<Product[]>([]);
  offerData = signal<OfferData[]>([]);
  banners = signal<PromoBanner[]>([]);
  categories = signal<Category[]>([]);
  activeCategory = signal<number | null>(null);

  offers = computed<OfferItem[]>(() => {
    const prods = this.products();
    const offers = this.offerData();
    const productMap = new Map(prods.map((p) => [p.id, p]));
    return offers
      .filter((o) => productMap.has(o.product_id))
      .map((o) => {
        const product = { ...productMap.get(o.product_id)! };
        const discounted = Math.round(product.price * (1 - o.percent / 100) * 100) / 100;
        return {
          product: { ...product, price: discounted },
          percent: o.percent,
          valid_until: o.valid_until,
          label_en: o.label_en,
          label_ar: o.label_ar,
        };
      });
  });

  filtered = computed<OfferItem[]>(() => {
    const id = this.activeCategory();
    const list = this.offers();
    if (id === null) return list;
    return list.filter((o) => o.product.category_id === id);
  });

  bestDiscount = computed(() => {
    const offers = this.offerData();
    if (!offers.length) return 0;
    return Math.max(...offers.map((o) => o.percent));
  });

  constructor() {
    this.api.getProducts().subscribe((r) => this.products.set(r.data));
    this.api.getOffers().subscribe((r) => this.offerData.set(r.data));
    this.api.getPromoBanners().subscribe((r) => this.banners.set(r.data));
    this.api.getCategories().subscribe((r) => this.categories.set(r.data));
  }

  name(c: Category): string {
    return localized(c, this.lang());
  }

  hasOffersInCategory(catId: number): boolean {
    return this.offers().some((o) => o.product.category_id === catId);
  }

  setCategory(id: number | null): void {
    this.activeCategory.set(id);
  }

  countdown(dateStr: string): string {
    const target = new Date(dateStr).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d left`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h left`;
  }
}
