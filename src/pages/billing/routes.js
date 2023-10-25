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
      title: "Land",
      isTab: 1,
      links: [
        {
          text: "Billing",
          to: "/billing",
        },
        {
          text: "Land",
        },
      ],
    },
  },
].map((it) => {
  it.path = "/billing" + it.path;
  it.meta.group = "Billing";
  return it;
});
