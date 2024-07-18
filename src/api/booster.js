import BaseRequest from "./request";

const boosterRequest = new BaseRequest({
  baseURL: process.env.VUE_APP_BASE_URL,
  interceptors: {
    requestInterceptor(config) {
      const token = localStorage.token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    responseIntercepotor(res) {
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
  return boosterRequest.post({
    url: "/node/node",
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
