import React from "react";
import { authRoles } from "../../auth/authRoles";

const dashboardRoutes = [
  {
    path: "/products/",
    component: React.lazy(() => import("./Products")),
    auth: authRoles.admin
  }
];

export default dashboardRoutes;
