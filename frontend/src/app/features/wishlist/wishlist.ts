import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { CartService } from "../../core/cart.service";
import { LanguageService } from "../../core/language.service";
import { WishlistService } from "../../core/wishlist.service";
import { localized } from "../../core/localize";
import { Product } from "../../core/models";

@Component({
  selector: "app-wishlist",
  standalone: false,
  templateUrl: "./wishlist.html",
  styleUrl: "./wishlist.scss",
})
export class Wishlist {
  private cartSvc = inject(CartService);
  private langSvc = inject(LanguageService);
  private wishlistSvc = inject(WishlistService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  items = this.wishlistSvc.wishlist$;
  itemCount = computed(() => this.items().length);

  isInCart(productId: number): boolean {
    return this.cartSvc.isInCart(productId);
  }

  addToCart(product: Product): void {
    this.cartSvc.addToCart(product, 1);
  }

  removeFromWishlist(product: Product): void {
    this.wishlistSvc.removeFromWishlist(product.id);
  }

  productName(product: Product): string {
    return localized(product, this.lang());
  }

  symbol = computed(() => (this.lang() === "ar" ? "د.إ" : "AED"));
}
