export const navigations = [
  {
    name: "Dashboard",
    path: "/dashboard/analytics",
    icon: "dashboard"
  },
  {
    name: "License Keys",
    icon: "vpn_key",
    children: [
      {
        name: "In-Use",
        path: "/keys/in-use/",
      },
      {
        name: "Not In-Use",
        path: "/keys/not-in-use/",
      }
    ]
  },
  {
    name: "Users",
    icon: "supervisor_account",
    path: "/users/"
  },
  {
    name: "Products",
    icon: "wysiwyg",
    path: "/products/"
  },
  {
    name: "API Docs",
    icon: "book",
    path: "/docs/api"
  }
];
