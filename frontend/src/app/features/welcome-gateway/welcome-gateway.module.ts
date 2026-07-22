import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { WelcomeGateway } from "./welcome-gateway";

const routes: Routes = [{ path: "", component: WelcomeGateway }];

@NgModule({
  declarations: [WelcomeGateway],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), FormsModule, SharedModule],
})
export class WelcomeGatewayModule {}
