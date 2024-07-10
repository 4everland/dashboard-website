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
    ],
  },
];
