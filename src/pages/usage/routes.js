import Info from "./info";
import Billing from "./billing";

export default [
  {
    path: "/usage/info",
    component: Info,
    meta: {
      title: "Usage",
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
