import { Outlet, Link } from "react-router-dom";
import useCartCount from "./useCartCount";

export default function App() {
  const count = useCartCount();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl p-4 flex gap-6 items-center">
          <Link to="/" className="text-2xl font-bold">Tpp Agro</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/">Головна</Link>
            <Link to="/catalog">Каталог</Link>
            <Link to="/cart" className="relative">
              Кошик
              {count > 0 && (
                <span className="absolute -right-3 -top-2 text-xs bg-black text-white rounded-full px-2">
                  {count}
                </span>
              )}
            </Link>
          </nav>
          <div className="flex-1" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <Outlet />
      </main>

      <footer className="mt-12 border-t py-6 text-sm text-neutral-600">
        <div className="mx-auto max-w-7xl">© {new Date().getFullYear()} Tpp Agro</div>
      </footer>
    </div>
  );
}
