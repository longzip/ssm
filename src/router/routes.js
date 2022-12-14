const routes = [
  {
    path: "/",
    component: () => import("layouts/Layout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/PageTodo.vue")
      },
      {
        path: "/ho-gia-dinh/:id",
        component: () => import("pages/PageHoGiaDinh.vue")
      },
      {
        path: "/settings",
        component: () => import("pages/PageSettings.vue")
      },
      { path: "/auth", component: () => import("pages/PageAuth.vue") }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
