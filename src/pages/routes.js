// import Home from "./home";
import Login from "./login";

import Overview from "./overview";

import HostingRoutes from "./hosting/routes";
import BucketRoutes from "./bucket/routes";
import UserRoutes from "./user/routes";
import MoreRoutes from "./more/routes";
import UsageRoutes from "./usage/routes";

export default [
  {
    path: "/",
    // component: Home,
    component: () => import("./home"),
  },
  {
    path: "/login",
    component: Login,
    meta: {
      noLogin: true,
    },
  },
  {
    path: "/overview",
    // component: Overview,
    component: () => import("./overview"),
    meta: {
      title: "Overview",
      isTab: true,
      subTitle: "Welcome back to 4EVERLAND dashboard",
    },
  },
  ...HostingRoutes,
  ...BucketRoutes,
  ...UserRoutes,
  ...MoreRoutes,
  ...UsageRoutes,
];
