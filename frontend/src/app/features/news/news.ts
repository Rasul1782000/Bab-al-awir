import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { NewsPost } from "../../core/models";

@Component({
  selector: "app-news",
  standalone: false,
  templateUrl: "./news.html",
  styleUrl: "./news.scss",
})
export class News {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  posts = signal<NewsPost[]>([]);

  constructor() {
    this.api.getNews().subscribe((r) => this.posts.set(r.data ?? []));
  }

  title(post: NewsPost): string {
    return this.lang() === "ar" ? post.title_ar : post.title_en;
  }

  summary(post: NewsPost): string {
    return this.lang() === "ar" ? post.summary_ar : post.summary_en;
  }
}
