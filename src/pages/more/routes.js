// import Changelog from "./changelog";
// import FirstLanding from "./first-landing";

export default [
  {
    path: "/changelog",
    components: {
      cache: () => import("./changelog"),
    },
    meta: {
      title: "Changelog",
    },
  },
  {
    path: "/task-hub",
    component: () => import("./task-hub-new"),
    meta: {
      title: "Task Hub",
      isTab: true,
      hideNav: true,
      noLogin: false,
      newLayout: true,
    },
  },
  {
    path: "/first-landing",
    component: () => import("./first-landing"),
    meta: {
      title: "First Landing",
      hideNav: 1,
      isTab: 1,
      noLogin: 1,
    },
  },
  {
    path: "/airdrop",
    component: () => import("./airdrop"),
    meta: {
      title: "AIRDROP",
      hideNav: 1,
      isTab: 1,
      noLogin: 1,
    },
  },
  {
    path: "/airdrop/bnb",
    component: () => import("./bnb-airdrop"),
    meta: {
      title: "BNB AIRDROP",
      hideNav: 1,
      isTab: 1,
      noLogin: 1,
    },
  },
  {
    path: "/hosting/first-landing",
    redirect: "/first-landing",
  },
];
