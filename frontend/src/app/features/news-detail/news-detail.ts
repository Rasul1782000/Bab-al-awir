import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { NewsPost } from "../../core/models";

@Component({
  selector: "app-news-detail",
  standalone: false,
  templateUrl: "./news-detail.html",
  styleUrl: "./news-detail.scss",
})
export class NewsDetail {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  posts = signal<NewsPost[]>([]);
  post = signal<NewsPost | null>(null);

  constructor() {
    this.api.getNews().subscribe((r) => {
      const all = r.data ?? [];
      this.posts.set(all);
      this.route.paramMap.subscribe((params) => {
        const id = Number(params.get("id"));
        const found = all.find((p) => p.id === id) ?? null;
        this.post.set(found);
      });
    });
  }

  title(post: NewsPost): string {
    return this.lang() === "ar" ? post.title_ar : post.title_en;
  }

  summary(post: NewsPost): string {
    return this.lang() === "ar" ? post.summary_ar : post.summary_en;
  }

  relatedPosts = computed(() => {
    const current = this.post();
    if (!current) return [];
    return this.posts()
      .filter((p) => p.id !== current.id)
      .slice(0, 3);
  });

  goBack(): void {
    this.router.navigate(["/news"]);
  }
}
