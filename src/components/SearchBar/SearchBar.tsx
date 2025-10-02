import { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar() {
  const [params] = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const nav = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    nav(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="w-full max-w-[380px] border px-3 py-2 rounded"
        placeholder="Пошук по назві, SKU, OEM…"
        value={q}
        onChange={(e)=>setQ(e.target.value)}
      />
      <button className="border px-4 rounded">Знайти</button>
    </form>
  );
}
