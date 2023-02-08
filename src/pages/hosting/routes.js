// import New from "./new";
// import Projects from "./projects";
// import Project from "./project";
// import Build from "./build";
// import Domains from "./domains";
// import Statistics from "./statis-list";
// import StatisDetail from "./statistics-detail";

export default [
  {
    path: "/auth-tokens",
    component: () => import("./auth-tokens"),
    meta: {
      title: "Auth Tokens",
      isTab: 1,
      subTitle:
        "These tokens allow other apps to control your whole account. Be careful!",
    },
  },
  {
    path: "/new",
    // component: New,
    component: () => import("./new"),
    meta: {
      title: "New Project",
      subTitle: "3 easy steps to get your projects live",
      isTab: 1,
      links: [
        {
          text: "Projects",
          to: "/hosting/projects",
        },
        {
          text: "New Project",
        },
      ],
    },
  },
  {
    path: "/new-by-hash",
    component: () => import("./new-by-hash"),
    meta: {
      title: "New Project",
      isTab: 1,
      links: [
        {
          text: "Projects",
          to: "/hosting/projects",
        },
        {
          text: "New Project",
        },
      ],
    },
  },
  {
    path: "/projects",
    components: {
      cache: () => import("./projects"),
    },
    meta: {
      title: "Projects",
      isTab: 1,
    },
  },
  {
    path: "/project/:projName/:id",
    // component: Project,
    component: () => import("./project"),

    meta: {
      title: `{projName}`,
      isTab: 1,
      links: [
        {
          text: "Projects",
          to: "/hosting/projects",
        },
        {
          text: `{projName}`,
        },
      ],
    },
  },
  {
    path: "/build/:projName/:id/:taskId",
    // component: Build,
    component: () => import("./build"),

    meta: {
      title: `{projName} - Build`,
      isTab: 1,
      links: [
        {
          text: "Projects",
          to: "/hosting/projects",
        },
        {
          text: `{projName}`,
          to: "/hosting/project/{projName}/{id}",
        },
        {
          text: "Build",
        },
      ],
    },
  },
  {
    path: "/domains",
    // component: Domains,
    component: () => import("./domains"),

    meta: {
      title: "Domains",
      isTab: 1,
    },
  },
  {
    path: "/statistics",
    // component: Statistics,
    component: () => import("./statis-list"),

    meta: {
      title: "Statistics",
    },
  },
  {
    path: "/statistics/:projName/:id",
    // component: StatisDetail,
    component: () => import("./statistics-detail"),

    meta: {
      title: "{projName} - Statistic",
      isTab: 1,
      links: [
        {
          text: "Statistics",
          to: "/hosting/statistics",
        },
        {
          text: "{projName}",
        },
      ],
    },
  },
].map((it) => {
  it.path = "/hosting" + it.path;
  it.meta.group = "Hosting";
  return it;
});
