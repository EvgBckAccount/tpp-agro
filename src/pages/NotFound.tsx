import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-6 border rounded bg-white">
      <h2 className="text-2xl font-semibold mb-2">Сторінку не знайдено (404)</h2>
      <p className="text-neutral-700">Перевірте адресу або поверніться на головну.</p>
      <div className="mt-4">
        <Link to="/" className="rounded bg-black text-white px-4 py-2">На головну</Link>
      </div>
    </div>
  );
}
