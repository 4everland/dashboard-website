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
    component: () => import("./config"),
    meta: {
      title: "Account Configuration",
      isTab: 1,
    },
  },
];
