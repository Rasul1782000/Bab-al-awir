import { Component, OnInit, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ApiService } from "./core/api.service";
import { LanguageService } from "./core/language.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App implements OnInit {
  private api = inject(ApiService);
  private lang = inject(LanguageService);

  ngOnInit(): void {
    this.api.getLanguages().subscribe((res) => {
      if (res.success && res.data) {
        this.lang.init(res.data);
      }
    });
  }
}
