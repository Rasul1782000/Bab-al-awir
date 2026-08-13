import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";
import { Signup } from "./signup";

const routes: Routes = [{ path: "", component: Signup }];

@NgModule({
  declarations: [Signup],
  imports: [CommonModule, TranslateModule, FormsModule, SharedModule, RouterModule.forChild(routes)],
})
export class SignupModule {}
