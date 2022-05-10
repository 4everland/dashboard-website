import Storage from "./storage";
import ARHistory from "./ar-history";
import Domains from "./domains";
import Domain from "./domain";

export default [
  {
    path: "/storage",
    component: Storage,
    meta: {
      title: "Storage",
      isTab: 1,
    },
    children: [
      {
        path: "/bucket/*",
        component: () => import("../../components/bucket/bucket-item.vue"),
        meta: {
          title: "Bucket",
          isTab: 1,
        },
      },
    ],
  },
  {
    path: "/arweave",
    component: ARHistory,
    meta: {
      title: "AR History",
    },
  },
  {
    path: "/arweave/*",
    component: Storage,
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
