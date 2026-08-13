import { Component, inject, signal } from "@angular/core";
import { AuthService } from "../../../core/auth.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { LanguageService } from "../../../core/language.service";

@Component({
  selector: "app-signup",
  standalone: false,
  templateUrl: "./signup.html",
  styleUrl: "./signup.scss",
})
export class Signup {
  private authSvc = inject(AuthService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  name = signal("");
  email = signal("");
  phone = signal("");
  password = signal("");
  confirm = signal("");
  submitting = signal(false);
  error = signal("");

  onSignup(): void {
    if (this.submitting()) return;
    const name = this.name().trim();
    const email = this.email().trim();
    const phone = this.phone().trim();
    const password = this.password();
    const confirm = this.confirm();

    if (!name || !email || !phone || !password) {
      this.error.set("signupFillAll");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error.set("signupInvalidEmail");
      return;
    }
    if (password !== confirm) {
      this.error.set("signupPasswordMismatch");
      return;
    }
    if (password.length < 6) {
      this.error.set("signupWeakPassword");
      return;
    }

    this.submitting.set(true);
    this.error.set("");

    this.authSvc.signup(name, email, phone, password).subscribe({
      next: (res: any) => {
        this.submitting.set(false);
        if (res && res.success) {
          this.authSvc.navigateHome();
        } else {
          this.error.set(res?.message || "signupError");
        }
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.error.set(err?.error?.message || "signupError");
      },
    });
  }
}
