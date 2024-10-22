import {
  fetchUserBoostInfo,
  fetchRemainingExploration,
  fetchClaimUSDT,
  fetchInviteInfo,
  fetchTgInviteInfo,
  fetchInviteCount,
  fetchDailySign,
} from "@/api/booster";
import { TonConnectUI } from "@tonconnect/ui";

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
        negative: 0,
        protectExpiredAt: -1,
      },
      inviteInfo: {
        daily: 0,
        inviteCode: "-",
        invited: 0,
        link: "-",
      },
      tgMiniOverlayLoading: true,
      exploreRemain: 0,
      showStakeDrawer: false,
      showTaskDrawer: false,
      showToolDrawer: false,
      showInviteDrawer: false,
      showProfileDrawer: false,
      currentDate: +new Date() / 1000,
      showBindWallet: false,
      taskUndo: false,
      stakeUndo: false,
      tonCount: 0,
      updateBoostUserInfo: false,
      userInviteCount: 0,
      showEasterEggDialog: false,
      tonConnectUI: new TonConnectUI({
        manifestUrl: "https://dashboard.4everland.org/tonconnect-manifest.json",
      }),
      dailySign: null,
    };
  },
  getters: {
    isTgMiniApp() {
      return Object.keys(window.$tg.initDataUnsafe).length > 0;
    },
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
    tonConnected(state) {
      if (state.tonConnectUI) {
        return state.tonConnectUI.connected;
      }
      return false;
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
    SET_INVITE_BAR(state, isShow) {
      state.showInviteDrawer = isShow;
    },
    SET_PROFILE_BAR(state, isShow) {
      state.showProfileDrawer = isShow;
    },
    SET_BOOST_TASK_UNDO(state, undo) {
      state.taskUndo = undo;
    },
    SET_BOOST_STAKE_UNDO(state, undo) {
      state.stakeUndo = undo;
    },
    SET_TON_COUNT(state, count) {
      state.tonCount = count;
    },
    SET_INVITE_INFO(state, info) {
      state.inviteInfo = info;
    },
    SET_UPDATE_BOOST_USER_INFO(state) {
      state.updateBoostUserInfo = !state.updateBoostUserInfo;
    },
    SET_USER_INVITE_COUNT(state, count) {
      state.userInviteCount = count;
    },
    SET_EASTER_EGG_DIALOG(state, val) {
      state.showEasterEggDialog = val;
    },
    SET_TON_WALLET_CLIENT(state) {
      const tonConnectUI = new TonConnectUI({
        manifestUrl: "https://dashboard.4everland.org/tonconnect-manifest.json",
      });
      state.tonConnectUI = tonConnectUI;
    },
    SET_DAILY_SIGN(state, value) {
      state.dailySign = value;
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
      const { code, data, message } = await fetchUserBoostInfo();
      if (data) {
        commit("SET_BOOST_INFO", data);
        commit("SET_UPDATE_BOOST_USER_INFO");
        if (state.tgMiniOverlayLoading) {
          commit("SET_TG_OVERLAY_LOAD", false);
        }
      } else {
        if (state.tgMiniOverlayLoading) {
          commit("SET_TG_OVERLAY_LOAD", false);
        }
        throw { code, message };
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
    async getBoostTonCount({ commit }) {
      try {
        const { data } = await fetchClaimUSDT();
        if (data) {
          commit("SET_TON_COUNT", Number(data.balance));
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getInviteInfo({ getters, commit }) {
      try {
        let info = {};
        if (getters.isTgMiniApp) {
          const { data } = await fetchTgInviteInfo();
          info = data;
        } else {
          const { data } = await fetchInviteInfo();
          info = data;
        }
        if (info) {
          commit("SET_INVITE_INFO", info);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getInviteCount({ commit }) {
      try {
        const { data } = await fetchInviteCount();
        if (data) {
          commit("SET_USER_INVITE_COUNT", data.count);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getDailySign({ commit }) {
      try {
        const { data } = await fetchDailySign();
        commit("SET_DAILY_SIGN", data.items);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
