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
  return request.post(`$raas/rollup/create`, data, {
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

export function sendTransaction(data) {
  return request.post(`$raas/rollup/transaction`, data);
}

export function fetchRollupDetail(id) {
  return request.get(`$raas/rollup/detail/${id}`);
}

export function fetchRollupLogs(id, type, params) {
  return request.get(`$raas/rollup/${id}/${type}/logs`, {
    params,
  });
}

export function sendContactInfo(id, data) {
  return request.put(`$raas/rollup/${id}/contact_info`, data);
}

export function fetchRollupBillings(params) {
  return request.get(`$raas/rollup/bills`, {
    params,
  });
}

export function fetchEthBalance(address) {
  return request.get(`$raas/common/eth/balance/${address}`);
}

export function sendRenew(id) {
  return request.post(`$raas/rollup/${id}/renew`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

export function fetchProgress(id) {
  return request.get(`$raas/rollup/${id}/progress`);
}
