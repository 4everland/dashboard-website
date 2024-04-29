export default [
  {
    path: "",
    component: () => import("./overview"),
    meta: {
      title: "AI RPC",
      isTab: 1,
    },
  },
  {
    path: "/key/:name/:id",
    component: () => import("./keyInfo.vue"),
    meta: {
      title: `{name}`,
      isTab: 1,
      links: [
        {
          text: "AI RPC",
          to: "/ai-rpc?tab=Keys",
        },
        {
          text: `{name}`,
        },
      ],
    },
  },
  {
    path: "/model/:id",
    component: () => import("./modelInfo.vue"),
    meta: {
      title: `{id}`,
      isTab: 1,
      links: [
        {
          text: "AI RPC",
          to: "/ai-rpc?tab=Models",
        },
        {
          text: `{id}`,
        },
      ],
    },
  },
].map((it) => {
  it.path = "/ai-rpc" + it.path;
  it.meta.group = "AI RPC";
  return it;
});
