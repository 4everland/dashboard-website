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
    path: "/hosting/first-landing",
    components: {
      cache: () => import("./first-landing"),
    },
    meta: {
      title: "First Landing",
      hideNav: 1,
      isTab: 1,
    },
  },
];
