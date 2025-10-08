// src/seo.tsx
import { Helmet, HelmetProvider } from "@dr.pogodin/react-helmet";
import type { ReactNode } from "react";

export const SEOProvider = ({ children }: { children: ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

type Props = {
  title: string;
  description?: string;
  image?: string; // відносний (/img.jpg) або абсолютний URL
  noindex?: boolean;
};

export const PageSEO = ({ title, description, image, noindex }: Props) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = typeof window !== "undefined" ? window.location.href : "";
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${origin}${image}`
    : origin
      ? `${origin}/og-default.jpg`
      : "/og-default.jpg";

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
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};
