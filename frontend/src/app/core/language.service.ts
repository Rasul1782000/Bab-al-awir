import { Injectable, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";
import { Language } from "./models";

const STORAGE_KEY = "baw_lang";

@Injectable({ providedIn: "root" })
export class LanguageService {
  private translate = inject(TranslateService);
  private languages: Language[] = [];
  readonly current$ = new BehaviorSubject<string>("en");

  init(languages: Language[]): void {
    this.languages = languages;
    this.translate.addLangs(languages.map((l) => l.code));
    this.translate.setDefaultLang("en");
    const saved = this.loadSaved();
    const initial = saved && languages.some((l) => l.code === saved) ? saved : "en";
    this.apply(initial);
  }

  setLanguage(code: string): void {
    this.apply(code);
  }

  previewLanguage(code: string): void {
    const lang = this.languages.find((l) => l.code === code) ?? this.languages[0];
    if (!lang) {
      this.translate.use(code);
      this.current$.next(code);
      return;
    }
    this.current$.next(code);
    this.translate.use(code);

    const doc = document.documentElement;
    doc.lang = code;
    doc.dir = lang.dir;
    doc.classList.remove("lang-en", "lang-ar", "lang-ml", "lang-ta");
    doc.classList.add("lang-" + code);
  }

  private apply(code: string): void {
    const lang = this.languages.find((l) => l.code === code) ?? this.languages[0];
    if (!lang) {
      this.translate.use(code);
      this.current$.next(code);
      return;
    }
    this.current$.next(code);
    this.translate.use(code);

    const doc = document.documentElement;
    doc.lang = code;
    doc.dir = lang.dir;
    doc.classList.remove("lang-en", "lang-ar", "lang-ml", "lang-ta");
    doc.classList.add("lang-" + code);

    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* storage unavailable */
    }
  }

  get current(): string {
    return this.current$.value;
  }

  private loadSaved(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
