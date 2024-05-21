export default [
  {
    path: "/gateway/list",
    component: () => import("./gateways"),
    meta: {
      title: "Dedicated Gateway",
      // icon: "/img/svg/hosting/tag_beta.png",
      // hideNav: 1,
      isTab: 1,
    },
  },
  {
    path: "/gateway/list/:name",
    component: () => import("@/views/gateway/gateway-detail"),
    meta: {
      title: "Gateway Detail",
      links: [
        { text: "Dedicated Gateway", to: "/gateway/list" },
        { text: "{name}.4everland.link" },
      ],
    },
  },
  {
    path: "/gateway/ipns",
    component: () => import("./ipns"),
    meta: {
      title: "IPNS Manager",
      // isTab: 1,
    },
  },
  {
    path: "/gateway/auth-token",
    component: () => import("./authToken"),
    meta: {
      title: "Auth Token",
      isTab: 1,
      subTitle: "Use the API key for IPNS API",
    },
  },
];
