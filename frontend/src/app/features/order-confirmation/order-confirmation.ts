import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { LanguageService } from "../../core/language.service";

@Component({
  selector: "app-order-confirmation",
  standalone: false,
  templateUrl: "./order-confirmation.html",
  styleUrl: "./order-confirmation.scss",
})
export class OrderConfirmation {
  private langSvc = inject(LanguageService);
  private route = inject(ActivatedRoute);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  orderId = "";

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.orderId = params["id"] ?? "BAW-XXXXXX";
    });
  }

  symbol = computed(() => (this.lang() === "ar" ? "د.إ" : "AED"));

  estimatedDelivery = "2–3 days";
  deliveryMethod = "Standard Delivery";
}
