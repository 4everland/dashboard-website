import Info from "./info";
import Billing from "./billing";
import More from "./more";
import Detail from "./detail";

export default [
  {
    path: "/usage/info",
    component: Info,
    meta: {
      title: "Usage",
    },
  },
  {
    path: "/usage/more",
    component: More,
    meta: {
      group: "Usage",
      links: [
        {
          text: "Info",
          to: "/usage/info",
        },
        {
          text: `Get more`,
        },
      ],
    },
  },
  {
    path: "/usage/billing",
    component: Billing,
    meta: {
      title: "Billing",
      group: "Usage",
      links: [
        {
          text: "Billing",
        },
      ],
    },
  },
  {
    path: "/usage/billing/detail",
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
];
