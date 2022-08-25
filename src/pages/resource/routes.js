import Overview from "./overview";
import Purchase from "./act-subscribe";
import Withdraw from "./act-withdraw";
import Deposit from "./act-deposit";
import Bills from "./bills";
import BillDetail from "./bill-detail";
import BillDetail2 from "./bill-detail2";
import PriceDocs from "./pricing";
import Order from "./order";
import AllocRes from "./alloc-res";
import AllocBalance from "./alloc-balance";

export default [
  {
    path: "/resource",
    component: Overview,
    meta: {
      title: "Resource",
      isTab: 1,
    },
  },
  {
    path: "/resource/pricing",
    component: PriceDocs,
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
    component: BillDetail2,
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
    component: BillDetail,
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
    component: Bills,
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
    component: Deposit,
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
    component: Withdraw,
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
    component: AllocRes,
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
    component: AllocBalance,
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
    component: Purchase,
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
    component: Order,
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
