import { Component, inject } from "@angular/core";
import { LanguageService } from "../../core/language.service";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-returns",
  standalone: false,
  templateUrl: "./returns.html",
  styleUrl: "./returns.scss",
})
export class Returns {
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });
}
