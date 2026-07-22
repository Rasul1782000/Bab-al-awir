import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { localized } from "../../core/localize";
import { Category, Product } from "../../core/models";

interface CatIcon {
  label: string;
  emoji: string;
}
interface Banner {
  title: string;
  tag: string;
  img: string;
  tint: string;
}
interface Discover {
  label: string;
  img: string;
}

@Component({
  selector: "app-home",
  standalone: false,
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  featured = computed(() => this.products().slice(0, 5));
  symbol = computed(() => (this.lang() === "ar" ? "د.إ" : "AED"));

  catIcons: CatIcon[] = [
    { label: "Fruits", emoji: "🍎" },
    { label: "Vegetables", emoji: "🥦" },
    { label: "Juices", emoji: "🧃" },
    { label: "Dairy & Eggs", emoji: "🥛" },
    { label: "Bakery & Bread", emoji: "🍞" },
    { label: "Snacks & Biscuits", emoji: "🍪" },
    { label: "Rice", emoji: "🍚" },
    { label: "Pulses & Grams", emoji: "🌱" },
    { label: "Water", emoji: "💧" },
    { label: "Pickles", emoji: "🥒" },
    { label: "Instant & Noodles", emoji: "🍜" },
    { label: "Washing", emoji: "🧼" },
    { label: "Personal Care", emoji: "🧴" },
    { label: "Stationery", emoji: "📝" },
    { label: "Mats & Home", emoji: "🟫" },
    { label: "Frozen & Ice Cream", emoji: "🍦" },
    { label: "Bulk Orders", emoji: "📦" },
  ];

  banners: Banner[] = [
    {
      title: "FRESH FRUITS & VEG",
      tag: "Daily Farm Fresh, up to 30% OFF",
      tint: "var(--green-tint)",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=100",
    },
    {
      title: "JUICES & PULSES",
      tag: "Fresh juices & dal, 25% OFF",
      tint: "var(--peach)",
      img: "https://images.unsplash.com/photo-1598871265419-c471c1b43a6c?auto=format&fit=crop&w=1920&q=100",
    },
  ];

  discover: Discover[] = [
    { label: "Seasonal Fruits", img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=100" },
    { label: "Fresh Vegetables", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=100" },
    { label: "Juices", img: "https://images.unsplash.com/photo-1598871265419-c471c1b43a6c?auto=format&fit=crop&w=1920&q=100" },
    { label: "Rice Varieties", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=100" },
    { label: "Pulses & Grams", img: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=1200&q=100" },
  ];

  constructor() {
    this.api.getProducts().subscribe((r) => this.products.set(r.data));
    this.api.getCategories().subscribe((r) => this.categories.set(r.data));
  }

  name(c: Category): string {
    return localized(c, this.lang());
  }

  prev(): void {
    const el = document.querySelector(".bestseller__track");
    el?.scrollBy({ left: -260, behavior: "smooth" });
  }

  next(): void {
    const el = document.querySelector(".bestseller__track");
    el?.scrollBy({ left: 260, behavior: "smooth" });
  }
}
