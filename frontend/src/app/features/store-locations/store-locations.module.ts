import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PageHeroModule } from "../../shared/page-hero/page-hero.module";
import { StoreLocations } from "./store-locations";

const routes: Routes = [{ path: "", component: StoreLocations }];

@NgModule({
  declarations: [StoreLocations],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), PageHeroModule],
})
export class StoreLocationsModule {}
