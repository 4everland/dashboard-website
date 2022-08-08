import Changelog from "./changelog";
import FirstLanding from "./first-landing";

export default [
  {
    path: "/changelog",
    components: {
      cache: Changelog,
    },
    meta: {
      title: "Changelog",
    },
  },
  {
    path: "/hosting/first-landing",
    components: {
      cache: FirstLanding,
    },
    meta: {
      title: "First Landing",
      hideNav: 1,
      isTab: 1,
    },
  },
];
