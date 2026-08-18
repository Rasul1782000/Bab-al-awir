import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { PaymentModal } from "./payment-modal";

@NgModule({
  declarations: [PaymentModal],
  imports: [CommonModule, FormsModule, TranslateModule],
  exports: [PaymentModal],
})
export class PaymentModalModule {}
