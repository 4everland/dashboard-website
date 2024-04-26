import { BigNumber } from "ethers";
import Vue from "vue";

export default {
  state: () => {
    return {
      resources: [],
      ipfsUnitPrice: BigNumber.from("0"), // not format balance (server data 1e18)
      arUnitPrice: BigNumber.from("0"), // not format balance (server data 1e18)
      bandwidthUnitPrice: BigNumber.from("0"), // not format balance (server data 1e18)
      buildMinUnitPrice: BigNumber.from("0"), // not format balance (server data 1e18)
      rpcUnitPrice: BigNumber.from("0"), // not format balance (server data 1e18)
      aiRpcUnitPrice: BigNumber.from("0"), // not format balance (server data 1e18)
      originBalance: BigNumber.from("0"), // not format balance (server data 1e18)
      firstRecharge: true,
    };
  },
  getters: {
    balance(state) {
      return Vue.prototype.$utils.formatLand(state.originBalance, true);
    },
    landToResource(state, getters) {
      if (state.ipfsUnitPrice.eq(BigNumber.from("0"))) return {};
      const balance = BigNumber.from(state.originBalance);
      const IPFS_STORAGE = balance.div(state.ipfsUnitPrice.mul(86400 * 30));
      const TRAFFIC = balance.div(state.bandwidthUnitPrice);
      const BUILD_TIME = balance.div(state.buildMinUnitPrice);
      const AR_STORAGE = balance.div(state.arUnitPrice);
      const COMPUTE_UNIT = balance.div(state.rpcUnitPrice);
      const AI_RPC = balance.div(state.aiRpcUnitPrice);
      return {
        IPFS_STORAGE: {
          value: IPFS_STORAGE,
          transformVal: Vue.prototype.$utils.getBigFileSize(IPFS_STORAGE),
        },
        TRAFFIC: {
          value: TRAFFIC,
          transformVal: Vue.prototype.$utils.getBigFileSize(TRAFFIC),
        },
        BUILD_TIME: {
          value: BUILD_TIME,
          transformVal: Vue.prototype.$utils.getResourceTypeSize(
            BUILD_TIME,
            false,
            "BUILD_TIME"
          ),
        },
        AR_STORAGE: {
          value: AR_STORAGE,
          transformVal: Vue.prototype.$utils.getBigFileSize(AR_STORAGE),
        },
        COMPUTE_UNIT: {
          value: COMPUTE_UNIT,
          transformVal: Vue.prototype.$utils.getResourceTypeSize(
            COMPUTE_UNIT,
            false,
            "COMPUTE_UNIT"
          ),
        },
        AI_RPC: {
          value: balance,
          transformVal:
            getters.balance.land + " " + getters.balance.unit + " LAND",
        },
      };
    },
  },
  mutations: {
    SET_RESOURCE(state, { name, unitPrice }) {
      state[name] = unitPrice;
    },
    SET_BALANCE(state, balance) {
      state.originBalance = balance;
    },
    SET_FIRST_RECHARGE(state, firstRecharge) {
      state.firstRecharge = firstRecharge;
    },
  },
  actions: {
    async getPrice({ commit }) {
      try {
        const { data } = await Vue.prototype.$http.get(
          "$bill-consume/common/price"
        );
        data.items.map((item) => {
          const unitPrice = BigNumber.from(item.data);
          switch (item.resourceType) {
            case "BUILD_TIME":
              commit("SET_RESOURCE", {
                name: "buildMinUnitPrice",
                unitPrice,
              });
              break;
            case "AR_STORAGE":
              commit("SET_RESOURCE", { name: "arUnitPrice", unitPrice });
              break;
            case "IPFS_STORAGE":
              commit("SET_RESOURCE", { name: "ipfsUnitPrice", unitPrice });
              break;
            case "TRAFFIC":
              commit("SET_RESOURCE", {
                name: "bandwidthUnitPrice",
                unitPrice,
              });
              break;
            case "COMPUTE_UNIT":
              commit("SET_RESOURCE", {
                name: "rpcUnitPrice",
                unitPrice,
              });
              break;
            case "AI_RPC":
              commit("SET_RESOURCE", {
                name: "aiRpcUnitPrice",
                unitPrice,
              });
              break;
            default:
              break;
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getBalance({ commit }) {
      try {
        const { data } = await Vue.prototype.$http.get("$bill-consume/assets");
        commit("SET_BALANCE", data.land);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
