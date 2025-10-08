import { Helmet, HelmetProvider } from "@dr.pogodin/react-helmet";
import type { ReactNode } from "react";

export const SEOProvider = ({ children }: { children: ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export const PageSEO = ({ title, description }: { title: string; description?: string }) => (
  <Helmet>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </Helmet>
);
// src/seo.tsx
import { Helmet, HelmetProvider } from "@dr.pogodin/react-helmet";
import type { ReactNode } from "react";

export const SEOProvider = ({ children }: { children: ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

type Props = {
  title: string;
  description?: string;
  image?: string; // абсолютний або відносний шлях (для OG)
  noindex?: boolean; // для службових сторінок
};

export const PageSEO = ({ title, description, image, noindex }: Props) => {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const ogImage = image ?? "/og-default.jpg"; // поклади public/og-default.jpg

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* canonical */}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
