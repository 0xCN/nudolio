import React from "react";
import { authRoles } from "../../auth/authRoles";

const apiRoutes = [
  {
    path: "/docs/api",
    component: React.lazy(() => import("./Api.jsx")),
    auth: authRoles.admin
  }
];

export default apiRoutes;
