import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { DeliveryOption } from "../../core/models";

@Component({
  selector: "app-delivery-options",
  standalone: false,
  templateUrl: "./delivery-options.html",
  styleUrl: "./delivery-options.scss",
})
export class DeliveryOptions {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  options = signal<DeliveryOption[]>([]);

  constructor() {
    this.api.getDeliveryOptions().subscribe((r) => this.options.set(r.data ?? []));
  }

  symbol = computed(() => (this.lang() === "ar" ? "د.إ" : "AED"));

  label(opt: DeliveryOption): string {
    return this.lang() === "ar" ? opt.label_ar : opt.label_en;
  }

  desc(opt: DeliveryOption): string {
    return this.lang() === "ar" ? opt.desc_ar : opt.desc_en;
  }
}
