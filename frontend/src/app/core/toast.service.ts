import { Injectable, signal } from "@angular/core";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}

@Injectable({ providedIn: "root" })
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private seq = 0;

  toasts$ = this.toasts.asReadonly();

  show(message: string, type: Toast["type"] = "success", duration = 2600): void {
    const id = ++this.seq;
    this.toasts.update((list) => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void {
    this.show(message, "success");
  }

  info(message: string): void {
    this.show(message, "info");
  }

  error(message: string): void {
    this.show(message, "error");
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
