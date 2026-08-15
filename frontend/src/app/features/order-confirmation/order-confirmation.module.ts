import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PageHeroModule } from "../../shared/page-hero/page-hero.module";
import { OrderConfirmation } from "./order-confirmation";

const routes: Routes = [{ path: "", component: OrderConfirmation }];

@NgModule({
  declarations: [OrderConfirmation],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), PageHeroModule],
})
export class OrderConfirmationModule {}
