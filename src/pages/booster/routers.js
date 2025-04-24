import layout from "./layout";
export default [
  {
    path: "/boost",
    component: layout,
    children: [
      {
        path: "/boost",
        component: () => import("./overview"),
        meta: {
          title: "4EVER Boost",
          hideNav: 1,
          isTab: 1,
          noLogin: 1,
        },
      },
      {
        path: "/boost/leaderboard",
        component: () => import("./leaderboard"),
        meta: {
          title: "Leaderboard",
          hideNav: 1,
          isTab: 1,
          noLogin: 1,
        },
      },
      {
        name: "booster-explore",
        path: "/boost/explore/:id?",
        component: () => import("./explore"),
        meta: {
          title: "Explore",
          hideNav: 1,
          isTab: 1,
          noLogin: 1,
        },
      },
      {
        path: "/boost/spin",
        component: () => import("./spin"),
        meta: {
          title: "Withdraw",
          hideNav: 1,
          isTab: 1,
          noLogin: 1,
          hideBoostNav: 1
        },
      },
      {
        path: "/boost/partner",
        component: () => import("./pointspool"),
        meta: {
          title: "Mining",
          hideNav: 1,
          isTab: 1,
          noLogin: 1,
          hideBoostNav: 1
        },
      },
    ],
  },
];
