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
];
