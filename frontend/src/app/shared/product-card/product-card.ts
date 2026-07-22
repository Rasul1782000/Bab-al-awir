import { Component, computed, inject, input, output, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { LanguageService } from "../../core/language.service";
import { CartService } from "../../core/cart.service";
import { localized } from "../../core/localize";
import { Product } from "../../core/models";

@Component({
  selector: "app-product-card",
  standalone: false,
  templateUrl: "./product-card.html",
  styleUrl: "./product-card.scss",
})
export class ProductCard {
  private langSvc = inject(LanguageService);
  private cartSvc = inject(CartService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  product = input.required<Product>();
  symbol = input<string>("د.إ");
  addToCart = output<{ product: Product; quantity: number }>();

  quantity = signal(1);
  isInCart = computed(() => this.cartSvc.isInCart(this.product().id));
  cartQuantity = computed(() => this.cartSvc.getQuantity(this.product().id));

  name = computed(() => localized(this.product(), this.lang()));
  badgeLabel = computed(() => {
    const b = this.product().badge;
    if (!b) return "";
    const l = this.lang();
    const labels: Record<string, Record<string, string>> = {
      local: { en: "Local", ar: "محلي", ml: "പ്രാദേശികം", ta: "உள்ளூர்" },
      organic: { en: "Organic", ar: "عضوي", ml: "ഓർഗാനിക്", ta: "ஆர்கானிக்" },
      premium: { en: "Premium", ar: "ممتاز", ml: "പ്രീംയം", ta: "பிரீംയം" },
    };
    return labels[b]?.[l] ?? labels[b]?.["en"] ?? b;
  });

  increaseQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decreaseQuantity(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  onAddToCart(): void {
    this.addToCart.emit({ product: this.product(), quantity: this.quantity() });
  }

  addOneMore(): void {
    this.cartSvc.updateQuantity(this.product().id, this.cartQuantity() + 1);
  }

  removeOne(): void {
    this.cartSvc.updateQuantity(this.product().id, this.cartQuantity() - 1);
  }

  removeFromCart(): void {
    this.cartSvc.removeFromCart(this.product().id);
  }
}
