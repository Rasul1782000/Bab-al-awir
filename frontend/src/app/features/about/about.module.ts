import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PageHeroModule } from "../../shared/page-hero/page-hero.module";
import { About } from "./about";

const routes: Routes = [{ path: "", component: About }];

@NgModule({
  declarations: [About],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), PageHeroModule],
})
export class AboutModule {}
