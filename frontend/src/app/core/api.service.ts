import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
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
  AuthUser,
} from "./models";

export interface AuthPayload {
  name?: string;
  email: string;
  phone?: string;
  password: string;
}

@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = "http://localhost:8000/api";

  // Bundled static fallback so the storefront renders even with no backend
  // (e.g. a static Vercel deploy). Excludes any secrets from config/dummy.php.
  private localData: any = null;
  private local$ = this.http.get<any>("assets/data/store.json").pipe(
    tap((d) => (this.localData = d)),
    catchError(() => of(null)),
    shareReplay(1),
  );

  constructor() {
    this.local$.subscribe();
  }

  private localFor<T>(key: string): T | null {
    return this.localData ? (this.localData[key] ?? null) : null;
  }

  // Try the live API; on any failure fall back to the bundled static data.
  private safeGet<T>(
    key: string,
    url: string,
    transform?: (d: any) => T,
  ): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(url).pipe(
      catchError(() =>
        this.local$.pipe(
          map(
            () =>
              ({
                success: true,
                message: "local",
                data: transform ? transform(this.localData) : this.localFor<T>(key),
              }) as ApiResponse<T>,
          ),
        ),
      ),
    );
  }

  private cacheGet<T>(key: string, url: string): Observable<ApiResponse<T>> {
    const cached = this.readCache<ApiResponse<T>>(key);
    if (cached) return of(cached);
    return this.safeGet<T>(key, url).pipe(tap((res) => this.writeCache(key, res)));
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
    return this.safeGet<BrandValue[]>(
      "brand",
      `${this.baseUrl}/brand-values`,
      (d) => d?.brand?.values ?? [],
    );
  }

  getStoreLocations(): Observable<ApiResponse<StoreLocation[]>> {
    return this.safeGet<StoreLocation[]>(
      "store_locations",
      `${this.baseUrl}/store-locations`,
    );
  }

  getDeliveryOptions(): Observable<ApiResponse<DeliveryOption[]>> {
    return this.safeGet<DeliveryOption[]>(
      "delivery_options",
      `${this.baseUrl}/delivery-options`,
    );
  }

  getOffers(): Observable<ApiResponse<Offer[]>> {
    return this.safeGet<Offer[]>("offers", `${this.baseUrl}/offers`);
  }

  getUserProfile(): Observable<ApiResponse<UserProfile>> {
    return this.safeGet<UserProfile>("user", `${this.baseUrl}/user/profile`);
  }

  login(payload: AuthPayload): Observable<ApiResponse<AuthUser>> {
    return this.http.post<ApiResponse<AuthUser>>(`${this.baseUrl}/login`, payload);
  }

  signup(payload: AuthPayload): Observable<ApiResponse<AuthUser>> {
    return this.http.post<ApiResponse<AuthUser>>(`${this.baseUrl}/signup`, payload);
  }

  forgotPassword(payload: { email: string }): Observable<ApiResponse<{ email: string; note: string }>> {
    return this.http.post<ApiResponse<{ email: string; note: string }>>(
      `${this.baseUrl}/forgot-password`,
      payload,
    );
  }

  getTestimonials(): Observable<ApiResponse<Testimonial[]>> {
    return this.safeGet<Testimonial[]>("testimonials", `${this.baseUrl}/testimonials`);
  }

  getFaq(): Observable<ApiResponse<FaqItem[]>> {
    return this.safeGet<FaqItem[]>("faq", `${this.baseUrl}/faq`);
  }

  getTeamMembers(): Observable<ApiResponse<TeamMember[]>> {
    return this.safeGet<TeamMember[]>("team_members", `${this.baseUrl}/team-members`);
  }

  getNews(): Observable<ApiResponse<NewsPost[]>> {
    return this.safeGet<NewsPost[]>("news", `${this.baseUrl}/news`);
  }

  getPromoBanners(): Observable<ApiResponse<PromoBanner[]>> {
    return this.safeGet<PromoBanner[]>("promo_banners", `${this.baseUrl}/promo-banners`);
  }
}
