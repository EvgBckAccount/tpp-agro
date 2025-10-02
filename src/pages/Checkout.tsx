import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { getCart, totalCart, clearCart } from "../cart";
import type { OrderPayload } from "../types";

export default function Checkout() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const cart = getCart();
  const total = totalCart(cart);

  useEffect(() => {
    if (cart.length === 0) nav("/cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) return alert("Заповніть ім'я, телефон і адресу");

    const payload: OrderPayload = {
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      note: note.trim() || undefined,
      items: cart.map((l) => ({ productId: l.product.id, qty: l.qty, price: l.product.price })),
      total,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    try {
      setLoading(true);
      const { data } = await api.post("/orders", payload);
      clearCart();
      nav(`/order/${data.id}`); // редірект на сторінку успіху
      return;
    } catch (err: any) {
      alert(`Помилка відправки: ${err?.message ?? "невідомо"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Оформлення замовлення</h2>

      <div className="mb-4 p-3 border rounded bg-white">
        <div className="font-medium mb-2">Ваше замовлення</div>
        {cart.map((l) => (
          <div key={l.product.id} className="text-sm flex justify-between py-1 border-b last:border-0">
            <span>
              {l.product.name} × {l.qty}
            </span>
            <span>
              {(l.product.price * l.qty).toFixed(2)} {l.product.currency}
            </span>
          </div>
        ))}
        <div className="mt-2 text-right font-semibold">Разом: {total.toFixed(2)} UAH</div>
      </div>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4 max-w-2xl">
        <input
          className="border rounded px-3 py-2"
          placeholder="Ім'я та прізвище"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Телефон (+380...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="tel"
          pattern={String.raw`^\+?[0-9][0-9()\s-]{7,}$`}
          title="Введіть номер, напр. +380631234567"
          required
        />
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Адреса доставки"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <textarea
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Коментар (необов'язково)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button disabled={loading} className="md:col-span-2 rounded bg-black text-white px-4 py-2 disabled:opacity-50">
          {loading ? "Відправляємо…" : "Підтвердити замовлення"}
        </button>
      </form>
    </>
  );
}
