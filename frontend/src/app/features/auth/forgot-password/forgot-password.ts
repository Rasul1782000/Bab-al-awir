import { Component, inject, signal } from "@angular/core";
import { AuthService } from "../../../core/auth.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { LanguageService } from "../../../core/language.service";

@Component({
  selector: "app-forgot-password",
  standalone: false,
  templateUrl: "./forgot-password.html",
  styleUrl: "./forgot-password.scss",
})
export class ForgotPassword {
  private authSvc = inject(AuthService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  email = signal("");
  submitting = signal(false);
  submitted = signal(false);
  error = signal("");

  onSubmit(): void {
    const email = this.email().trim();
    if (!email) {
      this.error.set("forgotFillEmail");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error.set("forgotInvalidEmail");
      return;
    }
    this.submitting.set(true);
    this.error.set("");

    this.authSvc.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.submitting.set(false);
        if (res && res.success) {
          this.submitted.set(true);
        } else {
          this.error.set(res?.message || "forgotError");
        }
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.error.set(err?.error?.message || "forgotError");
      },
    });
  }
}
