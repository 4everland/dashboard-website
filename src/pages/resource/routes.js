import Overview from "./overview";
import Subscribe from "./subscribe";

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
    path: "/resource/subscribe",
    component: Subscribe,
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
];
