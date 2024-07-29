import layout from "./layout";
export default [
  {
    path: "/booster",
    component: layout,
    children: [
      {
        path: "/booster",
        component: () => import("./overview"),
        meta: {
          title: "Booster",
          hideNav: 1,
          isTab: 1,
          noLogin: 1,
        },
      },
      {
        path: "/booster/quest",
        component: () => import("./eliteQuest"),
        meta: {
          title: "Elite Quest",
          hideNav: 1,
          isTab: 1,
          noLogin: 1,
        },
      },
      {
        path: "/booster/leaderboard",
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
        path: "/booster/explore/:id?",
        component: () => import("./explore"),
        meta: {
          title: "Explore",
          hideNav: 1,
          isTab: 1,
          noLogin: 1,
        },
      },
    ],
  },
];
