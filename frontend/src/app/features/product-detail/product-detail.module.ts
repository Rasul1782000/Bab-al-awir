import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../shared/shared.module";
import { PageHeroModule } from "../../shared/page-hero/page-hero.module";
import { ProductDetail } from "./product-detail";

const routes: Routes = [{ path: "", component: ProductDetail }];

@NgModule({
  declarations: [ProductDetail],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), SharedModule, PageHeroModule],
})
export class ProductDetailModule {}
