import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { RegionService } from "./region.service";

export const welcomeGuard: CanActivateFn = () => {
  const region = inject(RegionService);
  if (region.current) {
    return true;
  }
  return inject(Router).createUrlTree(["/welcome"]);
};
