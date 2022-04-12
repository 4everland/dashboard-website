import Changelog from "./changelog";
import FirstLanding from "./first-landing";

export default [
  {
    path: "/changelog",
    component: Changelog,
    meta: {
      title: "Change Log",
    },
  },
  {
    path: "/hosting/first-landing",
    component: FirstLanding,
    meta: {
      title: "First Landing",
      hideNav: 1,
      isTab: 1,
    },
  },
];
