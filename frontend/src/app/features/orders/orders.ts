import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { OrderService } from "../../core/order.service";
import { UserProfile, Order } from "../../core/models";

@Component({
  selector: "app-orders",
  standalone: false,
  templateUrl: "./orders.html",
  styleUrl: "./orders.scss",
})
export class Orders {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  private orderSvc = inject(OrderService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  user = signal<UserProfile | null>(null);
  selectedOrder = signal<Order | null>(null);

  orders = computed<Order[]>(() => {
    const placed = this.orderSvc.orders$();
    const staticOrders = this.user()?.orders ?? [];
    const mapped = placed.map((p) => ({
      id: p.id,
      date: p.date,
      total: p.total,
      status: p.status,
      items: p.items.length,
      delivery_method: p.deliveryMethod,
      estimated_delivery: p.estimatedDelivery,
    })) as Order[];
    return [...mapped, ...staticOrders];
  });

  constructor() {
    this.api.getUserProfile().subscribe((r) => this.user.set(r.data ?? null));
  }

  symbol = computed(() => (this.lang() === "ar" ? "د.إ" : "AED"));

  statusClass(status: string): string {
    return `order-status--${status.toLowerCase().replace(/\s+/g, "-")}`;
  }

  statusText(status: string): string {
    return status;
  }

  viewOrder(order: Order): void {
    this.selectedOrder.set(order);
  }

  backToList(): void {
    this.selectedOrder.set(null);
  }
}
