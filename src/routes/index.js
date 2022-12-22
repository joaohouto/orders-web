import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import Route from "./Route";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import Categories from "../pages/Category";
import CreateCategory from "../pages/Category/Create";
import ViewCategory from "../pages/Category/View";
import EditCategory from "../pages/Category/Edit";

import Products from "../pages/Product";
import CreateProduct from "../pages/Product/Create";
import ViewProduct from "../pages/Product/View";
import EditProduct from "../pages/Product/Edit";

import Orders from "../pages/Order";
import CreateOrder from "../pages/Order/Create";
import ViewOrders from "../pages/Order/ViewAll";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={SignIn} />
        <Route exact path="/cadastro" component={SignUp} />
        <Route exact path="/recuperar" component={ForgotPassword} />
        <Route exact path="/nova-senha" component={ResetPassword} />

        <Route exact path="/categorias" component={Categories} isPrivate />
        <Route
          exact
          path="/categorias/novo"
          component={CreateCategory}
          isPrivate
        />
        <Route
          exact
          path="/categorias/v/:id"
          component={ViewCategory}
          isPrivate
        />
        <Route
          exact
          path="/categorias/e/:id"
          component={EditCategory}
          isPrivate
        />

        <Route exact path="/produtos" component={Products} isPrivate />
        <Route
          exact
          path="/produtos/novo"
          component={CreateProduct}
          isPrivate
        />
        <Route exact path="/produtos/v/:id" component={ViewProduct} isPrivate />
        <Route exact path="/produtos/e/:id" component={EditProduct} isPrivate />

        <Route exact path="/" component={Orders} isPrivate />
        <Route exact path="/pedidos/novo" component={CreateOrder} isPrivate />
        <Route exact path="/pedidos/todos" component={ViewOrders} isPrivate />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
