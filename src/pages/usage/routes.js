import Info from "./info";
import Bills from "./bills";
import More from "./more";
import Detail from "./detail";
import Deduction from "./deduction";

export default [
  {
    path: "/billing/usage",
    component: Info,
    meta: {
      group: "Billing",
      title: "Usage",
      isTab: 1,
    },
  },
  {
    path: "/billing/usage/more",
    component: More,
    meta: {
      group: "Billing",
      links: [
        {
          text: "Usage",
          to: "/billing/usage",
        },
        {
          text: `Buy more`,
        },
      ],
    },
  },
  {
    path: "/billing/bills",
    component: Bills,
    meta: {
      title: "Bills",
      group: "Billing",
    },
  },
  {
    path: "/billing/bills/detail",
    component: Detail,
    meta: {
      title: "Billing Details",
      group: "Billing",
      links: [
        {
          text: "Bills",
          to: "/billing/usage",
        },
        {
          text: `Details`,
        },
      ],
    },
  },
  {
    path: "/billing/deduction",
    component: Deduction,
    meta: {
      title: "Deduction details",
      group: "Billing",
      links: [
        {
          text: "Bills",
          to: "/billing/bills",
        },
        {
          text: `Deduction details`,
        },
      ],
    },
  },
];
