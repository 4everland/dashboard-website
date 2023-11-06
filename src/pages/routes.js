// import Home from "./home";
// import Login from "./login.vue";
// import Overview from "./overview";

import HostingRoutes from "./hosting/routes";
import BucketRoutes from "./bucket/routes";
import UserRoutes from "./user/routes";
import MoreRoutes from "./more/routes";
import ResRoutes from "./resource/routes";
import GatewayRoutes from "./gateway/routes";
import AccountRoutes from "./account/routes";
import BillingRoutes from "./billing/routes";

export default [
  {
    path: "/",
    component: () => import("./home"),
  },
  {
    path: "/login",
    component: () => import("./login"),

    meta: {
      noLogin: true,
    },
  },
  {
    path: "/overview",
    component: () => import("./overview"),
    meta: {
      title: "Overview",
      isTab: true,
      hideNav: 1,
      subTitle: "Welcome to 4EVERLAND Dashboard",
    },
  },
  {
    path: "/overview1",
    component: () => import("./overview1"),
    meta: {
      title: "Overview",
      isTab: true,
      hideNav: 1,
      subTitle: "Welcome to 4EVERLAND Dashboard",
    },
  },
  ...BillingRoutes,
  ...HostingRoutes,
  ...BucketRoutes,
  ...UserRoutes,
  ...MoreRoutes,
  ...ResRoutes,
  ...GatewayRoutes,
  ...AccountRoutes,
  // {
  //   path: "/changefee",
  //   component: () => import("./changeFee"),
  // },
];
