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
      title: "Subscribe",
      group: "Billing",
      links: [
        {
          text: "Usage",
          to: "/billing/usage",
        },
        {
          text: `Subscribe`,
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
      title: "Details",
      group: "Billing",
      links: [
        {
          text: "Bills",
          to: "/billing/bills",
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
