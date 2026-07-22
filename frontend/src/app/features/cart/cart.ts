import { Component, inject } from "@angular/core";
import { CartService } from "../../core/cart.service";
import { LanguageService } from "../../core/language.service";
import { localized } from "../../core/localize";
import { CartItem } from "../../core/models";

@Component({
  selector: "app-cart",
  standalone: false,
  templateUrl: "./cart.html",
  styleUrl: "./cart.scss",
})
export class Cart {
  private cartSvc = inject(CartService);
  private langSvc = inject(LanguageService);

  cart = this.cartSvc.cart$;
  itemCount = this.cartSvc.itemCount;

  getPriceClass(productPrice: number): string {
    return productPrice < 10 ? "cheap" : productPrice < 25 ? "medium" : "expensive";
  }

  increaseQuantity(productId: number): void {
    this.cartSvc.updateQuantity(productId, this.cartSvc.getQuantity(productId) + 1);
  }

  decreaseQuantity(productId: number): void {
    const currentQty = this.cartSvc.getQuantity(productId);
    if (currentQty > 1) {
      this.cartSvc.updateQuantity(productId, currentQty - 1);
    } else {
      this.cartSvc.removeFromCart(productId);
    }
  }

  removeItem(productId: number): void {
    this.cartSvc.removeFromCart(productId);
  }

  isVisible(): boolean {
    return this.cartSvc.cartVisible();
  }

  localizedName(item: CartItem): string {
    return localized(item.product as any, this.langSvc.current);
  }

  toggleCart(): void {
    this.cartSvc.toggleCartVisibility?.();
  }

  clearCart(): void {
    this.cartSvc.clearCart();
  }
}