export default [
  {
    path: "/rpc",
    component: () => import("./index"),
    meta: {
      title: "RPC",
      isTab: 1,
    },
  },
  {
    path: "/rpc/detail/:id",
    component: () => import("./detail.vue"),
    meta: {
      title: "RPC Detail",
      links: [{ text: "RPC", to: "/rpc" }],
    },
  },
  {
    path: "/rpc/settings/:id",
    component: () => import("./settings.vue"),
    meta: {
      title: "RPC Settings",
      links: [{ text: "RPC", to: "/rpc" }, { text: "RPC Settings" }],
    },
  },
];
