import { fetchUserBoostInfo } from "@/api/booster";
export default {
  state: () => ({
    boosterInfo: {
      baseRate: [],
      boosts: [],
      capacity: 100,
      claimable: 0,
      computeTimestamp: 0,
      computed: 0,
      rateBuff: 0,
      totalPoint: 0,
    },
    showStakeDrawer: false,
    showTaskDrawer: false,
  }),
  getters: {
    showStakeDrawer: (state) => state.showStakeDrawer,
    showTaskDrawer: (state) => state.showTaskDrawer,
    boostLocked({ boosterInfo }) {
      return boosterInfo.baseRate.length == 0;
    },
    baseRate({ boosterInfo }) {
      return boosterInfo.baseRate.reduce((prev, it) => it.rate + prev, 0);
    },
    boostRate({ boosterInfo }) {
      return boosterInfo.boosts.reduce((prev, it) => it.rate + prev, 0);
    },
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
    SET_BOOST_INFO(state, info) {
      state.boosterInfo = info;
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

    async getBoosterUserInfo({ commit }) {
      try {
        const { data } = await fetchUserBoostInfo();
        commit("SET_BOOST_INFO", data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
