import http from "@/api";

const request = http;

export function sendWeb3Login(account, data) {
  return request.post(`$auth/web3login/${account}`, data);
}

export function fetchWeb3code(account) {
  return request.get(`$auth/web3code/${account}`);
}

export function sendStoken(stoken) {
  return request.post(`$auth/st/${stoken}`);
}
