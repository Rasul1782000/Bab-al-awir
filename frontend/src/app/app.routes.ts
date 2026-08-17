import { Routes } from "@angular/router";
import { welcomeGuard } from "./core/welcome.guard";

export const routes: Routes = [
  { path: "", redirectTo: "/flash", pathMatch: "full" },
  {
    path: "flash",
    loadChildren: () =>
      import("./features/flash-screen/flash-screen.module").then(
        (m) => m.FlashScreenModule
      ),
  },
  {
    path: "welcome",
    loadChildren: () =>
      import("./features/welcome-gateway/welcome-gateway.module").then(
        (m) => m.WelcomeGatewayModule
      ),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./features/auth/login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./features/auth/signup/signup.module").then((m) => m.SignupModule),
  },
  {
    path: "forgot-password",
    loadChildren: () =>
      import("./features/auth/forgot-password/forgot-password.module").then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path: "design-showcase",
    loadChildren: () =>
      import("./features/design-showcase/design-showcase.module").then(
        (m) => m.DesignShowcaseModule
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("./features/layout/layout.module").then((m) => m.LayoutModule),
    canActivate: [welcomeGuard],
  },
  { path: "**", redirectTo: "/flash" },
];
