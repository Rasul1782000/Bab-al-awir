import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PageHeroModule } from "../../shared/page-hero/page-hero.module";
import { Contact } from "./contact";

const routes: Routes = [{ path: "", component: Contact }];

@NgModule({
  declarations: [Contact],
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule.forChild(routes), PageHeroModule],
})
export class ContactModule {}
