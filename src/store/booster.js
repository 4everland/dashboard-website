import { fetchUserBoostInfo, fetchRemainingExploration } from "@/api/booster";
export default {
  state: () => {
    return {
      boosterInfo: {
        baseRate: [],
        boosts: [],
        capacity: 100,
        claimable: 0,
        computeTimestamp: 0,
        computed: 0,
        rateBuff: 0,
        totalPoint: 0,
        preActivities: true,
      },
      tgMiniOverlayLoading: true,
      exploreRemain: 0,
      showStakeDrawer: false,
      showTaskDrawer: false,
      showToolDrawer: false,
      currentDate: +new Date() / 1000,
      showBindWallet: false,
    };
  },
  getters: {
    showStakeDrawer: (state) => state.showStakeDrawer,
    showTaskDrawer: (state) => state.showTaskDrawer,
    showBindWallet: (state) => state.showBindWallet,
    boostLocked({ boosterInfo }) {
      return boosterInfo.baseRate.length == 0;
    },
    baseRate({ boosterInfo }) {
      return boosterInfo.baseRate.reduce((prev, it) => it.rate + prev, 0);
    },
    boostRate({ currentDate, boosterInfo }) {
      return boosterInfo.boosts.reduce((prev, it) => {
        if (currentDate > it.end && it.end > 0) {
          return 0 + prev;
        }
        return it.rate + prev;
      }, 0);
    },
    totalRate(state, getters) {
      return (
        (getters.baseRate + getters.boostRate) *
        (1 + state.boosterInfo.rateBuff / 100)
      );
    },
    currentComputed({ boosterInfo }) {
      let curTimestamp = +new Date() / 1000;
      if (boosterInfo.computeTimestamp != 0) {
        const basicComputed = boosterInfo.baseRate.reduce((pre, it) => {
          let startTime = boosterInfo.computeTimestamp;
          if (boosterInfo.computeTimestamp < it.start) {
            startTime = it.start;
          }
          if (curTimestamp < startTime) {
            return pre;
          }
          return pre + ((curTimestamp - startTime) / 3600) * it.rate;
        }, 0);
        const boostComputed = boosterInfo.boosts.reduce((pre, it) => {
          let endTimeStamp = curTimestamp;
          let startTime = boosterInfo.computeTimestamp;
          if (boosterInfo.computeTimestamp < it.start) {
            startTime = it.start;
          }
          if (it.end > 0 && endTimeStamp > it.end) {
            endTimeStamp = it.end;
          }
          if (endTimeStamp < startTime) {
            return pre;
          }
          return pre + ((endTimeStamp - startTime) / 3600) * it.rate;
        }, 0);

        return (
          (basicComputed + boostComputed) * (boosterInfo.rateBuff / 100 + 1) +
          boosterInfo.computed
        );
      }
      const basicComputed = boosterInfo.baseRate.reduce((pre, it) => {
        if (curTimestamp < it.start) {
          return pre;
        }
        return pre + ((curTimestamp - it.start) / 3600) * it.rate;
      }, 0);

      const boostComputed = boosterInfo.boosts.reduce((pre, it) => {
        let endTimeStamp = curTimestamp;
        if (it.end > 0 && endTimeStamp > it.end) {
          endTimeStamp = it.end;
        }
        if (endTimeStamp < it.start) {
          return pre;
        }
        return pre + ((endTimeStamp - it.start) / 3600) * it.rate;
      }, 0);

      return (basicComputed + boostComputed) * (boosterInfo.rateBuff / 100 + 1);
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
    SHOWBINDWALLET_STATE: (state, payload) => {
      state.showBindWallet = payload.state;
    },
    BINDWALLET_TOGGLE: (state) => {
      state.showBindWallet = !state.showBindWallet;
    },
    SET_BOOST_INFO(state, info) {
      state.boosterInfo = info;
    },
    SET_TG_OVERLAY_LOAD(state, val) {
      state.tgMiniOverlayLoading = val;
    },
    SET_EXPLORE_REMAIN(state, count) {
      state.exploreRemain = count;
    },
    updateDate(state) {
      state.currentDate = +new Date() / 1000;
    },
    SET_TOOL_BAR(state, isShow) {
      state.showToolDrawer = isShow;
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
    BindWalletState: async (context, payload) => {
      context.commit("SHOWBINDWALLET_STATE", payload);
    },
    BindWalletToggle: async (context, payload) => {
      context.commit("BINDWALLET_TOGGLE", payload);
    },

    async getBoosterUserInfo({ commit, state }) {
      try {
        const { data } = await fetchUserBoostInfo();
        if (data) {
          commit("SET_BOOST_INFO", data);
        }
      } catch (error) {
        console.log(error);
      }
      if (state.tgMiniOverlayLoading) {
        commit("SET_TG_OVERLAY_LOAD", false);
      }
    },
    async getExploreRemain({ commit }) {
      try {
        const { data } = await fetchRemainingExploration();
        commit("SET_EXPLORE_REMAIN", data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
