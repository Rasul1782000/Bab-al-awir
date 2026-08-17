import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { DesignShowcaseComponent } from "./design-showcase";

const routes: Routes = [
  {
    path: "design-showcase",
    component: DesignShowcaseComponent,
  }
];

@NgModule({
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes)],
  declarations: [DesignShowcaseComponent],
})
export class DesignShowcaseModule {}