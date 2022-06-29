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
      title: "Usage",
      isTab: 1,
    },
  },
  {
    path: "/billing/usage/more",
    component: More,
    meta: {
      group: "Usage",
      links: [
        {
          text: "Info",
          to: "/usage/info",
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
      group: "Usage",
      links: [
        {
          text: "Bills",
        },
      ],
    },
  },
  {
    path: "/billing/bills/detail",
    component: Detail,
    meta: {
      title: "Billing Details",
      group: "Usage",
      links: [
        {
          text: "Billing",
          to: "/usage/billing",
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
      group: "Usage",
      links: [
        {
          text: "Billing",
          to: "/billing/bills",
        },
        {
          text: `Deduction details`,
        },
      ],
    },
  },
];
