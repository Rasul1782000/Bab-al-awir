import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import {
  BrandValue,
  DeliveryOption,
  StoreLocation,
  TeamMember,
  Testimonial,
} from "../../core/models";

@Component({
  selector: "app-about",
  standalone: false,
  templateUrl: "./about.html",
  styleUrl: "./about.scss",
})
export class About {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  values = signal<BrandValue[]>([]);
  team = signal<TeamMember[]>([]);
  testimonials = signal<Testimonial[]>([]);
  stores = signal<StoreLocation[]>([]);
  delivery = signal<DeliveryOption[]>([]);

  symbol = computed(() => (this.lang() === "ar" ? "د.إ" : "AED"));

  constructor() {
    this.api.getBrandValues().subscribe((r) => this.values.set(r.data ?? []));
    this.api.getTeamMembers().subscribe((r) => this.team.set(r.data ?? []));
    this.api.getTestimonials().subscribe((r) => this.testimonials.set(r.data ?? []));
    this.api.getStoreLocations().subscribe((r) => this.stores.set(r.data ?? []));
    this.api.getDeliveryOptions().subscribe((r) => this.delivery.set(r.data ?? []));
  }

  stars(rating: number): number[] {
    return Array.from({ length: Math.max(0, Math.min(5, Math.round(rating))) });
  }

  hoursEntries(s: StoreLocation): [string, string][] {
    return Object.entries(s.hours ?? {});
  }
}
