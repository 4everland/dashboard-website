export default [
  {
    path: "/gateway/list",
    component: () => import("./gateways"),
    meta: {
      title: "Gateways",
      // hideNav: 1,
      isTab: 1,
    },
  },
  {
    path: "/gateway/ipns",
    component: () => import("./ipns"),
    meta: {
      title: "IPNS Manager",
    },
  },
];
