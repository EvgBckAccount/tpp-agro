import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Product } from "../types";
import { addToCart } from "../cart";
import { fmtUAH } from "../price";
import { PageSEO } from "../seo";
import { Helmet } from "@dr.pogodin/react-helmet";

export default function ProductDetails() {
  const { id } = useParams();
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const byPath = await api.get<Product>(`/products/${id}`);
        if (!active) return;
        setP(byPath.data);
      } catch {
        try {
          const pid = Number(id);
          const byQuery = await api.get<Product[]>("/products", { params: { id: pid } });
          if (!active) return;
          setP(byQuery.data?.[0] ?? null);
        } catch {
          if (active) setP(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <div>Завантаження…</div>;
  if (!p) return <div>Товар не знайдено</div>;

  const img = p.imageUrl || "/placeholder.svg";
  const absImg = typeof window !== "undefined" ? new URL(img, window.location.origin).href : img;

  // JSON-LD Product
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    image: [absImg],
    description: p.shortDescription,
    brand: { "@type": "Brand", name: "Tpp Agro" },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "UAH",
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: typeof window !== "undefined" ? window.location.href : undefined,
    },
  };

  return (
    <>
      <PageSEO
        title={`${p.name} — купити в Tpp Agro`}
        description={p.shortDescription}
        image={img}
      />

      {/* JSON-LD */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="grid md:grid-cols-2 gap-6">
        <img
          className="w-full rounded border"
          src={img}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
          }}
          alt={p.name}
        />
        <div>
          <h1 className="text-2xl font-semibold">{p.name}</h1>
          <div className="text-neutral-600 mt-1">
            {p.sku}
            {p.oem ? ` · OEM: ${p.oem}` : ""}
          </div>
          <div className="mt-4 text-2xl font-bold">{fmtUAH(p.price)}</div>
          <button
            className="mt-4 rounded bg-black text-white px-6 py-3"
            onClick={() => addToCart(p)}
          >
            Додати в кошик
          </button>
          <div className="mt-6 text-sm text-neutral-700">{p.shortDescription}</div>
        </div>
      </div>
    </>
  );
}
