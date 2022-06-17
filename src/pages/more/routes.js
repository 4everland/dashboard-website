import Changelog from "./changelog";
import FirstLanding from "./first-landing";

export default [
  {
    path: "/changelog",
    // component: Changelog,
    component: () => import("./changelog"),

    meta: {
      title: "Change Log",
    },
  },
  {
    path: "/hosting/first-landing",
    component: () => import("./first-landing"),
    meta: {
      title: "First Landing",
      hideNav: 1,
      isTab: 1,
    },
  },
];
