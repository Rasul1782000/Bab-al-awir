import { Component, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
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
  private router = inject(Router);

  cart = this.cartSvc.cart$;
  itemCount = this.cartSvc.itemCount;

  subtotal = computed(() => this.cart().subtotal);
  tax = computed(() => this.cart().tax);
  total = computed(() => this.cart().total);

  isEmpty = computed(() => this.cart().items.length === 0);

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

  localizedName(item: CartItem): string {
    return localized(item.product as any, this.langSvc.current);
  }

  clearCart(): void {
    this.cartSvc.clearCart();
  }

  continueShopping(): void {
    this.router.navigate(["/products"]);
  }

  proceedToCheckout(): void {
    this.router.navigate(["/checkout"]);
  }

  isVisible(): boolean {
    return this.cartSvc.cartVisible();
  }

  toggleCart(): void {
    this.cartSvc.toggleCartVisibility?.();
  }
}
