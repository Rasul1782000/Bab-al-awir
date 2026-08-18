import { Component, computed, inject, input, output, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { LanguageService } from "../../core/language.service";
import { CartService } from "../../core/cart.service";
import { OrderService, PlacedOrder } from "../../core/order.service";
import { localized } from "../../core/localize";
import { CartItem } from "../../core/models";

@Component({
  selector: "app-payment-modal",
  standalone: false,
  templateUrl: "./payment-modal.html",
  styleUrl: "./payment-modal.scss",
})
export class PaymentModal {
  private cartSvc = inject(CartService);
  private langSvc = inject(LanguageService);
  private orderSvc = inject(OrderService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  open = input<boolean>(false);
  symbol = input<string>("AED");
  deliveryFee = input<number>(0);
  deliveryMethod = input<string>("Standard Delivery");
  address = input<CartItem["product"] | any>(null);
  paymentMethodInput = input<string>("card");

  closed = output<void>();
  paid = output<PlacedOrder>();

  cart = this.cartSvc.cart$;

  subtotal = computed(() => this.cart().subtotal);
  tax = computed(() => this.cart().tax);
  grandTotal = computed(() => this.subtotal() + this.tax() + this.deliveryFee());

  method = signal<string>("card");
  processing = signal(false);
  succeeded = signal(false);

  bank = signal<string>("");
  wallet = signal<string>("");
  upiId = signal<string>("");

  cardNumber = signal("");
  cardName = signal("");
  cardExpiry = signal("");
  cardCvv = signal("");

  constructor() {
    this.method.set(this.paymentMethodInput());
  }

  localizedName(item: CartItem): string {
    return localized(item.product as any, this.langSvc.current);
  }

  increase(productId: number): void {
    this.cartSvc.updateQuantity(productId, this.cartSvc.getQuantity(productId) + 1);
  }

  decrease(productId: number): void {
    const q = this.cartSvc.getQuantity(productId);
    if (q > 1) this.cartSvc.updateQuantity(productId, q - 1);
    else this.cartSvc.removeFromCart(productId);
  }

  selectMethod(m: string): void {
    this.method.set(m);
  }

  canPay(): boolean {
    if (this.cart().items.length === 0) return false;
    if (this.method() === "card") {
      return (
        this.cardNumber().replace(/\s/g, "").length >= 15 &&
        this.cardName().trim().length > 2 &&
        this.cardExpiry().length >= 4 &&
        this.cardCvv().length >= 3
      );
    }
    if (this.method() === "upi") return this.upiId().includes("@");
    if (this.method() === "netbanking") return this.bank().length > 0;
    if (this.method() === "wallet") return this.wallet().length > 0;
    return true;
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
    this.cardNumber.set(v);
    input.value = v;
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.substring(0, 2) + "/" + v.substring(2, 4);
    this.cardExpiry.set(v);
    input.value = v;
  }

  onCvv(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.cardCvv.set(input.value.replace(/\D/g, "").substring(0, 4));
    input.value = this.cardCvv();
  }

  onUpi(event: Event): void {
    this.upiId.set((event.target as HTMLInputElement).value);
  }

  pay(): void {
    if (!this.canPay() || this.processing()) return;
    this.processing.set(true);
    setTimeout(() => {
      const order = this.orderSvc.placeOrder({
        items: this.cart().items,
        subtotal: this.subtotal(),
        tax: this.tax(),
        deliveryFee: this.deliveryFee(),
        total: this.grandTotal(),
        status: "confirmed",
        deliveryMethod: this.deliveryMethod(),
        paymentMethod: this.method(),
        address: this.address(),
        estimatedDelivery: "2–3 days",
      });
      this.processing.set(false);
      this.succeeded.set(true);
      this.cartSvc.clearCart();
      setTimeout(() => this.paid.emit(order), 900);
    }, 1500);
  }

  close(): void {
    if (this.processing()) return;
    this.closed.emit();
  }
}
