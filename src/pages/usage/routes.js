import Info from "./info";
import Billing from "./billing";
import More from "./more";

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
    },
  },
];
