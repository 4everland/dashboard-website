import BaseRequest from "./request";

const boosterRequest = new BaseRequest({
  baseURL: process.env.VUE_APP_BOOSTER_URL,
  interceptors: {
    requestInterceptor(config) {
      const token = localStorage.nodeToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    responseInterceptor(res) {
      if (res.data.code == 401) {
        // localStorage.clear();
        // localStorage.loginTo = location.pathname + location.search;
        throw new Error("Access Denied!");
      } else if (res.data.code == 500) {
        throw new Error("Serivce Error!");
      }
      return res.data;
    },
    responseInterceptorCatch(error) {
      console.log(error, error.message);
      const { data = {}, status } = error.response || {};

      console.log(data, status, "==========");

      if (!status) {
        return {
          message: error.message,
        };
      }
      // if (data.code == 401 || status == 401) {
      //   localStorage.clear();
      //   localStorage.loginTo = location.pathname + location.search;
      // }

      return data;
    },
  },
});

export const fetchPreTaskActivity = async () => {
  return boosterRequest.get({
    url: `/node/activities/pre_tasks`,
  });
};
export const onNext = async (id, payment = null) => {
  return boosterRequest.post({
    url: `/node/activities/${id}/next`,
    data: {
      payment,
    },
  });
};

export const fetchUserBoostInfo = async () => {
  return boosterRequest.get({
    url: "/node/info",
  });
};

export const initBoost = async (code) => {
  return boosterRequest.post({
    url: `/node/create`,
    data: {
      code,
    },
  });
};

export const initTgBoost = async (code) => {
  return boosterRequest.post({
    url: `/node/tg/create`,
    data: {
      code,
    },
  });
};

export const unlockStage = async (index, inviteCode = null) => {
  const stages = ["storage", "compute", "network"];
  return boosterRequest.post({
    url: `/node/stage/${stages[index]}`,
    data: {
      invite_code: inviteCode,
    },
  });
};

export const claimPoints = async () => {
  return boosterRequest.put({
    url: `/node/claim`,
  });
};

export const fetchPointsHistory = async (page, size = 10) => {
  return boosterRequest.get({
    url: `/node/history?page=${page}&size=${size}`,
  });
};

export const fetchInviteInfo = async () => {
  return boosterRequest.get({
    url: "/node/invite/info",
  });
};

export const fetchTgInviteInfo = async () => {
  return boosterRequest.get({
    url: "/node/invite/tg/info",
  });
};

export const fetchLeaderboard = async (page, size = 10) => {
  return boosterRequest.get({
    url: `/node/leaderboard?page=${page}&size=${size}`,
  });
};

export const fetchRemainingExploration = async () => {
  return boosterRequest.get({
    url: "/node/exploration/today",
  });
};

export const fectchExploreId = async (token, nodeId = null) => {
  return boosterRequest.post({
    url: "/node/exploration",
    headers: {
      "cf-turnstile-response": token,
    },
    data: {
      nodeId,
    },
  });
};
export const fectchExploreInfo = async (id) => {
  return boosterRequest.get({
    url: `/node/exploration/info/${id}`,
  });
};

export const claimExplorePoints = async (explorationId) => {
  return boosterRequest.post({
    url: "/node/exploration/collect",

    data: {
      explorationId,
    },
  });
};

export const fetchStakeInfo = async () => {
  return boosterRequest.get({
    url: "/t4ever/stake/info",
  });
};

export const fetchEverPayHash = async (hash) => {
  return boosterRequest.post({
    url: `/everpay/stake/${hash}`,
  });
};

export const fetchNftLists = async () => {
  return boosterRequest.get({
    url: "/nft/list",
  });
};

export const fetchNftIsStake = async () => {
  return boosterRequest.get({
    url: "/nft/isStake",
  });
};

export const fetchNftBind = async (data) => {
  return boosterRequest.post({
    url: "/nft/bind",
    data,
  });
};

export const fetchDailySign = async () => {
  return boosterRequest.get({
    url: "/node/activities/daily_sign",
  });
};

export const fetchTasks = async () => {
  return boosterRequest.get({
    url: "/node/activities/tasks",
  });
};

export const fetchTasks_One = async () => {
  return boosterRequest.get({
    url: "/node/activities/tasks_one",
  });
};

export const fetchToolCards = async () => {
  return boosterRequest.get({
    url: "/node/cards",
  });
};

export const buyCard = async (name, number) => {
  return boosterRequest.post({
    url: "/node/cards",
    data: {
      name,
      number,
    },
  });
};
export const fetchInvite_Tasks = async () => {
  return boosterRequest.get({
    url: "/node/activities/invite_tasks",
  });
};

export const fetchPartner_Tasks = async () => {
  return boosterRequest.get({
    url: "/node/activities/partner_tasks",
  });
};

export const fetchInvite_Milestone_Tasks = async () => {
  return boosterRequest.get({
    url: "/node/activities/invite_milestone_tasks",
  });
};

export const inviteBatchClaim = async () => {
  return boosterRequest.post({
    url: "/node/activities/invite_milestone_tasks/batchClaim",
  });
};

export const fetchClaimUSDT = async () => {
  return boosterRequest.get({
    url: "/node/usdt",
  });
};

export const fetchClaimUSDTLog = async (page, size) => {
  return boosterRequest.get({
    url: `/node/usdt/log/${page}`,
    params: {
      size: size,
    },
  });
};

export const fetchInviteLog = async (page, size = 10) => {
  return boosterRequest.get({
    url: `/node/invite/history?page=${page}&size=${size}`,
  });
};

export const fetchInviteCount = async () => {
  return boosterRequest.get({
    url: `/node/activities/invite_milestone/count`,
  });
};

export const onEasterEgg = async (content) => {
  return boosterRequest.post({
    url: "/activity/mystery",
    data: {
      content,
    },
  });
};
export const fetchEliteQuest = async () => {
  return boosterRequest.get({
    url: "/elitequest/list",
  });
};

export const claimEliteQuest = async (activityId) => {
  return boosterRequest.post({
    url: `/elitequest/claim/${activityId}`,
  });
};

export const tonWithdraw = async (address, amount) => {
  return boosterRequest.post({
    url: `/node/withdraw`,
    data: {
      address,
      amount,
    },
  });
};

export const validPlayBot = async (code) => {
  return boosterRequest.post({
    url: "/node/valid/tg/play/bot",
    data: {
      code,
    },
  });
};

export const fetchSpinStart = async () => {
  return boosterRequest.get({
    url: "/node/spin/random",
  });
};

export const playSpin = async (taskId) => {
  return boosterRequest.post({
    url: "/node/spin",
    params: {
      taskId,
    },
  });
};

export const fetchClaimList = async (page = 1, size = 10) => {
  return boosterRequest.get({
    url: `/node/spin/history?page=${page}&size=${size}`,
  });
};

export const claimSpinReward = async (taskId) => {
  return boosterRequest.post({
    url: "/node/spin/claim",
    params: {
      taskId,
    },
  });
};

export const fetchKeyBalance = async () => {
  return boosterRequest.get({
    url: "/hooks/stake/balance",
  });
};

export const fetchKeyBalanceStake = async () => {
  return boosterRequest.post({
    url: "/hooks/stake/balance/dostake",
  });
};


export const handleBindExchange = async (param) => {
  return boosterRequest.post({
    url: "/node/exchange/profile",
    data: param,
  });
};

export const fetchBindInfo = async () => {
  return boosterRequest.get({
    url: `/node/exchange/profile`,
  });
};

export const tgPaymentInvoice = async (targetValue) => {
  return boosterRequest.post({
    url: "/node/tg/payment/invoice",
    data: {
      targetValue,
    },
  });
};

export const fetchAirdropInfo = async () => {
  return boosterRequest.get({
    url: `/node/airdrop`,
  });
};

export const fetchPoolProjectList = async () => {
  return boosterRequest.get({
    url: `/node/project/list`,
  });
};

export const fetchProjectPointsList = async () => {
  return boosterRequest.get({
    url: `/node/project/points`,
  });
};

export const fetchProjectInfo = async (projectId) => {
  return boosterRequest.get({
    url: `/node/project/${projectId}`,
  });
};

export const claimProjectPoints = async () => {
  return boosterRequest.get({
    url: `/node/project/points/claim`,
  });
};

export const fetchProjectTasks = async (areaName) => {
  return boosterRequest.get({
    url: `/node/activities/${areaName}`,
  });
};

