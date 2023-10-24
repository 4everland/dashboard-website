export default [
  {
    path: "/billing",
    component: () => import("./overview"),
    meta: {
      title: "Billing",
      isTab: 1,
    },
  },
];
