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
];
