import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { concatMap } from "rxjs";
import { ApiService } from "../../core/api.service";
import { CartService } from "../../core/cart.service";
import { RegionService } from "../../core/region.service";
import { LanguageService } from "../../core/language.service";
import { Language, Region, Section } from "../../core/models";


@Component({
  selector: "app-layout",
  standalone: false,
  templateUrl: "./layout.html",
  styleUrl: "./layout.scss",
})
export class Layout {
  private api = inject(ApiService);
  private cartSvc = inject(CartService);
  private regionSvc = inject(RegionService);
  private langSvc = inject(LanguageService);
  private router = inject(Router);

  sections = signal<Section[]>([]);
  region = signal<Region | null>(null);
  languages = signal<Language[]>([]);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });
  currentLang = this.langSvc.current$;

  searchQuery = signal("");

  constructor() {
    this.api
      .getSections()
      .pipe(
        concatMap((r) => {
          this.sections.set(r.data);
          return this.api.getLanguages();
        }),
        concatMap((r) => {
          this.languages.set(r.data);
          return this.api.getRegions();
        }),
      )
      .subscribe((r) => {
        const code = this.regionSvc.current;
        this.region.set(r.data.find((x) => x.code === code) ?? null);
      });
  }

  sectionLabel(s: Section): string {
    const lang = this.langSvc.current;
    const map: Record<string, keyof Section> = {
      en: "label_en",
      ar: "label_ar",
      ml: "label_ml",
      ta: "label_ta",
    };
    return s[map[lang]] as string;
  }

  setLang(code: string): void {
    this.langSvc.setLanguage(code);
  }

  changeRegion(): void {
    this.router.navigate(["/welcome"]);
  }

  search(): void {
    const q = this.searchQuery().trim();
    if (q) {
      this.router.navigate(["/products"], { queryParams: { q } });
    }
  }

  onSearchInput(): void {
    const q = this.searchQuery().trim();
    if (q.length >= 2) {
      this.router.navigate(["/products"], {
        queryParams: { q },
        queryParamsHandling: "merge",
      });
    }
  }

  toggleCart(): void {
    this.cartSvc.toggleCartVisibility?.();
  }

  isVisible(): boolean {
    return this.cartSvc.cartVisible();
  }

  itemCount = this.cartSvc.itemCount;
}
