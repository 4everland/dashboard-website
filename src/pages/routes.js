import Home from "./home";
import Login from "./login";

import Overview from "./overview";
import Plan from "./plan";

import HostingRoutes from "./hosting/routes";
import BucketRoutes from "./bucket/routes";
import UserRoutes from "./user/routes";

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
    },
  },
  ...HostingRoutes,
  ...BucketRoutes,
  ...UserRoutes,

  {
    path: "/plan",
    component: Plan,
    meta: {
      title: "Plan",
      subTitle: "Manage the domains you can use within 4everland",
      wrapCls: "main-wrap pa-0",
    },
  },
];
