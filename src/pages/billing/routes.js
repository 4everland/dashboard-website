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
  {
    path: "/bill-detail-cross",
    component: () => import("../resource/bill-detail2"),

    meta: {
      title: "Expenditure Details",
      links: [
        {
          text: "Billing",
          to: "/billing",
        },
        {
          text: "Transaction History",
          to: "/billing/bills",
        },
        {
          text: `Expenditure Details`,
        },
      ],
    },
  },
  {
    path: "/bill-detail",
    component: () => import("../resource/bill-detail"),

    meta: {
      title: "Expenditure Details",
      links: [
        {
          text: "Billing",
          to: "/billing",
        },
        {
          text: "Transaction History",
          to: "/billing/bills",
        },
        {
          text: `Expenditure Details`,
        },
      ],
    },
  },

  {
    path: "/airdrop-detail",
    component: () => import("../resource/airdrop-detail"),
    meta: {
      title: "Expenditure Details",
      links: [
        {
          text: "Billing",
          to: "/billing",
        },
        {
          text: "Transaction History",
          to: "/billing/bills",
        },
        {
          text: `Expenditure Details`,
        },
      ],
    },
  },
  {
    path: "/bills",
    component: () => import("../resource/bills"),
    meta: {
      title: "Transaction History",
      links: [
        {
          text: "Billing",
          to: "/billing",
        },
        {
          text: `Transaction History`,
        },
      ],
    },
  },
].map((it) => {
  it.path = "/billing" + it.path;
  it.meta.group = "Billing";
  return it;
});
