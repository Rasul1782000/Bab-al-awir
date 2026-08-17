import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { CartService } from "../../core/cart.service";
import { LanguageService } from "../../core/language.service";
import { localized, localizedDesc } from "../../core/localize";
import { Category, Product, Offer } from "../../core/models";

@Component({
  selector: "app-product-detail",
  standalone: false,
  templateUrl: "./product-detail.html",
  styleUrl: "./product-detail.scss",
})
export class ProductDetail {
  private api = inject(ApiService);
  private cartSvc = inject(CartService);
  private langSvc = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  product = signal<Product | null>(null);
  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  offersData = signal<Offer[]>([]);
  productId = signal<number | null>(null);
  quantity = signal(1);

  category = computed(() => {
    const p = this.product();
    if (!p) return null;
    return this.categories().find((c) => c.id === p.category_id) ?? null;
  });

  offer = computed(() => {
    const p = this.product();
    if (!p) return null;
    return this.offersData().find((o) => o.product_id === p.id) ?? null;
  });

  discountedPrice = computed(() => {
    const p = this.product();
    const o = this.offer();
    if (!p || !o) return null;
    return Math.round(p.price * (1 - o.percent / 100) * 100) / 100;
  });

  relatedProducts = computed(() => {
    const p = this.product();
    if (!p) return [];
    return this.allProducts()
      .filter((x) => x.category_id === p.category_id && x.id !== p.id)
      .slice(0, 4);
  });

  constructor() {
    this.api.getCategories().subscribe((r) => this.categories.set(r.data ?? []));
    this.api.getProducts().subscribe((r) => this.allProducts.set(r.data ?? []));
    this.api.getOffers().subscribe((r) => this.offersData.set(r.data ?? []));

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get("id"));
      if (!isNaN(id)) {
        this.productId.set(id);
        this.api.getProductById(id).subscribe((r) => {
          this.product.set(r.data ?? null);
        });
      } else {
        this.productId.set(null);
        this.product.set(null);
      }
    });
  }

  localizedName(item: Product | Category): string {
    return localized(item as any, this.lang());
  }

  localizedDesc(item: Product | Category): string {
    return localizedDesc(item as any, this.lang());
  }

  symbol = computed(() => (this.lang() === "ar" ? "د.إ" : "AED"));

  badgeLabel(badge: string): string {
    const labels: Record<string, Record<string, string>> = {
      local: { en: "Local", ar: "محلي", ml: "പ്രാദേശികം", ta: "உள்ளூர்" },
      organic: { en: "Organic", ar: "عضوي", ml: "ഓർഗാനിക്", ta: "ஆர்கானிக்" },
      premium: { en: "Premium", ar: "ممتاز", ml: "പ്രീംയം", ta: "பிரீமியம்" },
    };
    const l = this.lang();
    return labels[badge]?.[l] ?? labels[badge]?.["en"] ?? badge;
  }

  increaseQty(): void {
    this.quantity.update((q) => q + 1);
  }

  decreaseQty(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  addToCart(): void {
    const p = this.product();
    if (p) {
      this.cartSvc.addToCart(p, this.quantity());
      this.quantity.set(1);
      this.router.navigate(["/cart"]);
    }
  }

  isInCart(productId: number): boolean {
    return this.cartSvc.isInCart(productId);
  }

  addToCartFromRelated(product: Product): void {
    this.cartSvc.addToCart(product, 1);
  }

  stars(rating: number): number[] {
    return Array.from({ length: Math.max(0, Math.min(5, Math.round(rating))) });
  }

  starPlaceholders(n: number): number[] {
    return Array.from({ length: n });
  }

  productName(product: Product): string {
    return localized(product, this.lang());
  }

  readonly reviews = [
    {
      name_en: "Sarah M.",
      name_ar: "سارة م.",
      rating: 5,
      text_en: "Amazing quality! The apples were crisp and sweet, just like the description. Will definitely order again.",
      text_ar: "جودة رائعة! كانت التفاح مقرمشة وحلوة مثل الوصف. بالتأكيد سأطلب مرة أخرى.",
      date: "2026-07-12",
    },
    {
      name_en: "Ahmed K.",
      name_ar: "أحمد ك.",
      rating: 4,
      text_en: "Fresh produce, great packaging. The delivery was quick and the items were perfect for my weekly meal prep.",
      text_ar: "منتجات طازجة، تغليف رائع. التسليم كان سريعاً والمنتجات كانت مثالية لتحضير وجباتي الأسبوعية.",
      date: "2026-07-05",
    },
    {
      name_en: "Fatima R.",
      name_ar: "فاطمة ر.",
      rating: 5,
      text_en: "Best supermarket in Dubai! The quality is consistently excellent and the prices are very fair.",
      text_ar: "أفضل سوبرماركت في دبي! الجودة متميزة باستمرار والأسعار منصفة جداً.",
      date: "2026-06-28",
    },
  ];
}
