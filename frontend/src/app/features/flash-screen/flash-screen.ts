import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { RegionService } from "../../core/region.service";

@Component({
  selector: "app-flash-screen",
  standalone: false,
  templateUrl: "./flash-screen.html",
  styleUrl: "./flash-screen.scss",
})
export class FlashScreen implements OnInit {
  private router = inject(Router);
  private regionSvc = inject(RegionService);

  ngOnInit(): void {
    setTimeout(() => {
      if (this.regionSvc.current) {
        this.router.navigate(["/home"]);
      } else {
        this.router.navigate(["/welcome"]);
      }
    }, 2000);
  }
}