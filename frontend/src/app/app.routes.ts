import { Routes } from "@angular/router";
import { welcomeGuard } from "./core/welcome.guard";

export const routes: Routes = [
  {
    path: "welcome",
    loadChildren: () =>
      import("./features/welcome-gateway/welcome-gateway.module").then((m) => m.WelcomeGatewayModule),
  },
  {
    path: "",
    loadChildren: () => import("./features/layout/layout.module").then((m) => m.LayoutModule),
    canActivate: [welcomeGuard],
  },
  { path: "**", redirectTo: "welcome" },
];
