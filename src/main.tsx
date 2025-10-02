import type { ReactElement } from "react";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import { SEOProvider } from "./seo";

import App from "./App";
const Home = lazy(() => import("./pages/Home"));
const Catalog = lazy(() => import("./pages/Catalog"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const NotFound = lazy(() => import("./pages/NotFound"));

const withFallback = (el: ReactElement) => (
  <Suspense fallback={<div>Завантаження…</div>}>{el}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // в App має бути <Outlet />
    children: [
      { index: true, element: withFallback(<Home />) },
      { path: "catalog", element: withFallback(<Catalog />) },
      { path: "product/:id", element: withFallback(<ProductDetails />) },
      { path: "cart", element: withFallback(<Cart />) },
      { path: "checkout", element: withFallback(<Checkout />) },
      { path: "order/:id", element: withFallback(<OrderSuccess />) },
      { path: "admin/orders", element: withFallback(<AdminOrders />) },
      { path: "*", element: withFallback(<NotFound />) },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SEOProvider>
        <RouterProvider router={router} />
      </SEOProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
