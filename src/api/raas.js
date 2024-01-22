import http from "@/utils/Api";

const request = http;

request.defaults.baseURL = process.env.VUE_APP_RAAS_URL;
request.interceptors.request.use(async (config) => {
  config.headers["Authorization"] = localStorage.token;
  return config;
});

export function fetchRollupList(params) {
  return request.get("/rollup", {
    params,
  });
}

export function fetchDefaultChainId(params) {
  return request.get("/rollup/chain", {
    params,
  });
}

export function sendCreateRaas(data) {
  return request.post(`/rollup`, data, {
    noTip: true,
  });
}

export function sendCheckChainId(id) {
  return request.post(`/rollup/chain/${id}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
