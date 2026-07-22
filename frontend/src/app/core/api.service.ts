import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import {
  ApiResponse,
  BrandValue,
  Category,
  DeliveryOption,
  FaqItem,
  Language,
  NewsPost,
  Offer,
  Product,
  PromoBanner,
  Region,
  Section,
  StoreLocation,
  TeamMember,
  Testimonial,
  UserProfile,
} from "./models";

@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = "http://localhost:8000/api";

  private cacheGet<T>(
    key: string,
    url: string,
  ): Observable<ApiResponse<T>> {
    const cached = this.readCache<ApiResponse<T>>(key);
    if (cached) {
      return of(cached);
    }
    return this.http.get<ApiResponse<T>>(url).pipe(
      tap((res) => this.writeCache(key, res)),
    );
  }

  private readCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`baw_cache_${key}`);
      if (!raw) return null;
      const entry = JSON.parse(raw) as { ts: number; data: T };
      if (Date.now() - entry.ts > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(`baw_cache_${key}`);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }

  private writeCache<T>(key: string, data: T): void {
    try {
      localStorage.setItem(
        `baw_cache_${key}`,
        JSON.stringify({ ts: Date.now(), data }),
      );
    } catch {
      /* storage unavailable */
    }
  }

  getRegions(): Observable<ApiResponse<Region[]>> {
    return this.cacheGet<Region[]>("regions", `${this.baseUrl}/regions`);
  }

  getLanguages(): Observable<ApiResponse<Language[]>> {
    return this.cacheGet<Language[]>("languages", `${this.baseUrl}/languages`);
  }

  getSections(): Observable<ApiResponse<Section[]>> {
    return this.cacheGet<Section[]>("sections", `${this.baseUrl}/sections`);
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.cacheGet<Category[]>("categories", `${this.baseUrl}/categories`);
  }

  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.cacheGet<Product[]>("products", `${this.baseUrl}/products`);
  }

  getBrandValues(): Observable<ApiResponse<BrandValue[]>> {
    return this.http.get<ApiResponse<BrandValue[]>>(`${this.baseUrl}/brand-values`);
  }

  getStoreLocations(): Observable<ApiResponse<StoreLocation[]>> {
    return this.http.get<ApiResponse<StoreLocation[]>>(`${this.baseUrl}/store-locations`);
  }

  getDeliveryOptions(): Observable<ApiResponse<DeliveryOption[]>> {
    return this.http.get<ApiResponse<DeliveryOption[]>>(`${this.baseUrl}/delivery-options`);
  }

  getOffers(): Observable<ApiResponse<Offer[]>> {
    return this.http.get<ApiResponse<Offer[]>>(`${this.baseUrl}/offers`);
  }

  getUserProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.baseUrl}/user/profile`);
  }

  getTestimonials(): Observable<ApiResponse<Testimonial[]>> {
    return this.http.get<ApiResponse<Testimonial[]>>(`${this.baseUrl}/testimonials`);
  }

  getFaq(): Observable<ApiResponse<FaqItem[]>> {
    return this.http.get<ApiResponse<FaqItem[]>>(`${this.baseUrl}/faq`);
  }

  getTeamMembers(): Observable<ApiResponse<TeamMember[]>> {
    return this.http.get<ApiResponse<TeamMember[]>>(`${this.baseUrl}/team-members`);
  }

  getNews(): Observable<ApiResponse<NewsPost[]>> {
    return this.http.get<ApiResponse<NewsPost[]>>(`${this.baseUrl}/news`);
  }

  getPromoBanners(): Observable<ApiResponse<PromoBanner[]>> {
    return this.http.get<ApiResponse<PromoBanner[]>>(`${this.baseUrl}/promo-banners`);
  }
}
