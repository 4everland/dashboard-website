import Overview from "./overview";
import Subscribe from "./act-subscribe";
import Withdraw from "./act-withdraw";
import Deposit from "./act-deposit";
import Bills from "./bills";
import BillDetail from "./bill-detail";
import PriceDocs from "./price-docs";
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
    path: "/resource/price-docs",
    component: PriceDocs,
    meta: {
      title: "Price Docs",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: "Subscribe",
          to: "/resource/subscribe",
        },
        {
          text: `Price Docs`,
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
    components: {
      cache: Subscribe,
    },
    meta: {
      title: "Subscribe",
      isTab: 1,
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: `Subscribe`,
        },
      ],
    },
  },
  {
    path: "/resource/subscribe/order",
    component: Order,
    meta: {
      title: "Subscribe",
      links: [
        {
          text: "Resource",
          to: "/resource",
        },
        {
          text: `Subscribe`,
          to: "/resource/subscribe",
        },
        {
          text: "Order",
        },
      ],
    },
  },
];
