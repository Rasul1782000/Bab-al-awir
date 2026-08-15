import { Component, inject } from "@angular/core";
import { LanguageService } from "../../core/language.service";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-privacy-policy",
  standalone: false,
  templateUrl: "./privacy-policy.html",
  styleUrl: "./privacy-policy.scss",
})
export class PrivacyPolicy {
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });
}
