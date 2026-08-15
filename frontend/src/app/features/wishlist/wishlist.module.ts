import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../shared/shared.module";
import { PageHeroModule } from "../../shared/page-hero/page-hero.module";
import { Wishlist } from "./wishlist";

const routes: Routes = [{ path: "", component: Wishlist }];

@NgModule({
  declarations: [Wishlist],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), SharedModule, PageHeroModule],
})
export class WishlistModule {}
