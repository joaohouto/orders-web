import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router";

import { AuthPage } from "@/pages/auth";
import { StorePage } from "@/pages/public/Store";

import { AppLayout } from "./pages/app/layout";
import { AppPage } from "@/pages/app";
import { NotFoundPage } from "@/pages/not-found";
import { DashboardPage } from "@/pages/app/Dashboard";
import { ProductsPage } from "@/pages/app/Products";

export function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<AuthPage />} />

        <Route path="/app" element={<AppPage />} />

        <Route path="/app/:storeSlug" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>

        <Route path="/:storeSlug" element={<StorePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}
