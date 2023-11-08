import http from "@/api";

const request = http;
request.defaults.baseURL = process.env.VUE_APP_RPC_URL;
request.interceptors.request.use(async (config) => {
  config.headers["Authorization"] = "Bearer " + localStorage.token;
  return config;
});

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

export function sendKeyDetailInfo(id, data) {
  return request.put(`/rpc/manager/keys/${id}/info`, data);
}

export function fetchSecurityMessage(id) {
  return request.get(`/rpc/manager/keys/${id}/security`);
}

export function sendSecurity(id, data) {
  return request.put(`/rpc/manager/keys/${id}/security`, data);
}

export function addSecurity(id, data) {
  return request.post(`/rpc/manager/keys/${id}/security`, data);
}

export function deleteSecurity(id, securityId) {
  return request.delete(`/rpc/manager/keys/${id}/security/${securityId}`);
}

export function resetKey(id) {
  return request.post(`/rpc/manager/keys/${id}/reset`);
}

export function deletetKey(id) {
  return request.delete(`/rpc/manager/keys/${id}`);
}

export function fetchEndpoints(params) {
  return request.get(`/rpc/manager/endpoints`, { params });
}
