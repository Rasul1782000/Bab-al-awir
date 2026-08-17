import { Component, computed, inject, signal } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { concatMap, filter } from "rxjs";
import { ApiService } from "../../core/api.service";
import { AuthService } from "../../core/auth.service";
import { CartService } from "../../core/cart.service";
import { RegionService } from "../../core/region.service";
import { LanguageService } from "../../core/language.service";
import { WishlistService } from "../../core/wishlist.service";
import { Language, Region, Section, Category } from "../../core/models";
import { localized } from "../../core/localize";


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
  private wishlistSvc = inject(WishlistService);
  private router = inject(Router);

  wishlistCount = computed(() => this.wishlistSvc.wishlist$().length);

  sections = signal<Section[]>([]);
  region = signal<Region | null>(null);
  languages = signal<Language[]>([]);
  categories = signal<Category[]>([]);
  isHome = signal(false);
  selectedCategory = signal<string>("");
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

    this.isHome.set(this.router.url === "/home" || this.router.url === "/");
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isHome.set(event.urlAfterRedirects === "/home" || event.urlAfterRedirects === "/");
      });

    this.api.getCategories().subscribe((r) => {
      this.categories.set(r.data ?? []);
    });

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

  name(c: Category): string {
    return localized(c, this.langSvc.current);
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
    const cat = this.selectedCategory();
    const queryParams: any = {};
    if (q) {
      queryParams.q = q;
    }
    if (cat) {
      queryParams.category = cat;
    }
    if (q || cat) {
      this.router.navigate(["/products"], { queryParams });
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
