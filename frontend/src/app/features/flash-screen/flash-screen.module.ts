import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FlashScreen } from "./flash-screen";

const routes: Routes = [{ path: "", component: FlashScreen }];

@NgModule({
  declarations: [FlashScreen],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class FlashScreenModule {}