import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { CartService } from "../../core/cart.service";
import { LanguageService } from "../../core/language.service";
import { AuthService } from "../../core/auth.service";
import { DeliveryOption, SavedAddress } from "../../core/models";

@Component({
  selector: "app-checkout",
  standalone: false,
  templateUrl: "./checkout.html",
  styleUrl: "./checkout.scss",
})
export class Checkout {
  private api = inject(ApiService);
  private cartSvc = inject(CartService);
  private langSvc = inject(LanguageService);
  private authSvc = inject(AuthService);
  private router = inject(Router);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  cart = this.cartSvc.cart$;
  deliveryOptions = signal<DeliveryOption[]>([]);
  step = signal(1);
  selectedAddress = signal<SavedAddress | null>(null);
  selectedDelivery = signal<string>("standard");
  paymentMethod = signal<string>("card");

  constructor() {
    this.api.getDeliveryOptions().subscribe((r) => this.deliveryOptions.set(r.data ?? []));
  }

  symbol = computed(() => (this.lang() === "ar" ? "د.إ" : "AED"));

  itemCount = computed(() => {
    return this.cart().items.reduce((sum, item) => sum + item.quantity, 0);
  });

  subtotal = computed(() => this.cart().subtotal);
  tax = computed(() => this.cart().tax);
  deliveryFee = computed(() => {
    const opt = this.deliveryOptions().find((d) => d.method === this.selectedDelivery());
    return opt ? opt.fee : 0;
  });

  grandTotal = computed(() => {
    return this.subtotal() + this.tax() + this.deliveryFee();
  });

  deliveryDetail = computed(() => {
    return this.deliveryOptions().find((d) => d.method === this.selectedDelivery());
  });

  isFreeDelivery = computed(() => {
    const opt = this.deliveryDetail();
    if (!opt) return false;
    if (opt.free_above === null) return false;
    return this.subtotal() >= opt.free_above;
  });

  savedAddresses = computed(() => {
    const user = this.authSvc.user();
    return user?.saved_addresses ?? [];
  });

  nextStep(): void {
    if (this.step() < 3) this.step.update((s) => s + 1);
  }

  prevStep(): void {
    if (this.step() > 1) this.step.update((s) => s - 1);
  }

  selectAddress(addr: SavedAddress): void {
    this.selectedAddress.set(addr);
    this.nextStep();
  }

  selectDelivery(method: string): void {
    this.selectedDelivery.set(method);
  }

  selectPayment(method: string): void {
    this.paymentMethod.set(method);
  }

  proceedToPayment(): void {
    if (this.isFreeDelivery()) {
      this.placeOrder();
    } else {
      this.nextStep();
    }
  }

  placeOrder(): void {
    const orderId = "BAW-" + Math.floor(100000 + Math.random() * 900000);
    this.cartSvc.clearCart();
    this.router.navigate(["/order-confirmation"], { queryParams: { id: orderId } });
  }
}
