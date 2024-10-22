// import Vue from "vue";
// import Axios from "axios";
// import axiosRetry from "axios-retry";
// import AsyncLock from "async-lock";
// import store from "@/store";
// // console.log(axiosRetry);
// const inDev = /xyz/.test(process.env.VUE_APP_BASE_URL);
// // const isLocal = /localhost/.test(location.host);

// export const endpoint = inDev
//   ? "https://s3gw.foreverland.xyz"
//   : "https://endpoint.4everland.co";

// const authApi = process.env.VUE_APP_AUTH_URL;
// const hostingUrl = process.env.VUE_APP_HOST_URL;
// const gateWayApi = process.env.VUE_APP_GATEWAY_URL;

// const v3Api = inDev
//   ? "https://settlement.foreverland.xyz"
//   : "https://pay.4everland.org";

// const ipnsApi = inDev
//   ? "https://ipns.foreverland.xyz"
//   : "https://ipns-api.4everland.org";

// const resourceApi = inDev
//   ? "https://rewardhub.foreverland.xyz"
//   : "https://api.4everland.org";

// const bucketDomainApi = inDev
//   ? "https://domain.foreverland.xyz"
//   : "https://api.4everland.org";

// export const pinningServiceApi = inDev
//   ? "https://pinning.foreverland.xyz"
//   : "https://api.4everland.dev";

// export const templateApi = inDev
//   ? "https://temp-template.foreverland.xyz"
//   : "https://fs-api.4everland.org";

// export const http = Axios.create({
//   // baseURL: process.env.VUE_APP_BASE_URL,
// });

// function keepMyToken(url) {
//   const urls = ["/user/activity/action/logs", "/cooperation/teams"];
//   const arr = urls.filter((it) => {
//     return new RegExp(it, "g").test(url);
//   });
//   return arr.length > 0;
// }
// const RefreshPath = "/refresh";
// const RefreshLockKey = "refresh";
// const lock = new AsyncLock({ timeout: 5000 });

// axiosRetry(http, {
//   retries: 3,
//   retryDelay: (retryCount) => {
//     return retryCount * 3000;
//   },
//   retryCondition: (error) => {
//     if (error.message.includes("Network Error")) return true;
//   },
//   onRetry: (retryCount, error, requestConfig) => {
//     if (retryCount == 1) {
//       window.gtag("event", "api_error", {
//         url: requestConfig.url || "no url",
//       });
//     }
//     if (retryCount == 3) {
//       Vue.prototype
//         .$confirm(
//           "A network error has occurred. Please check your connections and try again.",
//           error.message,
//           {
//             confirmText: "Retry",
//           }
//         )
//         .then(() => {
//           location.reload();
//         });
//     }
//   },
// });
// http.interceptors.request.use(
//   async (config) => {
//     let token = localStorage.token;
//     const { teamInfo } = store.getters;
//     if (teamInfo && !keepMyToken(config.url)) {
//       token = teamInfo.token || token;
//     }
//     if (config.url != RefreshPath) {
//       await lock
//         .acquire(RefreshLockKey, async () => {
//           let { accessTokenExpireAt, refreshToken } = JSON.parse(
//             localStorage.authData || "{}"
//           );
//           if (token && Date.now() + 3600 * 1e3 >= accessTokenExpireAt) {
//             const { data } = await http.post(
//               RefreshPath,
//               {
//                 refreshToken,
//               },
//               {
//                 params: {
//                   _auth: 1,
//                 },
//                 headers: {
//                   Authorization: "Bearer " + localStorage.token,
//                 },
//               }
//             );
//             localStorage.authData = JSON.stringify(data);
//             localStorage.token = data.accessToken;
//             if (teamInfo.isOwner) {
//               token = localStorage.token;
//             }
//           }
//         })
//         .then(() => {});
//     }

//     const params = (config.params = config.params || {});
//     if (params._auth && !/^http/.test(config.url)) {
//       config.url = authApi + config.url;
//       delete params._auth;
//     }
//     config.url = config.url
//       .replace("$hosting", hostingUrl)
//       .replace("$v3", v3Api)
//       .replace("$auth", authApi)
//       .replace("$gateway", gateWayApi)
//       .replace("$ipns", ipnsApi)
//       .replace("$resource", resourceApi)
//       .replace("$bucektDomain", bucketDomainApi)
//       .replace("$pinningService", pinningServiceApi)
//       .replace("$template", templateApi);
//     if (config.url.includes(authApi)) {
//       token = "Bearer " + token;
//     }

//     if (token && config.url != RefreshPath) {
//       config.headers.common["Authorization"] = token;
//     }

//     return config;
//   },
//   (error) => {
//     console.log(error);
//     return Promise.reject(error);
//   }
// );
// http.interceptors.response.use(
//   (res) => {
//     const data = res.data;
//     if (typeof data == "object" && data && "code" in data) {
//       if (data.code != 200 && data.code != "SUCCESS") {
//         let msg = data.message || `${data.code} error`;
//         handleMsg(200, data.code, msg, res.config);
//         Vue.prototype.$loading.close();
//         // console.log(data, res.config);
//         const error = new Error(msg);
//         error.code = data.code;
//         throw error;
//       }
//       if ("data" in data) {
//         return data;
//       }
//     }
//     return res;
//   },
//   (error) => {
//     const { data = {}, status, statusText, config = {} } = error.response || {};
//     // console.log(error, status, statusText);
//     if (status == 409) {
//       error.code = status;
//       if (config.noTip) return Promise.reject(error);
//       setTimeout(() => {
//         if (typeof data.data == "string") {
//           const jsonData = JSON.parse(data.data);
//           localStorage.authData = JSON.stringify(jsonData);
//           localStorage.token = jsonData.accessToken;
//           localStorage.stsData1 = "";
//           Vue.prototype.$alert(" Successfully bound your account.").then(() => {
//             window.location.reload();
//           });
//         } else {
//           Vue.prototype.$alert(data.message).then(() => {
//             if (data.code == "OBJECT_ALREADY_EXIST") return;
//             window.location.reload();
//           });
//         }
//       }, 10);
//     } else {
//       let msg = data.message || error.message;
//       handleMsg(status, data.code, msg, config);
//     }
//     error.code = data.code;
//     return Promise.reject(error);
//   }
// );
// function goLogin() {
//   clearLogin();
//   if (location.pathname != "/login") {
//     localStorage.loginTo = location.pathname + location.search;
//     location.href = getLoginUrl();
//     console.log("logout");
//   }
// }

// async function handleMsg(status, code, msg, config) {
//   console.log(status, code, msg);
//   try {
//     const { teamInfo } = store.getters;
//     if (!msg && typeof code == "string") {
//       msg = code;
//     }
//     msg = msg || "Unknown Error";
//     const vue = Vue.prototype;
//     await vue.$sleep(10);
//     if (process.env.VUE_APP_TG_VERSION == "true") {
//       localStorage.clear();
//       localStorage.loginTo = location.pathname + location.search;
//       location.reload();
//       return;
//     }
//     if (status == 401 || code == 401) {
//       if (teamInfo.isMember) {
//         localStorage.teamId = "";
//         return (location.href = "/");
//       }
//       if (!store.state.allowNoLogin) {
//         goLogin();
//       }
//     } else if (
//       /storage has reached/.test(msg) ||
//       /Insufficient storage/.test(msg) ||
//       /Insufficient IPFS storage/.test(msg) ||
//       /Insufficient AR storage/.test(msg)
//     ) {
//       await Vue.prototype.$utils.resourceInsufficient();
//     } else if (msg && msg != "Request aborted" && !config.noTip) {
//       await vue.$alert(msg);
//       if (status == 403) {
//         location.href = "/";
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// export default http;
