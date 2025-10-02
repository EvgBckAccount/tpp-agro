import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { CartLine } from "../cart";
import { clearCart, getCart, saveCart, totalCart } from "../cart";
import { fmtUAH } from "../price";

export default function Cart() {
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = totalCart(items);

  const setQty = (id: number, qty: number) => {
    const next = items.map((l) => (l.product.id === id ? { ...l, qty: Math.max(1, qty) } : l));
    setItems(next);
    saveCart(next);
  };

  const removeLine = (id: number) => {
    const next = items.filter((l) => l.product.id !== id);
    setItems(next);
    saveCart(next);
  };

  const clear = () => {
    setItems([]);
    clearCart();
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Кошик</h2>
      {items.length === 0 ? (
        <div>Порожньо</div>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((l) => (
              <li key={l.product.id} className="border rounded p-3 flex items-center gap-3">
                <img
                  src={l.product.imageUrl || "/placeholder.svg"}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="flex-1">
                  <div className="font-medium">{l.product.name}</div>
                  <div className="text-sm text-neutral-600">{l.product.sku}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <button className="border px-2 rounded" onClick={() => setQty(l.product.id, l.qty - 1)}>
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      className="w-16 border rounded px-2 py-1"
                      value={l.qty}
                      onChange={(e) => setQty(l.product.id, Number(e.target.value) || 1)}
                    />
                    <button className="border px-2 rounded" onClick={() => setQty(l.product.id, l.qty + 1)}>
                      +
                    </button>
                    <button className="text-red-600 ml-4" onClick={() => removeLine(l.product.id)}>
                      Видалити
                    </button>
                  </div>
                </div>
                <div className="font-semibold whitespace-nowrap">{fmtUAH(l.product.price * l.qty)}</div>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-right font-semibold">Разом: {fmtUAH(total)}</div>
          <div className="mt-3 flex gap-2 justify-end">
            <button className="rounded border px-4 py-2" onClick={clear}>
              Очистити
            </button>
            <Link to="/checkout" className="rounded bg-black text-white px-4 py-2">
              Оформити
            </Link>
          </div>
        </>
      )}
    </>
  );
}
