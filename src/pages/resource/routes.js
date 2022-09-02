// // import Overview from "./overview";
// import Purchase from "./act-subscribe";
// // import Withdraw from "./act-withdraw";
// // import Deposit from "./act-deposit";
// // import Bills from "./bills";
// // import BillDetail from "./bill-detail";
// // import BillDetail2 from "./bill-detail2";
// // import PriceDocs from "./pricing";
// import Order from "./order";
// // import AllocRes from "./alloc-res";
// // import AllocBalance from "./alloc-balance";

export default [
  {
    path: "/resource",
    component: () => import("./overview"),
    meta: {
      title: "Resource",
      isTab: 1,
    },
  },
  {
    path: "/resource/pricing",
    component: () => import("./pricing"),

    meta: {
      title: "Pricing",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: "Purchase",
          to: "/resource/subscribe",
        },
        {
          text: `Pricing`,
        },
      ],
    },
  },
  {
    path: "/resource/bill-detail-cross",
    component: () => import("./bill-detail2"),

    meta: {
      title: "Expenditure Details",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: "Transaction History",
          to: "/resource/bills",
        },
        {
          text: `Expenditure Details`,
        },
      ],
    },
  },
  {
    path: "/resource/bill-detail",
    component: () => import("./bill-detail"),

    meta: {
      title: "Expenditure Details",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: "Transaction History",
          to: "/resource/bills",
        },
        {
          text: `Expenditure Details`,
        },
      ],
    },
  },
  {
    path: "/resource/bills",
    component: () => import("./bills"),
    meta: {
      title: "Transaction History",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: `Transaction History`,
        },
      ],
    },
  },
  {
    path: "/resource/deposit",
    component: () => import("./act-deposit"),

    meta: {
      title: "Deposit",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: `Deposit`,
        },
      ],
    },
  },
  {
    path: "/resource/withdraw",
    component: () => import("./act-withdraw"),
    meta: {
      title: "Withdraw",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: `Withdraw`,
        },
      ],
    },
  },
  {
    path: "/resource/allocation",
    component: () => import("./alloc-res"),

    meta: {
      title: "Resource Allocation",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: `Resource Allocation`,
        },
      ],
    },
  },
  {
    path: "/resource/balance-alloc",
    component: () => import("./alloc-balance"),

    meta: {
      title: "Balance Allocation",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: `Balance Allocation`,
        },
      ],
    },
  },
  {
    path: "/resource/subscribe",
    component: () => import("./act-subscribe"),

    meta: {
      title: "Purchase",
      isTab: 1,
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: `Purchase`,
        },
      ],
    },
  },
  {
    path: "/resource/subscribe/order",
    component: () => import("./order"),

    meta: {
      title: "Purchase",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: `Purchase`,
          to: "/resource/subscribe",
        },
        {
          text: "Order",
        },
      ],
    },
  },
];
