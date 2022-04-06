import New from "./new";
import Projects from "./projects";
import Project from "./project";
import Build from "./build";
import Domains from "./domains";
import Statistics from "./statistics";
import StatisDetail from "./statistics-detail";

export default [
  {
    path: "/new",
    component: New,
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
    path: "/projects",
    component: Projects,
    meta: {
      title: "Projects",
      isTab: 1,
    },
  },
  {
    path: "/project/:projName/:id",
    component: Project,
    meta: {
      isTab: 1,
      title: `{projName}`,
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
    component: Build,
    meta: {
      isTab: 1,
      title: `{projName} - Build`,
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
    component: Domains,
    meta: {
      title: "Domains",
      subTitle: "Manage the domains you can use within 4everland",
    },
  },
  {
    path: "/statistics",
    component: Statistics,
    meta: {
      title: "Statistics",
    },
  },
  {
    path: "/statistics/:projName/:id",
    component: StatisDetail,
    meta: {
      title: "{projName} - Statistic",
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
