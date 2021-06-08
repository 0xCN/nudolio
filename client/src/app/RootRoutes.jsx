import React from "react";
import { Redirect } from "react-router-dom";
import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import userRoutes from "./views/users/UserRoutes";
import productsRoutes from "./views/products/ProductsRoutes";
import keyRoutes from "./views/license-keys/KeyRoutes";
import sessionRoutes from "./views/sessions/SessionRoutes";
import apiRoutes from "./views/api/ApiRoutes";


const redirectRoute = [
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard/analytics" />
  }
];

const errorRoute = [
  {
    component: () => <Redirect to="/session/404" />
  }
];

const routes = [
  ...productsRoutes,
  ...keyRoutes,
  ...sessionRoutes,
  ...dashboardRoutes,
  ...userRoutes,
  ...apiRoutes,
  ...redirectRoute,
  ...errorRoute,
];


export default routes;