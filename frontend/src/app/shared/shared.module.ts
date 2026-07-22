import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { ProductCard } from "./product-card/product-card";
import { FlagIcon } from "./flag-icon/flag-icon";
import { BgImageDirective } from "./bg-image.directive";
import { Cart } from "../features/cart/cart";

@NgModule({
  declarations: [ProductCard, FlagIcon, Cart],
  imports: [CommonModule, TranslateModule, RouterModule.forChild([]), BgImageDirective],
  exports: [ProductCard, FlagIcon, Cart, BgImageDirective],
})
export class SharedModule {}
