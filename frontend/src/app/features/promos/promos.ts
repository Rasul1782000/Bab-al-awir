import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { PromoBanner } from "../../core/models";

@Component({
  selector: "app-promos",
  standalone: false,
  templateUrl: "./promos.html",
  styleUrl: "./promos.scss",
})
export class Promos {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  banners = signal<PromoBanner[]>([]);

  constructor() {
    this.api.getPromoBanners().subscribe((r) => this.banners.set(r.data ?? []));
  }

  title(b: PromoBanner): string {
    return this.lang() === "ar" ? b.title_ar : b.title_en;
  }

  subtitle(b: PromoBanner): string {
    return this.lang() === "ar" ? b.subtitle_ar : b.subtitle_en;
  }

  badge(b: PromoBanner): string {
    return this.lang() === "ar" ? b.badge_ar : b.badge_en;
  }
}
