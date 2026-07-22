import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { Layout } from "./layout";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [Layout],
  imports: [CommonModule, TranslateModule, FormsModule, SharedModule, RouterModule.forChild([
    {
      path: "",
      pathMatch: "full",
      redirectTo: "home",
    },
    {
      path: "cart",
      loadChildren: () =>
        import("./../cart/cart.module").then((m) => m.CartModule),
    },
    {
      path: "products",
      loadChildren: () =>
        import("./../products/products.module").then((m) => m.ProductsModule),
    },
    {
      path: "categories",
      loadChildren: () =>
        import("./../categories/categories.module").then((m) => m.CategoriesModule),
    },
    {
      path: "section/:key",
      loadChildren: () =>
        import("./../section/section.module").then((m) => m.SectionModule),
    },
    {
      path: "home",
      loadChildren: () =>
        import("./../home/home.module").then((m) => m.HomeModule),
    },
    {
      path: "about",
      loadChildren: () =>
        import("./../about/about.module").then((m) => m.AboutModule),
    },
    {
      path: "contact",
      loadChildren: () =>
        import("./../contact/contact.module").then((m) => m.ContactModule),
    },
    {
      path: "profile",
      loadChildren: () =>
        import("./../profile/profile.module").then((m) => m.ProfileModule),
    },
    {
      path: "offers",
      loadChildren: () =>
        import("./../offers/offers.module").then((m) => m.OffersModule),
    },
  ])],
  exports: [RouterModule],
})
export class LayoutModule {}
