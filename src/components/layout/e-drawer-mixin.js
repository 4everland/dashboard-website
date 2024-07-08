import { mapState, mapGetters } from "vuex";

const menuMap = {
  HOSTING: {
    label: "Hosting",
    icon: "$drawer/hostingIcon",
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
      // {
      //   label: "Statistics",
      //   to: "/hosting/statistics",
      // },
      {
        label: "Auth Token",
        to: "/hosting/auth-tokens",
      },
    ],
  },
  BUCKET: {
    label: "Storage",
    icon: "$drawer/storageIcon",
    active: false,
    group: /^\/bucket/i,
    subs: [
      {
        label: "Bucket(s3)",
        active: false,
        group:
          /^(\/bucket\/storage)|(\/bucket\/domain(s?))|(\/bucket\/access-keys)/i,
        subs: [
          {
            label: "Buckets",
            to: "/bucket/storage/",
          },
          {
            label: "Domains",
            to: "/bucket/domains/",
            matPath: /bucket\/domain/,
          },
          {
            label: "Access Keys",
            to: "/bucket/access-keys",
          },
        ],
      },
      {
        label: "AR History",
        to: "/bucket/arweave",
      },
      {
        label: "4EVER Pin",
        to: "/bucket/pinning-service",
      },
    ],
  },
  GATEWAY: {
    label: "Gateway",
    icon: "$drawer/gatewayIcon",
    // suffixImg: "/img/svg/hosting/tag_beta.png",
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
  RPC: {
    label: "RPC",
    icon: "$drawer/rpcIcon",
    to: "/rpc",
    active: false,
    group: /^\/rpc/i,
  },
  RAAS: {
    label: "RaaS",
    icon: "$drawer/raasIcon",
    to: "/raas",
    active: false,
    suffixImg: "/img/svg/hosting/tag_fire.png",
    group: /^\/raas/i,
  },
  AIRPC: {
    label: "AI",
    icon: "$drawer/aiIcon",
    group: /^\/ai-rpc/i,
    suffixImg: "/img/svg/hosting/tag_fire.png",
    subs: [
      {
        label: "AI RPC",
        to: "/ai-rpc?tab=Models",
      },
      {
        label: "Chat",
        href:
          process.env.NODE_ENV == "development"
            ? "https://ai-dev.4everland.app"
            : "https://chat.4everland.org",
      },
    ],
  },
  RESOURCE: {
    label: "Billing",
    icon: "$drawer/billingIcon",
    to: "/billing",
    active: false,
    group: /^\/billing/i,
  },
  MEMBER(target) {
    const subs = [
      {
        label: "Configurations",
        to: "/account/config",
      },
    ];
    if (target == "all") {
      subs.unshift({
        label: "Operation Log",
        to: "/account/operation-log",
      });
    }
    if (target != "only") {
      subs.unshift({
        label: "Members",
        to: "/account/member",
      });
    }

    return {
      label: "Account",
      icon: "$drawer/accountIcon",
      group: /^\/account/i,
      subs,
    };
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
      const { type, status } = this.teamInfo;
      const list = [
        {
          label: "Overview",
          icon: "$drawer/overviewIcon",
          to: "/overview",
          active: false,
        },
      ];
      const nameArr = [
        "HOSTING",
        "BUCKET",
        "GATEWAY",
        "RPC",
        "RAAS",
        "AIRPC",
        "RESOURCE",
        "MEMBER",
      ];
      for (const name of nameArr) {
        let item = menuMap[name];
        if (this.inAccess(name)) {
          let target = "all";
          if (name == "MEMBER") {
            if (type == "COLLABORATION") target = "invite";
            item = item(target);
          }
          // item = { ...item };
          // if (status == "DISABLED") {
          //   (item.subs || []).forEach((it) => {
          //     it.to = it;
          //   });
          // }
          list.push(item);
        } else if (name == "MEMBER") {
          list.push(item("only"));
        }
      }
      return list;
    },
  },
  methods: {
    inAccess(name) {
      const { access, isOwner } = this.teamInfo;
      if (isOwner) return true;
      // if (name == "BUCKET") return false;
      return (access || []).includes(name);
    },
  },
};
