import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";
import { ForgotPassword } from "./forgot-password";

const routes: Routes = [{ path: "", component: ForgotPassword }];

@NgModule({
  declarations: [ForgotPassword],
  imports: [CommonModule, TranslateModule, FormsModule, SharedModule, RouterModule.forChild(routes)],
})
export class ForgotPasswordModule {}
