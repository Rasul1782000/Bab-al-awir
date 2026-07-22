import { Component, input } from "@angular/core";

@Component({
  selector: "app-flag-icon",
  standalone: false,
  templateUrl: "./flag-icon.html",
  styleUrl: "./flag-icon.scss",
})
export class FlagIcon {
  code = input.required<string>();
}
