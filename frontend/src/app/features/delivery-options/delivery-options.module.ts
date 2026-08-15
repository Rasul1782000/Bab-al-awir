import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PageHeroModule } from "../../shared/page-hero/page-hero.module";
import { DeliveryOptions } from "./delivery-options";

const routes: Routes = [{ path: "", component: DeliveryOptions }];

@NgModule({
  declarations: [DeliveryOptions],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), PageHeroModule],
})
export class DeliveryOptionsModule {}
