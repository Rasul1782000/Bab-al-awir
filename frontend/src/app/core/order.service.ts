import { Injectable, inject, signal } from "@angular/core";
import { CartItem, SavedAddress } from "./models";
import { ApiService } from "./api.service";

export interface PlacedOrder {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: string;
  deliveryMethod: string;
  paymentMethod: string;
  address: SavedAddress | string | null;
  estimatedDelivery: string;
}

const STORAGE_KEY = "baw_orders";

@Injectable({ providedIn: "root" })
export class OrderService {
  private orders = signal<PlacedOrder[]>([]);
  private api = inject(ApiService);

  orders$ = this.orders.asReadonly();

  constructor() {
    this.load();
  }

  placeOrder(data: Omit<PlacedOrder, "id" | "date">): PlacedOrder {
    const order: PlacedOrder = {
      ...data,
      id: "BAW-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
    };
    this.orders.update((list) => [order, ...list]);
    this.save();
    return order;
  }

  getOrders(): PlacedOrder[] {
    return this.orders();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.orders.set(JSON.parse(raw) as PlacedOrder[]);
    } catch {
      /* storage unavailable */
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders()));
    } catch {
      /* storage unavailable */
    }
  }
}
