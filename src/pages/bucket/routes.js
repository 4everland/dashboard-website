import Storage from "./storage";
import ARHistory from "./ar-history";
import Domains from "./domains";
import Domain from "./domain";

export default [
  {
    path: "/storage/*",
    component: Storage,
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
    component: Storage,
    meta: {
      title: "File - AR History",
      isTab: 1,
    },
  },
  {
    path: "/domains",
    component: Domains,
    meta: {
      title: "Domains",
      isTab: 1,
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
      isTab: 1,
    },
  },
].map((it) => {
  it.path = "/bucket" + it.path;
  it.meta.group = "Bucket";
  return it;
});
