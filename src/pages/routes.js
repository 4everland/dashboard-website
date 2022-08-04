import Home from "./home";
import Login from "./login.vue";

import Overview from "./overview";

import HostingRoutes from "./hosting/routes";
import BucketRoutes from "./bucket/routes";
import UserRoutes from "./user/routes";
import MoreRoutes from "./more/routes";
import UsageRoutes from "./usage/routes";

export default [
  {
    path: "/",
    component: Home,
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
    component: Overview,
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
