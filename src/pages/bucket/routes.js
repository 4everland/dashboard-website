import buckets from "./buckets";
import arHistory from "./ar-history";
import store from "./store";
import domains from "./domains";
import domain from "./domain";

export default [
  {
    path: "/storage/*",
    component: buckets,
    meta: {
      title: "Storage",
      isTab: 1,
    },
  },
  {
    path: "/arweave",
    component: arHistory,
    meta: {
      title: "AR History",
      isTab: 1,
    },
  },
  {
    path: "/arweave/*",
    component: store,
    meta: {
      title: "File - AR History",
      isTab: 1,
    },
  },
  {
    path: "/domains",
    component: domains,
    meta: {
      title: "Domains",
      isTab: 1,
    },
  },
  {
    path: "/domain/:name",
    component: domain,
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
