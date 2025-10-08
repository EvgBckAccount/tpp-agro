import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Order } from "../types";
import { fmtUAH } from "../price";
import { PageSEO } from "../seo";

type LoadState = "idle" | "loading" | "error" | "success";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string>("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "shipped" | "done">("all");

  const fetchOrders = async () => {
    try {
      setState("loading");
      // сортуємо за датою створення, найновіші зверху
      const { data } = await api.get<Order[]>("/orders", {
        params: { _sort: "createdAt", _order: "desc" },
      });
      setOrders(Array.isArray(data) ? data : []);
      setState("success");
    } catch (e: any) {
      setError(e?.message ?? "Не вдалося завантажити замовлення");
      setState("error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markDone = async (id: number) => {
    try {
      setBusyId(id);
      await api.patch(`/orders/${id}`, { status: "done" });
      // оновлюємо локально без додаткового запиту
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "done" } : o)));
    } catch (e: any) {
      alert(`Не вдалося оновити статус: ${e?.message ?? "невідомо"}`);
    } finally {
      setBusyId(null);
    }
  };

  const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleString("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filtered = orders.filter((o) => (filter === "all" ? true : o.status === filter));

  return (
    <>
      <PageSEO title="Замовлення (адмін) — Tpp Agro" noindex />

      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xl font-semibold">Замовлення</h2>
        <button
          className="ml-auto rounded border px-3 py-1"
          onClick={fetchOrders}
          disabled={state === "loading"}
          title="Оновити"
        >
          Оновити
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm mb-1">Фільтр за статусом</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded px-3 py-2 min-w-48"
          >
            <option value="all">Усі</option>
            <option value="pending">Очікує</option>
            <option value="confirmed">Підтверджено</option>
            <option value="shipped">Відправлено</option>
            <option value="done">Завершено</option>
          </select>
        </div>
        <div className="text-sm text-neutral-600">
          Показано: {filtered.length} з {orders.length}
        </div>
      </div>

      {state === "loading" && <div>Завантаження…</div>}
      {state === "error" && <div className="text-red-600">Помилка: {error}</div>}

      {state === "success" && (
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white">
            <thead className="bg-neutral-50">
              <tr className="text-left">
                <th className="px-3 py-2 border-b">№</th>
                <th className="px-3 py-2 border-b">Створено</th>
                <th className="px-3 py-2 border-b">Клієнт</th>
                <th className="px-3 py-2 border-b">Телефон</th>
                <th className="px-3 py-2 border-b">Адреса</th>
                <th className="px-3 py-2 border-b">Сума</th>
                <th className="px-3 py-2 border-b">Статус</th>
                <th className="px-3 py-2 border-b w-0">Дія</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b align-top">
                  <td className="px-3 py-2">{o.id}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmtDateTime(o.createdAt)}</td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{o.customerName}</div>
                    {o.note && (
                      <div className="text-xs text-neutral-600 mt-1">Примітка: {o.note}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{o.phone}</td>
                  <td className="px-3 py-2">{o.address}</td>
                  <td className="px-3 py-2 font-semibold whitespace-nowrap">{fmtUAH(o.total)}</td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        "inline-block rounded px-2 py-1 text-xs " +
                        (o.status === "done"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : o.status === "confirmed"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-neutral-100 text-neutral-800")
                      }
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {o.status !== "done" && (
                      <button
                        onClick={() => markDone(o.id)}
                        disabled={busyId === o.id}
                        className="rounded bg-black text-white px-3 py-1 disabled:opacity-50"
                        title="Позначити як завершене"
                      >
                        {busyId === o.id ? "Завершуємо…" : "Завершити"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-neutral-600">
                    Немає замовлень для відображення
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
