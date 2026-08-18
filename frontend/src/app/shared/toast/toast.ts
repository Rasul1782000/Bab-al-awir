import { Component, inject } from "@angular/core";
import { ToastService } from "../../core/toast.service";

@Component({
  selector: "app-toast",
  standalone: false,
  templateUrl: "./toast.html",
  styleUrl: "./toast.scss",
})
export class Toast {
  private toastSvc = inject(ToastService);
  toasts = this.toastSvc.toasts$;

  dismiss(id: number): void {
    this.toastSvc.dismiss(id);
  }
}
