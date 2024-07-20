import { fetchUserBoostInfo } from "@/api/booster";
export default {
  state: () => ({
    points: "",
    rate: {
      baseRate: "",
      productionRate: "",
      stakingWeight: "",
    },
    showStakeDrawer: false,
    showTaskDrawer: false,
  }),
  getters: {
    showStakeDrawer: (state) => state.showStakeDrawer,
    showTaskDrawer: (state) => state.showTaskDrawer,
  },
  mutations: {
    SHOWSTAKEDRAWER_STATE: (state, payload) => {
      state.showStakeDrawer = payload.state;
    },
    STAKEDRAWER_TOGGLE: (state) => {
      state.showStakeDrawer = !state.showStakeDrawer;
    },
    SHOWTASKDRAWER_STATE: (state, payload) => {
      state.showTaskDrawer = payload.state;
    },
    TASKDRAWER_TOGGLE: (state) => {
      state.showTaskDrawer = !state.showTaskDrawer;
    },
  },
  actions: {
    StakeDrawerState: async (context, payload) => {
      context.commit("SHOWSTAKEDRAWER_STATE", payload);
    },
    StakeDrawerToggle: async (context, payload) => {
      context.commit("STAKEDRAWER_TOGGLE", payload);
    },
    TaskDrawerState: async (context, payload) => {
      context.commit("SHOWTASKDRAWER_STATE", payload);
    },
    TaskDrawerToggle: async (context, payload) => {
      context.commit("TASKDRAWER_TOGGLE", payload);
    },

    async getBoosterUserInfo() {
      try {
        const data = await fetchUserBoostInfo();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
