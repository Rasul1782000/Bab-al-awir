import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PageHeroModule } from "../../shared/page-hero/page-hero.module";
import { SharedModule } from "../../shared/shared.module";
import { News } from "./news";

const routes: Routes = [{ path: "", component: News }];

@NgModule({
  declarations: [News],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), PageHeroModule, SharedModule],
})
export class NewsModule {}
