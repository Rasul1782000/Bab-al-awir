import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { PageHero } from "./page-hero";
import { BgImageDirective } from "../bg-image.directive";

@NgModule({
  declarations: [PageHero],
  imports: [CommonModule, TranslateModule, RouterModule.forChild([]), BgImageDirective],
  exports: [PageHero],
})
export class PageHeroModule {}
