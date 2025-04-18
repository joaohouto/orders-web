import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router";

import { PrivateRoute } from "./private-route";

import { NotFoundPage } from "@/pages/not-found";
import { LandingPage } from "@/pages/public/Landing";
import { AuthPage } from "@/pages/auth";
import { StorePage } from "@/pages/public/Store";
import { ProfilePage } from "@/pages/public/Profile";
import { ProductPage } from "@/pages/public/Store/Product";

import { AppLayout } from "../pages/app/layout";
import { AppPage } from "@/pages/app";
import { DashboardPage } from "@/pages/app/Dashboard";
import { StorePage as ConfigStorePage } from "@/pages/app/Store";

import { ProductsPage } from "@/pages/app/Products";
import { CreateProductPage } from "@/pages/app/Products/Create";
import { EditProductPage } from "@/pages/app/Products/Edit";

import { OrdersPage } from "@/pages/app/Orders";
import { ViewOrderPage } from "@/pages/app/Orders/View";
import { TeamPage } from "@/pages/app/Team";
import { CheckoutPage } from "../pages/public/Checkout";
import { PaymentPage } from "../pages/public/Payment";
import { UserOrdersPage } from "@/pages/public/UserOrders";

export function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<UserOrdersPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:orderId/payment" element={<PaymentPage />} />

          <Route path="/app" element={<AppPage />} />

          <Route path="/app/:storeSlug" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />

            <Route path="products" element={<ProductsPage />} />
            <Route path="products/create" element={<CreateProductPage />} />
            <Route
              path="products/e/:productSlug"
              element={<EditProductPage />}
            />

            <Route path="team" element={<TeamPage />} />
            <Route path="config" element={<ConfigStorePage />} />

            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/v/:orderId" element={<ViewOrderPage />} />
          </Route>
        </Route>

        <Route path="/:storeSlug" element={<StorePage />} />
        <Route path="/:storeSlug/p/:productSlug" element={<ProductPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}
