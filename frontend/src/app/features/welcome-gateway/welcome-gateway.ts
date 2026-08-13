import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { forkJoin, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { RegionService } from "../../core/region.service";
import { Language, Region } from "../../core/models";

const FALLBACK_REGIONS: Region[] = [
  { code: "ae", name: "United Arab Emirates", name_ar: "الإمارات العربية المتحدة", flag: "ae", currency: "AED", currency_symbol: "د.إ", delivery_fee: 15, free_delivery_min: 100, timezone: "Asia/Dubai" },
  { code: "sa", name: "Saudi Arabia", name_ar: "المملكة العربية السعودية", flag: "sa", currency: "SAR", currency_symbol: "﷼", delivery_fee: 20, free_delivery_min: 150, timezone: "Asia/Riyadh" },
];

const FALLBACK_LANGUAGES: Language[] = [
  { code: "en", name: "English", native: "English", dir: "ltr", font: "Inter" },
  { code: "ar", name: "Arabic", native: "العربية", dir: "rtl", font: "Tajawal" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", dir: "ltr", font: "Noto Sans Malayalam" },
  { code: "ta", name: "Tamil", native: "தமிழ்", dir: "ltr", font: "Noto Sans Tamil" },
];

@Component({
  selector: "app-welcome-gateway",
  standalone: false,
  templateUrl: "./welcome-gateway.html",
  styleUrl: "./welcome-gateway.scss",
})
export class WelcomeGateway {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  private regionSvc = inject(RegionService);
  private router = inject(Router);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  regions = signal<Region[]>([]);
  languages = signal<Language[]>([]);
  selectedRegion = signal<string>("");
  selectedLang = signal<string>(this.langSvc.current);
  error = signal<string>("");
  loading = signal<boolean>(true);
  apiFailed = signal<boolean>(false);

  onLangChange(code: string): void {
    this.selectedLang.set(code);
    this.langSvc.previewLanguage(code);
  }

  constructor() {
    this.fetchData();
  }

  private fetchData(): void {
    this.loading.set(true);
    this.apiFailed.set(false);
    forkJoin({
      regions: this.api.getRegions(),
      languages: this.api.getLanguages(),
    }).pipe(
      catchError(() => of({ regions: null, languages: null })),
    ).subscribe({
      next: ({ regions, languages }) => {
        if (regions?.data && regions.data.length > 0) {
          this.regions.set(regions.data);
        } else {
          this.regions.set(FALLBACK_REGIONS);
        }
        if (languages?.data && languages.data.length > 0) {
          this.languages.set(languages.data);
        } else {
          this.languages.set(FALLBACK_LANGUAGES);
        }
        this.loading.set(false);
        if (!regions?.data && !languages?.data) {
          this.apiFailed.set(true);
        }
      },
      error: () => {
        this.regions.set(FALLBACK_REGIONS);
        this.languages.set(FALLBACK_LANGUAGES);
        this.loading.set(false);
        this.apiFailed.set(true);
      },
    });
  }

  proceed(): void {
    if (!this.selectedRegion()) {
      this.error.set("welcomeRegionRequired");
      return;
    }
    this.regionSvc.set(this.selectedRegion());
    this.langSvc.setLanguage(this.selectedLang());
    this.router.navigate(["/"]);
  }

  langName(l: Language): string {
    return l.code === "ar" ? l.native : l.name;
  }

  regionName(r: Region): string {
    return this.lang() === "ar" ? r.name_ar : r.name;
  }

  retry(): void {
    this.fetchData();
  }
}