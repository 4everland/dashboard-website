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
      return res.data;
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
    url: `/node/activities/${id}/onNext`,
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
    url: `/node/node/create/${code}`,
  });
};

export const unlockStage = async (index, inviteCode = null) => {
  const stages = ["storage", "network", "compute"];
  return boosterRequest.post({
    url: `/node/node/stage/${stages[index]}`,
    data: {
      invite_code: inviteCode,
    },
  });
};

export const fetchInviteInfo = async () => {
  return boosterRequest.get({
    url: "/node/invite",
  });
};

export const fetchLeaderboard = async (page, size = 10) => {
  return boosterRequest.get({
    url: `/node/node/leaderboard?page=${page}&size=${size}`,
  });
};

export const fetchRemainingExploration = async () => {
  return boosterRequest.get({
    url: "/node/exploration/today",
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

export const fetchNftBind = async (params) => {
  return boosterRequest.get({
    url: "/nft/bind",
    params,
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
