export default [
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
