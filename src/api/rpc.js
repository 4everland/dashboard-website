import http from "@/api";

console.log(http);
const request = http;
// http.interceptors.request.use(async (config) => {
//   config.url = "https://192.168.100.10";
//   return config;
// });

request.defaults.baseURL = "http://192.168.100.10";

export function fetchOverview(params) {
  return request.get("/rpc/manager/stat/overview", {
    params,
  });
}

export function fetchTrends(params) {
  return request.get("/rpc/manager/stat/trends", {
    params,
  });
}

export function fetchTop(params) {
  return request.get("/rpc/manager/stat/top5", {
    params,
  });
}

export function fetchToponchain(params) {
  return request.get("/rpc/manager/stat/top5onchain", {
    params,
  });
}

export function sendCreateKey(data) {
  return request.post("/rpc/manager/keys", data);
}

export function fetchKeyList(params) {
  return request.get("/rpc/manager/keys", {
    params,
  });
}

export function fetchKeyDetail(id) {
  return request.get(`/rpc/manager/keys/${id}`);
}

export function fetchKeyDetailInfo(id) {
  return request.get(`/rpc/manager/keys/${id}/info`);
}

export function sendKeyDetailInfo(id, params) {
  return request.put(`/rpc/manager/keys/${id}/info`, { params });
}
