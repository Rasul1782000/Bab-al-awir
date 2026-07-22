import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { Cart } from "./cart";

const routes: Routes = [{ path: "", component: Cart }];

@NgModule({
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), FormsModule, SharedModule],
})
export class CartModule {}
