import { PageSEO } from "../seo";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <PageSEO
        title="Tpp Agro — магазин запчастин для с/г техніки"
        description="Фільтри, ремені, підшипники, гідравліка та інші розхідники для с/г техніки."
      />
      <section className="p-6 bg-white border rounded">
        <h2 className="text-2xl font-bold mb-2">Ласкаво просимо в Tpp Agro</h2>
        <p>Запчастини та розхідники для вашої техніки.</p>
        <Link to="/catalog" className="inline-block mt-4 bg-black text-white px-4 py-2 rounded">
          Перейти в каталог
        </Link>
      </section>
    </>
  );
}
// test
