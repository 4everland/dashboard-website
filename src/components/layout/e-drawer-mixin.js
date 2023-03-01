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
          /^(\/bucket\/storage)|(\/bucket\/arweave)|(\/bucket\/domains)|(\/bucket\/access-keys)/i,
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
  RESOURCE: {
    label: "Resource",
    img: "m-usage",
    to: "/resource",
    active: false,
    group: /^\/resource/i,
  },
  MEMBER(target) {
    const subs = [
      {
        label: "Configurations",
        to: "/account/config",
      },
    ];
    if (target != "only") {
      subs.unshift({
        label: "Members",
        to: "/account/member",
      });
    }
    if (target == "all") {
      subs.push({
        label: "Operation Log",
        to: "/account/operation-log",
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
      const nameArr = ["HOSTING", "BUCKET", "GATEWAY", "RESOURCE", "MEMBER"];
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
