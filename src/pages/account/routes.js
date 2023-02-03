export default [
  {
    path: "/account/member",
    component: () => import("./member"),
    meta: {
      title: "Member Manager",
      isTab: 1,
    },
  },
  {
    path: "/account/config",
    components: {
      cache: () => import("./config"),
    },
    meta: {
      title: "Account Configuration",
      isTab: 1,
    },
  },
  {
    path: "/account/operation-log",
    component: () => import("./operation-log"),
    meta: {
      title: "Operation Log",
    },
  },
];
