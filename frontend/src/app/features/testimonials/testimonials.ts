import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { Testimonial } from "../../core/models";

@Component({
  selector: "app-testimonials",
  standalone: false,
  templateUrl: "./testimonials.html",
  styleUrl: "./testimonials.scss",
})
export class Testimonials {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  testimonials = signal<Testimonial[]>([]);

  constructor() {
    this.api.getTestimonials().subscribe((r) => this.testimonials.set(r.data ?? []));
  }

  name(t: Testimonial): string {
    return this.lang() === "ar" ? t.name_ar : t.name_en;
  }

  role(t: Testimonial): string {
    return this.lang() === "ar" ? t.role_ar : t.role_en;
  }

  text(t: Testimonial): string {
    return this.lang() === "ar" ? t.text_ar : t.text_en;
  }

  stars(rating: number): number[] {
    return Array.from({ length: Math.max(0, Math.min(5, Math.round(rating))) });
  }

  starPlaceholders(n: number): number[] {
    return Array.from({ length: n });
  }
}
