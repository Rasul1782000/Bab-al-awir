import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";
import { Login } from "./login";

const routes: Routes = [{ path: "", component: Login }];

@NgModule({
  declarations: [Login],
  imports: [CommonModule, TranslateModule, FormsModule, SharedModule, RouterModule.forChild(routes)],
})
export class LoginModule {}
