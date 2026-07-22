import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { localized } from "../../core/localize";
import { Category } from "../../core/models";
@Component({
  selector: "app-categories",
  standalone: false,
  templateUrl: "./categories.html",
  styleUrl: "./categories.scss",
})

export class Categories {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });
  categories = signal<Category[]>([]);


  constructor() {
    this.api.getCategories().subscribe((r) => this.categories.set(r.data));
  }

  name(c: Category): string {
    return localized(c, this.lang());
  }

  desc(c: Category): string {
    const l = this.lang();
    if (l === "ar") return c.desc_ar ?? "";
    return c.desc_en ?? "";
  }
}
