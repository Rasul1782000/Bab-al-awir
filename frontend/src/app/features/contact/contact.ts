import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { StoreLocation } from "../../core/models";

@Component({
  selector: "app-contact",
  standalone: false,
  templateUrl: "./contact.html",
  styleUrl: "./contact.scss",
})
export class Contact {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  email = "care@babalawir.ae";
  phone = "+971 4 000 0000";
  stores = signal<StoreLocation[]>([]);

  constructor() {
    this.api.getStoreLocations().subscribe((r) => this.stores.set(r.data ?? []));
  }
}
