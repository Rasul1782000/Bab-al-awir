import { Component, inject, signal } from "@angular/core";
import { AuthService } from "../../../core/auth.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { LanguageService } from "../../../core/language.service";

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class Login {
  private authSvc = inject(AuthService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  email = signal("");
  password = signal("");
  submitting = signal(false);
  error = signal("");

  get hardcodedEmail(): string {
    return "aisha.rahman@babalawir.ae";
  }

  get hardcodedPassword(): string {
    return "password123";
  }

  onLogin(): void {
    if (this.submitting()) return;
    const email = this.email().trim();
    const password = this.password();
    if (!email || !password) {
      this.error.set("loginFillAll");
      return;
    }
    this.submitting.set(true);
    this.error.set("");

    this.authSvc.login(email, password).subscribe({
      next: (res: any) => {
        this.submitting.set(false);
        if (res && res.success) {
          this.authSvc.navigateHome();
        } else {
          this.error.set("loginError");
        }
      },
      error: () => {
        this.submitting.set(false);
        this.error.set("loginError");
      },
    });
  }
}
