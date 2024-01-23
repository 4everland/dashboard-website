import http from "@/api";

const request = http;

export function fetchRollupList(params) {
  return request.get("$raas/rollup", {
    params,
  });
}

export function fetchDefaultChainId(params) {
  return request.get("$raas/rollup/chain", {
    params,
  });
}

export function sendCreateRaas(data) {
  return request.post(`$raas/rollup`, data, {
    noTip: true,
  });
}

export function sendCheckChainId(id) {
  return request.post(`$raas/rollup/chain/${id}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
