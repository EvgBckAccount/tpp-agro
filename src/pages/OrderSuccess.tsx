import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Order, Product } from "../types";
import { fmtUAH } from "../price";
import { PageSEO } from "../seo";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [{ data: o }, { data: p }] = await Promise.all([
          api.get<Order>(`/orders/${id}`),
          api.get<Product[]>("/products"),
        ]);
        if (!active) return;
        setOrder(o);
        setProducts(p);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <div>Завантаження…</div>;
  if (!order) return <div>Замовлення не знайдено</div>;

  const byId = new Map(products.map((x) => [x.id, x]));
  return (
    <>
      <PageSEO title={`Замовлення №${order.id} — Tpp Agro`} noindex />
      <div className="p-4 border rounded bg-white">
        <h2 className="text-xl font-semibold mb-2">Дякуємо! Замовлення №{order.id} прийнято</h2>
        <div className="text-sm text-neutral-700 mb-3">
          Ми зв’яжемося з вами для підтвердження. Статус: <b>{order.status}</b>
        </div>

        <div className="mb-2 font-medium">Склад замовлення</div>
        <ul className="text-sm">
          {order.items.map((it, i) => {
            const p = byId.get(it.productId);
            const name = p?.name ?? `Товар #${it.productId}`;
            return (
              <li key={i} className="flex justify-between border-b py-1">
                <span>
                  {name} × {it.qty}
                </span>
                <span>{fmtUAH(it.price * it.qty)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 text-right font-semibold">Разом: {fmtUAH(order.total)}</div>

        <div className="mt-4 flex gap-2">
          <Link to="/catalog" className="rounded border px-4 py-2">
            Продовжити покупки
          </Link>
          <Link to="/" className="rounded bg-black text-white px-4 py-2">
            На головну
          </Link>
        </div>
      </div>
    </>
  );
}
