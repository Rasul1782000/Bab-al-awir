import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { Home } from "./home";

const routes: Routes = [{ path: "", component: Home }];

@NgModule({
  declarations: [Home],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), FormsModule, SharedModule],
})
export class HomeModule {}
