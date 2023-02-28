export default [
  {
    path: "/account/member",
    component: () => import("./member"),
    meta: {
      title: "Members",
      isTab: 1,
    },
  },
  {
    path: "/account/config",
    components: {
      cache: () => import("./config"),
    },
    meta: {
      title: "Configurations",
      isTab: 1,
    },
  },
  {
    path: "/account/operation-log",
    component: () => import("./operation-log"),
    meta: {
      title: "Operation log",
    },
  },
];
