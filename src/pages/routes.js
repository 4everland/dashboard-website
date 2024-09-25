// import Home from "./home";
// import Login from "./login.vue";
// import Overview from "./overview";

import HostingRoutes from "./hosting/routes";
import BucketRoutes from "./bucket/routes";
import UserRoutes from "./user/routes";
import MoreRoutes from "./more/routes";
import GatewayRoutes from "./gateway/routes";
import AccountRoutes from "./account/routes";
import BillingRoutes from "./billing/routes";
import RpcRoutes from "./rpc/routes";
import RaasRoutes from "./raas/routes";
import AiRpcRoutes from "./aiRpc/routers";
import BoosterRouters from "./booster/routers";

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
    component: () => import("./overview/overview"),
    meta: {
      title: "Overview",
      isTab: true,
      hideNav: 1,
      subTitle: "Welcome to 4EVERLAND Dashboard",
    },
  },
  {
    path: "/quick-login",
    component: () => import("./fetchToken"),
  },
  ...BillingRoutes,
  ...HostingRoutes,
  ...BucketRoutes,
  ...UserRoutes,
  ...MoreRoutes,
  ...GatewayRoutes,
  ...AccountRoutes,
  ...RpcRoutes,
  ...RaasRoutes,
  ...AiRpcRoutes,
  ...BoosterRouters,
  // {
  //   path: "/changefee",
  //   component: () => import("./changeFee"),
  // },
];
