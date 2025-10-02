// src/pages/AdminOrders.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Order } from "../types";

export default function AdminOrders() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get<Order[]>("/orders", { params: { _sort: "createdAt", _order: "desc" } });
    setItems(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const markDone = async (id: number) => {
    await api.patch(`/orders/${id}`, { status: "done" });
    await load();
  };

  if (loading) return <div>Завантаження…</div>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Замовлення (адмін)</h2>
      {items.length === 0 ? <div>Замовлень поки немає</div> : (
        <div className="overflow-auto">
          <table className="min-w-[700px] w-full bg-white border rounded">
            <thead className="text-left border-b">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Дата</th>
                <th className="p-2">Клієнт</th>
                <th className="p-2">Телефон</th>
                <th className="p-2">Сума</th>
                <th className="p-2">Статус</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(o => (
                <tr key={o.id} className="border-b">
                  <td className="p-2"><Link className="underline" to={`/order/${o.id}`}>#{o.id}</Link></td>
                  <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-2">{o.customerName}</td>
                  <td className="p-2"><a className="underline" href={`tel:${o.phone}`}>{o.phone}</a></td>
                  <td className="p-2">{o.total.toFixed(2)} UAH</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">
                    {o.status !== "done" && (
                      <button className="border rounded px-3 py-1" onClick={() => markDone(o.id)}>
                        Завершити
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
