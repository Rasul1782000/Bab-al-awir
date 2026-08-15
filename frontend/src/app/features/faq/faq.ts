import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { FaqItem } from "../../core/models";

@Component({
  selector: "app-faq",
  standalone: false,
  templateUrl: "./faq.html",
  styleUrl: "./faq.scss",
})
export class Faq {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  faqs = signal<FaqItem[]>([]);
  openId = signal<number | null>(null);

  constructor() {
    this.api.getFaq().subscribe((r) => this.faqs.set(r.data ?? []));
  }

  toggle(id: number): void {
    this.openId.update((current) => current === id ? null : id);
  }

  question(item: FaqItem): string {
    return this.lang() === "ar" ? item.question_ar : item.question_en;
  }

  answer(item: FaqItem): string {
    return this.lang() === "ar" ? item.answer_ar : item.answer_en;
  }
}
