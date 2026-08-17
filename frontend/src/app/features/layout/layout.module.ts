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
      path: "products/:id",
      loadChildren: () =>
        import("./../product-detail/product-detail.module").then((m) => m.ProductDetailModule),
    },
    {
      path: "checkout",
      loadChildren: () =>
        import("./../checkout/checkout.module").then((m) => m.CheckoutModule),
    },
    {
      path: "order-confirmation",
      loadChildren: () =>
        import("./../order-confirmation/order-confirmation.module").then((m) => m.OrderConfirmationModule),
    },
    {
      path: "orders",
      loadChildren: () =>
        import("./../orders/orders.module").then((m) => m.OrdersModule),
    },
    {
      path: "wishlist",
      loadChildren: () =>
        import("./../wishlist/wishlist.module").then((m) => m.WishlistModule),
    },
    {
      path: "faq",
      loadChildren: () =>
        import("./../faq/faq.module").then((m) => m.FaqModule),
    },
    {
      path: "store-locations",
      loadChildren: () =>
        import("./../store-locations/store-locations.module").then((m) => m.StoreLocationsModule),
    },
    {
      path: "delivery-options",
      loadChildren: () =>
        import("./../delivery-options/delivery-options.module").then((m) => m.DeliveryOptionsModule),
    },
    {
      path: "testimonials",
      loadChildren: () =>
        import("./../testimonials/testimonials.module").then((m) => m.TestimonialsModule),
    },
    {
      path: "news",
      loadChildren: () =>
        import("./../news/news.module").then((m) => m.NewsModule),
    },
    {
      path: "news/:id",
      loadChildren: () =>
        import("./../news-detail/news-detail.module").then((m) => m.NewsDetailModule),
    },
    {
      path: "promos",
      loadChildren: () =>
        import("./../promos/promos.module").then((m) => m.PromosModule),
    },
    {
      path: "privacy-policy",
      loadChildren: () =>
        import("./../privacy-policy/privacy-policy.module").then((m) => m.PrivacyPolicyModule),
    },
    {
      path: "terms",
      loadChildren: () =>
        import("./../terms/terms.module").then((m) => m.TermsModule),
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
    {
      path: "brands",
      loadChildren: () =>
        import("./../brands/brands.module").then((m) => m.BrandsModule),
    },
  ])],
  exports: [RouterModule],
})
export class LayoutModule {}
