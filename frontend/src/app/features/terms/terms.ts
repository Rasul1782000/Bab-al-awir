import { Component, inject } from "@angular/core";
import { LanguageService } from "../../core/language.service";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-terms",
  standalone: false,
  templateUrl: "./terms.html",
  styleUrl: "./terms.scss",
})
export class Terms {
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });
}
