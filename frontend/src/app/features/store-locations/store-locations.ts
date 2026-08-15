import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { StoreLocation } from "../../core/models";

@Component({
  selector: "app-store-locations",
  standalone: false,
  templateUrl: "./store-locations.html",
  styleUrl: "./store-locations.scss",
})
export class StoreLocations {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  stores = signal<StoreLocation[]>([]);

  constructor() {
    this.api.getStoreLocations().subscribe((r) => this.stores.set(r.data ?? []));
  }

  name(s: StoreLocation): string {
    return this.lang() === "ar" ? s.name_ar : s.name;
  }

  address(s: StoreLocation): string {
    return this.lang() === "ar" ? s.address_ar : s.address;
  }

  hoursEntries(s: StoreLocation): [string, string][] {
    return Object.entries(s.hours ?? {});
  }
}
