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
          title: "Booster",
          hideNav: 1,
          isTab: 1,
          noLogin: 1,
        },
      },
      {
        path: "/boost/quest",
        component: () => import("./eliteQuest"),
        meta: {
          title: "Elite Quest",
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
    ],
  },
];
