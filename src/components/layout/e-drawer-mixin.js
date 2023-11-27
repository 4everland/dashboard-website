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
    img: "m-bucket",
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
    img: "m-gateway",
    // suffixImg: "/img/svg/hosting/h-beta-active.svg",
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
    img: "m-rpc",
    to: "/rpc",
    active: false,
    suffixImg: "/img/svg/hosting/h-beta-active.svg",
    group: /^\/rpc/i,
  },
  RESOURCE: {
    label: "Billing",
    img: "m-usage",
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
      img: "m-team",
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
          img: "m-overview",
          to: "/overview",
          active: false,
        },
      ];
      const nameArr = [
        "HOSTING",
        "BUCKET",
        "GATEWAY",
        "RPC",
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
