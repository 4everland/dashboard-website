// import buckets from "./buckets";
// import arHistory from "./ar-history";
// import domains from "./domains";
// import domain from "./domain";

export default [
  {
    path: "/storage/*",
    // component: buckets,
    component: () => import("./buckets"),
    meta: {
      title: "Storage",
      isTab: 1,
    },
  },
  {
    path: "/arweave",
    // component: arHistory,
    component: () => import("./ar-history"),
    meta: {
      title: "AR History",
      isTab: 1,
    },
  },
  {
    path: "/arweave/*",
    // component: buckets,
    component: () => import("./buckets"),
    meta: {
      title: "File - AR History",
      isTab: 1,
    },
  },
  {
    path: "/domains",
    // component: domains,
    component: () => import("./domains"),
    meta: {
      title: "Domains",
      isTab: 1,
    },
  },
  {
    path: "/access-keys",
    component: () => import("./accessKeys"),
    meta: {
      title: "Access Keys",
      isTab: 1,
      subTitle: "Use the API key for Storage SDK",
    },
  },
  {
    path: "/pinning-service",
    // component: () => import("./pinning-service"),
    components: {
      cache: () => import("./pinning-service"),
    },
    meta: {
      title: "4EVER Pin",
      // isTab: 1,
    },
  },
].map((it) => {
  it.path = "/bucket" + it.path;
  it.meta.group = "Bucket";
  return it;
});
