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
    path: "/rpc/detail/:name/:id",
    component: () => import("./detail.vue"),
    meta: {
      title: "RPC Detail",
      links: [{ text: "RPC", to: "/rpc" }, { text: "{name}" }],
    },
  },
  {
    path: "/rpc/settings/:name/:id",
    component: () => import("./settings.vue"),
    meta: {
      title: "RPC Settings",
      links: [
        { text: "RPC", to: "/rpc" },
        { text: "{name}", to: "/rpc/detail/{name}/{id}" },
        { text: "RPC Settings" },
      ],
    },
  },
];
