import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { forkJoin } from "rxjs";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { RegionService } from "../../core/region.service";
import { Language, Region } from "../../core/models";

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

  onLangChange(code: string): void {
    this.selectedLang.set(code);
    this.langSvc.previewLanguage(code);
  }

  constructor() {
    forkJoin({
      regions: this.api.getRegions(),
      languages: this.api.getLanguages(),
    }).subscribe(({ regions, languages }) => {
      this.regions.set(regions.data);
      this.languages.set(languages.data);
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
}