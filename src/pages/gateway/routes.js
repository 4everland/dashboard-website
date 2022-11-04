export default [
  {
    path: "/gateway/list",
    component: () => import("./gateways"),
    meta: {
      title: "Dedicated Gateway",
      // icon: "/img/svg/hosting/h-beta-active.svg",
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
  {
    path: "/gateway/auth-token",
    component: () => import("./authToken"),
    meta: {
      title: "Auth Token",
      isTab: 1,
      subTitle: "Use the API key for gateway API",
    },
  },
];
