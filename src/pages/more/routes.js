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
    path: "/reward-hub",
    component: () => import("./reward-hub-new"),
    meta: {
      title: "Reward Hub",
      isTab: 1,
      hideNav: 1,
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
    path: "/hosting/first-landing",
    redirect: "/first-landing",
  },
];
