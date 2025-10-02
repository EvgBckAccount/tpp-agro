import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CATEGORIES = ["Фільтри", "Ремені", "Підшипники", "Сальники", "Гідравліка", "Розпилювачі"];

export default function CatalogFilters() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const [category, setCategory] = useState(params.get("category") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "price_asc");

  useEffect(() => {
    // синхронізація зі змінами URL
    setCategory(params.get("category") ?? "");
    setSort(params.get("sort") ?? "price_asc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  const apply = () => {
    const p = new URLSearchParams(params);

    if (category) {
      p.set("category", category);
    } else {
      p.delete("category");
    }

    if (sort) {
      p.set("sort", sort);
    } else {
      p.delete("sort");
    }

    p.set("page", "1"); // при зміні фільтрів повертаємось на 1 сторінку
    nav(`/catalog?${p.toString()}`);
  };

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-sm mb-1">Категорія</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 min-w-52"
        >
          <option value="">Усі</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Сортування</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-2 min-w-52"
        >
          <option value="price_asc">Ціна ↑</option>
          <option value="price_desc">Ціна ↓</option>
          <option value="name_asc">Назва A→Z</option>
        </select>
      </div>

      <button onClick={apply} className="border rounded px-4 py-2">
        Застосувати
      </button>
    </div>
  );
}
