import React from "react";
import { authRoles } from "../../auth/authRoles";

const userRoutes = [
  {
    path: "/users/",
    component: React.lazy(() => import("./Users")),
    auth: authRoles.admin
  }
];

export default userRoutes;
