export default [
  {
    path: "",
    component: () => import("./overview"),
    meta: {
      title: "Billing",
      isTab: 1,
    },
  },
  {
    path: "/records",
    component: () => import("./billing-record"),
    meta: {
      title: "LAND",
      isTab: 1,
      links: [
        {
          text: "Billing",
          to: "/billing",
        },
        {
          text: "LAND",
        },
      ],
    },
  },
  {
    path: "/deposit",
    component: () => import("./deposit"),
    meta: {
      title: "Deposit",
      isTab: 1,
      newLayout: true,
      links: [
        {
          text: "Billing",
          to: "/billing",
        },
        {
          text: "Deposit",
        },
      ],
    },
  },
].map((it) => {
  it.path = "/billing" + it.path;
  it.meta.group = "Billing";
  return it;
});
