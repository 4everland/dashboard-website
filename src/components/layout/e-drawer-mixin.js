import { mapState, mapGetters } from "vuex";

const menuMap = {
  HOSTING: {
    label: "Hosting",
    img: "m-hosting",
    group: /^\/hosting/i,
    subs: [
      {
        label: "Projects",
        to: "/hosting/projects",
        matPath: /hosting\/(new|project|build)/,
      },
      {
        label: "Domains",
        to: "/hosting/domains",
      },
      {
        label: "Statistics",
        to: "/hosting/statistics",
      },
      {
        label: "Auth Tokens",
        to: "/hosting/auth-tokens",
      },
    ],
  },
  BUCKET: {
    label: "Bucket",
    img: "m-bucket",
    active: false,
    group: /^\/bucket/i,
    subs: [
      {
        label: "Buckets",
        to: "/bucket/storage/",
      },
      {
        label: "AR History",
        to: "/bucket/arweave",
      },
      {
        label: "Domains",
        to: "/bucket/domains",
        matPath: /bucket\/domain/,
      },
      {
        label: "Access Keys",
        to: "/bucket/access-keys",
      },
    ],
  },
  GATEWAY: {
    label: "Gateway",
    img: "m-gateway",
    suffixImg: "/img/svg/hosting/h-beta-active.svg",
    group: /^\/gateway/i,
    subs: [
      {
        label: "Dedicated Gateway",
        to: "/gateway/list",
      },
      {
        label: "IPNS Manager",
        to: "/gateway/ipns",
      },
      {
        label: "Auth Token",
        to: "/gateway/auth-token",
      },
    ],
  },
  RESOURCE: {
    label: "Resource",
    img: "m-usage",
    to: "/resource",
    active: false,
    group: /^\/resource/i,
  },
  MEMBER: {
    label: "Collaboration",
    img: "m-team",
    group: /^\/account/i,
    subs: [
      {
        label: "Member Manager",
        to: "/account/member",
      },
      {
        label: "Account Configuration",
        to: "/account/config",
      },
      {
        label: "Operation Logs",
        to: "/account/operation-log",
      },
    ],
  },
};
export default {
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      userInfo: (s) => s.userInfo,
      token: (s) => s.token(),
    }),
    ...mapGetters(["teamInfo"]),
    list() {
      const list = [
        {
          label: "Overview",
          img: "m-overview",
          to: "/overview",
          active: false,
        },
      ];
      const nameArr = ["HOSTING", "BUCKET", "GATEWAY", "RESOURCE", "MEMBER"];
      for (const name of nameArr) {
        if (this.inAccess(name)) {
          list.push(menuMap[name]);
        }
      }
      return list;
    },
  },
  methods: {
    inAccess(name) {
      if (name == "BUCKET") return true;
      const { type, access } = this.teamInfo || {};
      if (type == "INDIVIDUAL") return true;
      return (access || []).includes(name);
    },
  },
};
