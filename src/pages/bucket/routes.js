// import Store from "./store";
// import Buckets from "./buckets";
// import ARHistory from "./ar-history";
// import Domains from "./domains";
// import Domain from "./domain";

export default [
  {
    path: "/storage/*",
    // component: Buckets,
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
    // component: Store,
    component: () => import("./store"),

    meta: {
      title: "File - AR History",
      isTab: 1,
    },
  },
  {
    path: "/domains",
    // component: Domains,
    component: () => import("./domains"),

    meta: {
      title: "Domains",
      isTab: 1,
    },
  },
  {
    path: "/domain/:name",
    // component: Domain,
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
