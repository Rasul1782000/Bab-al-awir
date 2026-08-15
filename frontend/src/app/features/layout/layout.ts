import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { concatMap } from "rxjs";
import { ApiService } from "../../core/api.service";
import { AuthService } from "../../core/auth.service";
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
  private authSvc = inject(AuthService);
  private cartSvc = inject(CartService);
  private regionSvc = inject(RegionService);
  private langSvc = inject(LanguageService);
  private router = inject(Router);

  sections = signal<Section[]>([]);
  region = signal<Region | null>(null);
  languages = signal<Language[]>([]);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });
  currentLang = this.langSvc.current$;
  loggedIn = this.authSvc.user;

  searchQuery = signal("");

  theme = signal<"light" | "dark">("light");

  constructor() {
    const saved = localStorage.getItem("baw_theme");
    if (saved === "dark" || saved === "light") {
      this.theme.set(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
    this.api
      .getSections()
      .pipe(
        concatMap((r) => {
          this.sections.set(r.data ?? []);
          return this.api.getLanguages();
        }),
        concatMap((r) => {
          this.languages.set(r.data ?? []);
          return this.api.getRegions();
        }),
      )
      .subscribe((r) => {
        const code = this.regionSvc.current;
        this.region.set(r.data?.find((x) => x.code === code) ?? null);
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

  toggleTheme(): void {
    const next = this.theme() === "light" ? "dark" : "light";
    this.theme.set(next);
    localStorage.setItem("baw_theme", next);
    document.documentElement.setAttribute("data-theme", next);
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

  logout(): void {
    this.authSvc.logout();
    this.router.navigate(["/login"]);
  }

  isVisible(): boolean {
    return this.cartSvc.cartVisible();
  }

  itemCount = this.cartSvc.itemCount;
}
