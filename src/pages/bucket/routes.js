import Store from "./store";
import Buckets from "./buckets";
import ARHistory from "./ar-history";
import Domains from "./domains";
import Domain from "./domain";

export default [
  {
    path: "/storage/*",
    component: Buckets,
    meta: {
      title: "Storage",
      isTab: 1,
    },
  },
  {
    path: "/arweave",
    component: ARHistory,
    meta: {
      title: "AR History",
      isTab: 1,
    },
  },
  {
    path: "/arweave/*",
    component: Store,
    meta: {
      title: "File - AR History",
    },
  },
  {
    path: "/domains",
    component: Domains,
    meta: {
      title: "Domains",
    },
  },
  {
    path: "/domain/:name",
    component: Domain,
    meta: {
      title: "{name}",
      links: [
        {
          text: "Domains",
          to: "/bucket/domains",
        },
        {
          text: "{name}",
        },
      ],
    },
  },
].map((it) => {
  it.path = "/bucket" + it.path;
  it.meta.group = "Bucket";
  return it;
});
