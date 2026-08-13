import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-flash-screen",
  standalone: false,
  templateUrl: "./flash-screen.html",
  styleUrl: "./flash-screen.scss",
})
export class FlashScreen implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(["/welcome"]);
    }, 2000);
  }
}