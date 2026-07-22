import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../shared/shared.module";
import { Section } from "./section";

const routes: Routes = [{ path: "", component: Section }];

@NgModule({
  declarations: [Section],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), SharedModule],
})
export class SectionModule {}
