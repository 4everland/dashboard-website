import { BigNumber } from "ethers";
import Vue from "vue";

export default {
  state: () => {
    return {
      resources: [],
      ipfsUnitPrice: BigNumber.from("0"),
      arUnitPrice: BigNumber.from("0"),
      bandwidthUnitPrice: BigNumber.from("0"),
      buildMinUnitPrice: BigNumber.from("0"),
      IPFS_STORAGE: 1,
    };
  },
  getters: {},
  mutations: {
    SET_RESOURCES(state, resources) {
      state.resources = resources;
    },
    SET_RESOURCE(state, { name, unitPrice }) {
      state[name] = unitPrice;
    },
  },
  actions: {
    async getPrice({ commit }) {
      try {
        const { data } = await Vue.prototype.$http.get(
          "$bill-consume/common/price"
        );
        const resources = data.items.map((item) => {
          const unitPrice = BigNumber.from(item.data);
          console.log(item.resourceType);
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
            default:
              break;
          }
          return {
            type: item.resourceType,
            unitPrice,
          };
        });
        commit("SET_RESOURCES", resources);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
