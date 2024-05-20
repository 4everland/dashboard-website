export default [
  {
    path: "/raas",
    component: () => import("./index"),
    meta: {
      title: "RaaS",
      isTab: 1,
    },
  },
  {
    path: "/raas/create",
    component: () => import("./create.vue"),
    meta: {
      title: "RaaS Create",
      isTab: 1,
      links: [{ text: "RaaS", to: "/raas" }, { text: "Create Rollup" }],
    },
  },
  {
    path: "/raas/status/:id",
    component: () => import("./status.vue"),
    meta: {
      title: "RaaS Status",
      isTab: 1,
      links: [{ text: "RaaS", to: "/raas" }, { text: "RaaS Status" }],
    },
  },
  {
    path: "/raas/:name/:id",
    component: () => import("./detail.vue"),
    meta: {
      title: "{name}",
      isTab: 1,
      links: [{ text: "RaaS", to: "/raas" }, { text: "{name}" }],
    },
  },
  {
    path: "/raas/progress/:name/:id",
    component: () => import("./progress.vue"),
  },
];
