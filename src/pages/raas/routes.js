export default [
  {
    path: "/raas",
    component: () => import("./index"),
    meta: {
      title: "Raas",
      isTab: 1,
    },
  },
  {
    path: "/raas/create",
    component: () => import("./create.vue"),
    meta: {
      title: "Raas Create",
      isTab: 1,
      links: [{ text: "Raas", to: "/raas" }, { text: "Create Rollup" }],
    },
  },
];
