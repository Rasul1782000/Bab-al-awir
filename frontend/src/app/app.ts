import { Component, OnInit, inject } from "@angular/core";
import { ApiService } from "./core/api.service";
import { LanguageService } from "./core/language.service";

@Component({
  selector: "app-root",
  standalone: false,
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App implements OnInit {
  private api = inject(ApiService);
  private lang = inject(LanguageService);

  ngOnInit(): void {
    this.api.getLanguages().subscribe((res) => this.lang.init(res.data));
  }
}
