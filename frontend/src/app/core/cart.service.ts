import { Injectable, signal } from "@angular/core";
import { CartItem, Cart, Product } from "./models";

@Injectable({ providedIn: "root" })
export class CartService {
  private readonly STORAGE_KEY = "baw_cart";
  
  private cart = signal<Cart>({ items: [], subtotal: 0, tax: 0, total: 0 });
  
  cart$ = this.cart.asReadonly();
  itemCount = signal(0);
  cartVisible = signal(false);

  toggleCartVisibility(): void {
    this.cartVisible.update((v) => !v);
  }

  constructor() {
    this.loadCart();
  }
  
  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cart();
    const existingItem = currentCart.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.product.price * existingItem.quantity;
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        unitPrice: product.price,
        subtotal: product.price * quantity
      };
      currentCart.items.push(newItem);
    }
    
    this.updateCartTotals();
    this.saveCart();
  }
  
  removeFromCart(productId: number): void {
    const currentCart = this.cart();
    const index = currentCart.items.findIndex(item => item.product.id === productId);
    if (index > -1) {
      currentCart.items.splice(index, 1);
      this.updateCartTotals();
      this.saveCart();
    }
  }
  
  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 0) return;
    
    const currentCart = this.cart();
    const item = currentCart.items.find(item => item.product.id === productId);
    if (item) {
      if (quantity === 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        item.subtotal = item.product.price * quantity;
        this.updateCartTotals();
        this.saveCart();
      }
    }
  }
  
  clearCart(): void {
    this.cart.set({ items: [], subtotal: 0, tax: 0, total: 0 });
    this.saveCart();
  }
  
  isInCart(productId: number): boolean {
    return this.cart().items.some(item => item.product.id === productId);
  }
  
  getQuantity(productId: number): number {
    const item = this.cart().items.find(item => item.product.id === productId);
    return item?.quantity || 0;
  }
  
  private updateCartTotals(): void {
    const currentCart = this.cart();
    const subtotal = currentCart.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;
    
    this.cart.set({ ...currentCart, subtotal, tax, total });
    this.updateItemCount();
  }
  
  private updateItemCount(): void {
    const totalItems = this.cart().items.reduce((sum, item) => sum + item.quantity, 0);
    this.itemCount.set(totalItems);
  }
  
  private saveCart(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cart()));
    } catch {
      /* storage unavailable */
    }
  }
  
  private loadCart(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsedCart = JSON.parse(saved) as Cart;
        this.cart.set(parsedCart);
        this.updateItemCount();
      }
    } catch {
      this.clearCart();
    }
  }
}
