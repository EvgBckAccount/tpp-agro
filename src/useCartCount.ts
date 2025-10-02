import { useEffect, useState } from "react";
import { EVT, getCart } from "./cart";

export default function useCartCount() {
  const calc = () => getCart().reduce((n, l) => n + l.qty, 0);
  const [count, setCount] = useState<number>(calc);

  useEffect(() => {
    const upd = () => setCount(calc());
    window.addEventListener(EVT, upd);
    window.addEventListener("storage", upd);
    return () => {
      window.removeEventListener(EVT, upd);
      window.removeEventListener("storage", upd);
    };
  }, []);
  return count;
}
