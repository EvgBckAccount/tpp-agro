import { Helmet, HelmetProvider } from "@dr.pogodin/react-helmet";
import { ReactNode } from "react";

export const SEOProvider = ({ children }: { children: ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export const PageSEO = ({ title, description }: { title: string; description?: string }) => (
  <Helmet>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </Helmet>
);
