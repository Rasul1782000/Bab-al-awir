import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import {
  ApiResponse,
  Brand,
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
  private readonly baseUrl = environment.apiUrl;
  private readonly CACHE_VERSION = "v2";

  private cacheGet<T>(key: string, url: string): Observable<ApiResponse<T>> {
    const cached = this.readCache<T>(key);
    if (cached) return of(cached);
    return this.http.get<ApiResponse<T>>(url).pipe(
      catchError(() => of({ success: false, message: "api_error", data: null as T })),
      tap((res) => { if (res.success) this.writeCache(key, res); }),
    );
  }

  private readCache<T>(key: string): ApiResponse<T> | null {
    try {
      const raw = localStorage.getItem(`baw_cache_v${this.CACHE_VERSION}_${key}`);
      if (!raw) return null;
      const entry = JSON.parse(raw) as { ts: number; data: ApiResponse<T> };
      if (Date.now() - entry.ts > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(`baw_cache_v${this.CACHE_VERSION}_${key}`);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }

  private writeCache<T>(key: string, data: ApiResponse<T>): void {
    try {
      localStorage.setItem(
        `baw_cache_v${this.CACHE_VERSION}_${key}`,
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
  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`);
  }

  getBrandValues(): Observable<ApiResponse<BrandValue[]>> {
    return this.cacheGet<BrandValue[]>("brand", `${this.baseUrl}/brand-values`);
  }

  getBrands(): Observable<ApiResponse<Brand[]>> {
    return this.cacheGet<Brand[]>("brands", `${this.baseUrl}/brands`);
  }

  getStoreLocations(): Observable<ApiResponse<StoreLocation[]>> {
    return this.cacheGet<StoreLocation[]>("store_locations", `${this.baseUrl}/store-locations`);
  }

  getDeliveryOptions(): Observable<ApiResponse<DeliveryOption[]>> {
    return this.cacheGet<DeliveryOption[]>("delivery_options", `${this.baseUrl}/delivery-options`);
  }

  getOffers(): Observable<ApiResponse<Offer[]>> {
    return this.cacheGet<Offer[]>("offers", `${this.baseUrl}/offers`);
  }

  getUserProfile(): Observable<ApiResponse<UserProfile>> {
    return this.cacheGet<UserProfile>("user", `${this.baseUrl}/user/profile`);
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
    return this.cacheGet<Testimonial[]>("testimonials", `${this.baseUrl}/testimonials`);
  }

  getFaq(): Observable<ApiResponse<FaqItem[]>> {
    return this.cacheGet<FaqItem[]>("faq", `${this.baseUrl}/faq`);
  }

  getTeamMembers(): Observable<ApiResponse<TeamMember[]>> {
    return this.cacheGet<TeamMember[]>("team_members", `${this.baseUrl}/team-members`);
  }

  getNews(): Observable<ApiResponse<NewsPost[]>> {
    return this.cacheGet<NewsPost[]>("news", `${this.baseUrl}/news`);
  }

  getPromoBanners(): Observable<ApiResponse<PromoBanner[]>> {
    return this.cacheGet<PromoBanner[]>("promo_banners", `${this.baseUrl}/promo-banners`);
  }

  getCart(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/cart`);
  }

  saveCart(items: { product_id: number; quantity: number }[]): Observable<ApiResponse<any[]>> {
    return this.http.post<ApiResponse<any[]>>(`${this.baseUrl}/cart`, { items });
  }

  updateCartItem(productId: number, quantity: number): Observable<ApiResponse<any[]>> {
    return this.http.put<ApiResponse<any[]>>(`${this.baseUrl}/cart/${productId}`, { quantity });
  }

  removeCartItem(productId: number): Observable<ApiResponse<any[]>> {
    return this.http.delete<ApiResponse<any[]>>(`${this.baseUrl}/cart/${productId}`);
  }

  clearCart(): Observable<ApiResponse<any[]>> {
    return this.http.delete<ApiResponse<any[]>>(`${this.baseUrl}/cart`);
  }

  getOrders(): Observable<ApiResponse<{ data: any[]; meta: any }>> {
    return this.http.get<ApiResponse<{ data: any[]; meta: any }>>(`${this.baseUrl}/orders`);
  }

  createOrder(orderData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/orders`, orderData);
  }

  getOrder(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/orders/${id}`);
  }

  updateOrderStatus(id: string, status: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/orders/${id}`, { status });
  }

  processPayment(paymentData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/payments`, paymentData);
  }

  getPaymentMethods(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/payments/methods`);
  }

  getReviews(productId?: number): Observable<ApiResponse<{ data: any[]; meta: any }>> {
    const url = productId
      ? `${this.baseUrl}/reviews?product_id=${productId}`
      : `${this.baseUrl}/reviews`;
    return this.http.get<ApiResponse<{ data: any[]; meta: any }>>(url);
  }

  createReview(reviewData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/reviews`, reviewData);
  }

  getProductReviewSummary(productId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/reviews/product/${productId}/summary`);
  }

  getWishlist(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/wishlist`);
  }

  addToWishlist(productId: number): Observable<ApiResponse<any[]>> {
    return this.http.post<ApiResponse<any[]>>(`${this.baseUrl}/wishlist`, { product_id: productId });
  }

  removeFromWishlist(productId: number): Observable<ApiResponse<any[]>> {
    return this.http.delete<ApiResponse<any[]>>(`${this.baseUrl}/wishlist/${productId}`);
  }

  checkWishlist(productId: number): Observable<ApiResponse<{ product_id: number; in_wishlist: boolean }>> {
    return this.http.get<ApiResponse<{ product_id: number; in_wishlist: boolean }>>(`${this.baseUrl}/wishlist/check/${productId}`);
  }

  clearWishlist(): Observable<ApiResponse<any[]>> {
    return this.http.delete<ApiResponse<any[]>>(`${this.baseUrl}/wishlist`);
  }

  submitContact(contactData: { name: string; email: string; phone?: string; subject: string; message: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/contact`, contactData);
  }

  updateUserProfile(profileData: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.baseUrl}/user/profile`, profileData);
  }

  updateUserPreferences(preferences: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/user/preferences`, preferences);
  }
}
