import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { CartService } from "../../core/cart.service";
import { LanguageService } from "../../core/language.service";
import { localized } from "../../core/localize";
import { Category, Product } from "../../core/models";

@Component({
  selector: "app-products",
  standalone: false,
  templateUrl: "./products.html",
  styleUrl: "./products.scss",
})
export class Products {
  private api = inject(ApiService);
  private cartSvc = inject(CartService);
  private langSvc = inject(LanguageService);
  private route = inject(ActivatedRoute);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  cart = this.cartSvc.cart$;
  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  activeCategory = signal<number | null>(null);
  searchQuery = signal<string>("");

  filtered = computed(() => {
    const id = this.activeCategory();
    const q = this.searchQuery().toLowerCase().trim();
    let result = id === null ? this.products() : this.products().filter((p) => p.category_id === id);
    if (q) {
      result = result.filter(
        (p) =>
          p.name_en.toLowerCase().includes(q) ||
          p.name_ar.includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }
    return result;
  });

  totalInCart = computed(() => {
    return this.cart().items.reduce((sum, item) => sum + item.subtotal, 0);
  });

  taxAmount = computed(() => {
    return this.totalInCart() * 0.05;
  });

  grandTotal = computed(() => {
    return this.totalInCart() + this.taxAmount();
  });

  constructor() {
    this.api.getCategories().subscribe((r) => this.categories.set(r.data ?? []));
    this.api.getProducts().subscribe((r) => this.products.set(r.data ?? []));
    this.route.queryParams.subscribe((params) => {
      const q = params["q"] ?? "";
      this.searchQuery.set(q);
      const catId = params["category"] ? Number(params["category"]) : null;
      this.activeCategory.set(catId);
    });
  }

  setCategory(id: number | null): void {
    this.activeCategory.set(id);
  }

  name(c: Category): string {
    return localized(c, this.lang());
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.cartSvc.addToCart(product, quantity);
  }

  isInCart(productId: number): boolean {
    return this.cartSvc.isInCart(productId);
  }

  getCartQuantity(productId: number): number {
    return this.cartSvc.getQuantity(productId);
  }

  localizedName(product: Product): string {
    return localized(product, this.lang());
  }
}
