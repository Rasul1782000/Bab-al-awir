import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { localized } from "../../core/localize";
import { Category, Product } from "../../core/models";

interface Dept {
  slug: string;
  title: string;
  img: string;
  tint: string;
}

@Component({
  selector: "app-section",
  standalone: false,
  templateUrl: "./section.html",
  styleUrl: "./section.scss",
})
export class Section {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  private route = inject(ActivatedRoute);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  slug = signal<string>("");
  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  symbol = computed(() => (this.lang() === "ar" ? "د.إ" : "AED"));

  depts: Dept[] = [
    { slug: "fruits", title: "Fruits", img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1920&q=100", tint: "var(--green-tint)" },
    { slug: "vegetables", title: "Vegetables", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1920&q=100", tint: "var(--green-tint)" },
    { slug: "juices", title: "Juices", img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=1920&q=100", tint: "var(--peach)" },
    { slug: "dairy-eggs", title: "Dairy & Eggs", img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1920&q=100", tint: "var(--peach)" },
    { slug: "bakery-bread", title: "Bakery & Bread", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=100", tint: "var(--green-tint)" },
    { slug: "snacks-biscuits", title: "Snacks & Biscuits", img: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?auto=format&fit=crop&w=1920&q=100", tint: "var(--peach)" },
    { slug: "rice", title: "Rice", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1920&q=100", tint: "var(--green-tint)" },
    { slug: "pulses-grams", title: "Pulses & Grams", img: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1920&q=100", tint: "var(--green-tint)" },
    { slug: "water", title: "Water", img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1920&q=100", tint: "var(--peach)" },
    { slug: "pickles", title: "Pickles & Condiments", img: "https://images.unsplash.com/photo-1585435465945-bef5a93f8849?auto=format&fit=crop&w=1920&q=100", tint: "var(--green-tint)" },
    { slug: "instant", title: "Instant & Noodles", img: "https://images.unsplash.com/photo-1628610688436-e635552020fc?auto=format&fit=crop&w=1920&q=100", tint: "var(--peach)" },
    { slug: "washing", title: "Washing & Cleaning", img: "https://images.unsplash.com/photo-1563456160-6ef088d53f31?auto=format&fit=crop&w=1920&q=100", tint: "var(--peach)" },
    { slug: "personal-care", title: "Personal Care", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1920&q=100", tint: "var(--green-tint)" },
    { slug: "stationary", title: "Stationery", img: "https://images.unsplash.com/photo-1495076339972-911a8a7ecae3?auto=format&fit=crop&w=1920&q=100", tint: "var(--peach)" },
    { slug: "mats", title: "Mats & Home", img: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1920&q=100", tint: "var(--green-tint)" },
    { slug: "frozen-icecream", title: "Frozen & Ice Cream", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1920&q=100", tint: "var(--peach)" },
  ];

  dept = computed(() => this.depts.find((d) => d.slug === this.slug()) ?? null);
  title = computed(() => this.dept()?.title ?? this.slug());

  categoryId = computed(() => {
    const slug = this.slug();
    return this.categories().find((c) => c.slug === slug)?.id ?? null;
  });

  filtered = computed(() => {
    const id = this.categoryId();
    const list = this.products();
    return id === null ? list : list.filter((p) => p.category_id === id);
  });

  related = computed(() => {
    const id = this.categoryId();
    const list = this.categories();
    if (id === null) return list.slice(0, 8);
    return list.filter((c) => c.id !== id).slice(0, 8);
  });

  constructor() {
    this.api.getCategories().subscribe((r) => this.categories.set(r.data ?? []));
    this.api.getProducts().subscribe((r) => this.products.set(r.data ?? []));
    this.route.paramMap.subscribe((p) => this.slug.set(p.get("slug") ?? ""));
  }

  name(c: Category): string {
    return localized(c, this.lang());
  }
}
