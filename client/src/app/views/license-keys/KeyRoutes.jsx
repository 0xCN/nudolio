import React from "react";
import { authRoles } from "../../auth/authRoles";

const keyRoutes = [
  {
    path: "/keys/not-in-use/",
    component: React.lazy(() => import("./not-in-use/Main")),
    auth: authRoles.admin
  },
  {
    path: "/keys/in-use/",
    component: React.lazy(() => import("./in-use/Main")),
    auth: authRoles.admin
  }
];

export default keyRoutes;
