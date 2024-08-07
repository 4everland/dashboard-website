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
      },
      exploreRemain: 0,
      showStakeDrawer: false,
      showTaskDrawer: false,
      currentDate: +new Date() / 1000,
    };
  },
  getters: {
    showStakeDrawer: (state) => state.showStakeDrawer,
    showTaskDrawer: (state) => state.showTaskDrawer,
    boostLocked({ boosterInfo }) {
      return boosterInfo.baseRate.length == 0;
    },
    baseRate({ boosterInfo }) {
      return boosterInfo.baseRate.reduce((prev, it) => it.rate + prev, 0);
    },
    boostRate({ currentDate, boosterInfo }) {
      return boosterInfo.boosts.reduce((prev, it) => {
        if (currentDate > it.end) {
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
          return (
            pre +
            ((curTimestamp - boosterInfo.computeTimestamp) / 3600) * it.rate
          );
        }, 0);
        const boostComputed = boosterInfo.boostRate.reduce((pre, it) => {
          let endTimeStamp = curTimestamp;
          if (it.end > 0 && endTimeStamp > it.end) { endTimeStamp = it.end;}
          if(endTimeStamp < boosterInfo.computeTimestamp) {return pre;}
          return (
            pre +
            ((curTimestamp - boosterInfo.computeTimestamp) / 3600) * it.rate
          );
        }, 0);

        console.log(basicComputed + boostComputed + boosterInfo.computed);
        return basicComputed + boostComputed + boosterInfo.computed;
      }
      const basicComputed = boosterInfo.baseRate.reduce((pre, it) => {
        return pre + ((curTimestamp - it.start) / 3600) * it.rate;
      }, 0);

      const boostComputed = boosterInfo.boostRate.reduce((pre, it) => {
        let endTimeStamp = curTimestamp;
        if (it.end > 0 && endTimeStamp > it.end) { endTimeStamp = it.end;}
        if(endTimeStamp < it.start) {return pre;}
        return pre + ((endTimeStamp - it.start) / 3600) * it.rate;
      }, 0);

      return basicComputed + boostComputed;
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
    SET_EXPLORE_REMAIN(state, count) {
      state.exploreRemain = count;
    },
    updateDate(state) {
      state.currentDate = +new Date() / 1000;
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
        if (!data) return;
        commit("SET_BOOST_INFO", data);
      } catch (error) {
        console.log(error);
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
