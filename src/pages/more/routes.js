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
    path: "/first-landing",
    component: FirstLanding,
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
