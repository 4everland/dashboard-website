import Settings from "./settings";
import Collections from "./collections";
import Referral from "./referral";
import BugBounty from "./bug-bounty";
import ActLog from "./activity-log";

export default [
  {
    path: "/activity-log",
    components: {
      cache: ActLog,
    },
    meta: {
      title: "Activity Log",
    },
  },
  {
    path: "/settings",
    component: Settings,
    meta: {
      title: "Settings",
      isTab: 1,
    },
  },
  {
    path: "/referral",
    component: Referral,
    meta: {
      title: "My Referral",
      hideNav: 1,
      isTab: 1,
    },
  },
  {
    path: "/collections",
    components: {
      cache: Collections,
    },
    meta: {
      title: "My Collection",
    },
  },
  {
    path: "/bug-bounty",
    components: {
      cache: BugBounty,
    },
    meta: {
      title: "Bug Bounty",
    },
  },
];
