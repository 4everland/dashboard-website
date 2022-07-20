import Settings from "./settings";
import Collections from "./collections";
import Referral from "./referral";
import BugBounty from "./bug-bounty";

export default [
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
