export default [
  {
    path: "/storage/*",
    component: () => import("./buckets"),
    meta: {
      title: "Storage",
      isTab: 1,
    },
  },
  {
    path: "/arweave",
    component: () => import("./ar-history"),
    meta: {
      title: "AR History",
      isTab: 1,
    },
  },
  {
    path: "/arweave/*",
    component: () => import("./store"),
    meta: {
      title: "File - AR History",
      isTab: 1,
    },
  },
  {
    path: "/domains",
    component: () => import("./domains"),
    meta: {
      title: "Domains",
      isTab: 1,
    },
  },
  {
    path: "/domain/:name",
    component: () => import("./domain"),
    meta: {
      title: "{name}",
      isTab: 1,
      links: [
        {
          text: "Domains",
          to: "/bucket/domains",
        },
        {
          text: "{name}",
        },
      ],
      isTab: 1,
    },
  },
].map((it) => {
  it.path = "/bucket" + it.path;
  it.meta.group = "Bucket";
  return it;
});
