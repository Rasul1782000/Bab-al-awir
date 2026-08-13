import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "./api.service";
import { AuthUser } from "./models";
import { tap, catchError, of } from "rxjs";

const AUTH_KEY = "baw_auth";
const TOKEN_KEY = "baw_token";

@Injectable({ providedIn: "root" })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  user = signal<AuthUser | null>(this.loadAuth());

  get isLoggedIn(): boolean {
    return !!this.user();
  }

  login(email: string, password: string) {
    return this.api.login({ email, password }).pipe(
      tap((res) => this.apply(res.data)),
      catchError(() => of({ success: false, message: "", data: null } as any)),
    );
  }

  signup(name: string, email: string, phone: string, password: string) {
    return this.api.signup({ name, email, phone, password }).pipe(
      tap((res) => this.apply(res.data)),
      catchError(() => of({ success: false, message: "", data: null } as any)),
    );
  }

  forgotPassword(email: string) {
    return this.api.forgotPassword({ email }).pipe(
      catchError(() => of({ success: false, message: "", data: null } as unknown as any)),
    );
  }

  logout(): void {
    this.user.set(null);
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  }

  navigateHome(): void {
    this.router.navigate(["/home"]);
  }

  private apply(data: AuthUser | null): void {
    if (!data) return;
    this.user.set(data);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(data));
      localStorage.setItem(TOKEN_KEY, data.token);
    } catch {
      /* storage unavailable */
    }
  }

  private loadAuth(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
