// src/components/SearchBar/SearchBar.tsx
import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [q, setQ] = useState(params.get("q") ?? "");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(params);

    if (q) {
      p.set("q", q);
    } else {
      p.delete("q");
    }

    p.set("page", "1");
    nav(`/catalog?${p.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="border rounded px-3 py-2"
        placeholder="Пошук…"
      />
      <button type="submit" className="border rounded px-3 py-2">
        Знайти
      </button>
    </form>
  );
}
