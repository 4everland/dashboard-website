export default [
  {
    path: "/rass",
    component: () => import("./index"),
    meta: {
      title: "Rass",
      isTab: 1,
    },
  },
  {
    path: "/rass/create",
    component: () => import("./create.vue"),
    meta: {
      title: "Rass Create",
      isTab: 1,
      links: [{ text: "Rass", to: "/rass" }, { text: "Create Rollup" }],
    },
  },
];
