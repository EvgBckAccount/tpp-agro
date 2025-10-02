import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import type { Product } from "../types";
import CatalogFilters from "../components/CatalogFilters";
import { addToCart } from "../cart";
import { fmtUAH } from "../price";
import { PageSEO } from "../seo";

type Status = "loading" | "success" | "error";

export default function Catalog() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "price_asc";
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const limit = 8;

  const [{ _sort, _order }, sortLabel] = useMemo(() => {
    if (sort === "price_desc") return [{ _sort: "price", _order: "desc" as const }, "Ціна ↓"];
    if (sort === "name_asc")   return [{ _sort: "name",  _order: "asc"  as const }, "Назва A→Z"];
    return [{ _sort: "price", _order: "asc" as const }, "Ціна ↑"];
  }, [sort]);

  const [items, setItems] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setStatus("loading");
        const { data, headers } = await api.get<Product[]>("/products", {
          params: {
            ...(q ? { q } : {}),
            ...(category ? { category } : {}),
            _page: page,
            _limit: limit,
            _sort,
            _order,
          },
        });
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
        setTotal(Number(headers["x-total-count"] ?? data.length));
        setStatus("success");
      } catch (e: any) {
        if (!active) return;
        setError(e?.message ?? "Помилка завантаження");
        setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [q, category, page, _sort, _order]);

  const pages = Math.max(1, Math.ceil(total / limit));
  const goto = (p: number) => {
    const pms = new URLSearchParams(params);
    pms.set("page", String(p));
    nav(`/catalog?${pms.toString()}`);
  };

  if (status === "loading") return <div>Завантаження…</div>;
  if (status === "error") return <div className="text-red-600">Помилка: {error}</div>;

  return (
    <>
      <PageSEO title="Каталог — Tpp Agro" />
      <h2 className="text-xl font-semibold mb-2">
        Каталог {q && <span className="text-neutral-500 text-sm">— пошук: “{q}”</span>}
      </h2>

      <CatalogFilters />

      {items.length === 0 ? (
        <div className="p-3 rounded bg-blue-50 text-blue-900 border">
          Нічого не знайдено. Змініть фільтри або запит.
        </div>
      ) : (
        <>
          <div className="text-sm text-neutral-600 mb-3">
            Знайдено: {total}. Сортування: {sortLabel}. Сторінка {page}/{pages}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <article key={p.id} className="rounded border bg-white">
                <Link to={`/product/${p.id}`}>
                  <img
                    src={p.imageUrl || "/placeholder.svg"}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                    }}
                    alt={p.name}
                    className="w-full aspect-square object-cover"
                  />
                </Link>
                <div className="p-3">
                  <Link to={`/product/${p.id}`} className="line-clamp-2 font-medium">
                    {p.name}
                  </Link>
                  <div className="mt-1 text-sm text-neutral-600">
                    {p.sku}
                    {p.oem ? ` · OEM: ${p.oem}` : ""}
                  </div>
                  <div className="mt-2 font-semibold">{fmtUAH(p.price)}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Link to={`/product/${p.id}`} className="rounded border px-3 py-2 text-center">
                      Переглянути
                    </Link>
                    <button className="rounded bg-black text-white px-3 py-2" onClick={() => addToCart(p)}>
                      Додати в кошик
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              className="border rounded px-3 py-1 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => goto(page - 1)}
            >
              Назад
            </button>
            <span className="text-sm">
              Сторінка {page} з {pages}
            </span>
            <button
              className="border rounded px-3 py-1 disabled:opacity-50"
              disabled={page >= pages}
              onClick={() => goto(page + 1)}
            >
              Вперед
            </button>
          </div>
        </>
      )}
    </>
  );
}
