import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PageHeroModule } from "../../shared/page-hero/page-hero.module";
import { SharedModule } from "../../shared/shared.module";
import { NewsDetail } from "./news-detail";

const routes: Routes = [{ path: "", component: NewsDetail }];

@NgModule({
  declarations: [NewsDetail],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), PageHeroModule, SharedModule],
})
export class NewsDetailModule {}
