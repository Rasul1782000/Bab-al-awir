import { Component, inject, signal } from "@angular/core";
import { ApiService } from "../../core/api.service";
import { UserProfile } from "../../core/models";

@Component({
  selector: "app-profile",
  standalone: false,
  templateUrl: "./profile.html",
  styleUrl: "./profile.scss",
})
export class Profile {
  private api = inject(ApiService);
  user = signal<UserProfile | null>(null);
  lang = signal<string>("en");

  constructor() {
    this.api.getUserProfile().subscribe((r) => this.user.set(r.data ?? null));
  }

  initials(name: string | null | undefined): string {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
}
