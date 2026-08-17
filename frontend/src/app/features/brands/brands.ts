import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { Brand } from "../../core/models";

@Component({
  selector: "app-brands",
  standalone: false,
  templateUrl: "./brands.html",
  styleUrl: "./brands.scss",
})
export class Brands {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  brands = signal<Brand[]>([]);

  constructor() {
    this.api.getBrands().subscribe((r) => this.brands.set(r.data ?? []));
  }
}
