// import Settings from "./settings";
// import Collections from "./collections";
// import Referral from "./referral";
// import BugBounty from "./bug-bounty";
// import ActLog from "./activity-log";

export default [
  {
    path: "/activity-log",
    components: {
      cache: () => import("./activity-log"),
    },
    meta: {
      title: "Activity Log",
    },
  },
  {
    path: "/settings",
    component: () => import("./settings"),

    meta: {
      title: "Settings",
      isTab: 1,
    },
  },
  {
    path: "/referral",
    component: () => import("./referral"),

    meta: {
      title: "My Referral",
      hideNav: 1,
      isTab: 1,
    },
  },
  {
    path: "/collections",
    components: {
      cache: () => import("./collections"),
    },
    meta: {
      title: "My Collection",
    },
  },
  {
    path: "/bug-bounty",
    components: {
      cache: () => import("./bug-bounty"),
    },
    meta: {
      title: "Bug Bounty",
    },
  },
];
