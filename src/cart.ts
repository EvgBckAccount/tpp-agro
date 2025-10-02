// src/cart.ts
import type { Product } from "./types";

export type CartLine = { product: Product; qty: number };
const KEY = "tppagro_cart";
const EVT = "tppagro_cart_changed";

export function getCart(): CartLine[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}
export function saveCart(items: CartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVT));
}
export function addToCart(product: Product, qty = 1) {
  const cart = getCart();
  const i = cart.findIndex(l => l.product.id === product.id);
  if (i >= 0) cart[i].qty += qty; else cart.push({ product, qty });
  saveCart(cart);
}
export function clearCart() { saveCart([]); }
export function totalCart(items = getCart()): number {
  return items.reduce((s, l) => s + l.product.price * l.qty, 0);
}
export { EVT };
