import { Injectable, signal } from "@angular/core";
import { Product } from "./models";

const STORAGE_KEY = "baw_wishlist";

@Injectable({ providedIn: "root" })
export class WishlistService {
  private items = signal<Product[]>([]);

  constructor() {
    this.loadWishlist();
  }

  wishlist$ = this.items.asReadonly();

  isInWishlist(productId: number): boolean {
    return this.items().some((p) => p.id === productId);
  }

  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  addToWishlist(product: Product): void {
    if (this.isInWishlist(product.id)) return;
    this.items.update((items) => [...items, product]);
    this.saveWishlist();
  }

  removeFromWishlist(productId: number): void {
    this.items.update((items) => items.filter((p) => p.id !== productId));
    this.saveWishlist();
  }

  clearWishlist(): void {
    this.items.set([]);
    this.saveWishlist();
  }

  private saveWishlist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
    } catch {
      /* storage unavailable */
    }
  }

  private loadWishlist(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.items.set(JSON.parse(saved) as Product[]);
      }
    } catch {
      this.clearWishlist();
    }
  }
}
