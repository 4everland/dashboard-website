import Vue from "vue";
import Axios from "axios";
import AsyncLock from "async-lock";

const inDev = /xyz/.test(process.env.VUE_APP_BASE_URL);
Vue.prototype.$inDev = inDev;
// const isLocal = /localhost/.test(location.host);

Vue.prototype.$arHashPre = "https://arweave.net/"; // https://ar.foreverland.xyz/
Vue.prototype.$arVerifyPre = "https://viewblock.io/arweave/tx/"; // https://ar.foreverland.xyz/tx/
Vue.prototype.$axios = axios;

export const endpoint = inDev
  ? "https://s3gw.foreverland.xyz"
  : "https://endpoint.4everland.co";
const authApi = inDev
  ? "https://auth.foreverland.xyz"
  : "https://oauth.4everland.org";
const v3Api = inDev
  ? "https://settlement.foreverland.xyz"
  : "https://pay.4everland.org";

Vue.prototype.$endpoint = endpoint;

const loginUrl = inDev
  ? "https://4ever-login-test.4everland.app"
  : "https://login.4everland.org";

const getLoginUrl = (Vue.prototype.$getLoginUrl = () => {
  console.log(location);
  let url = "#/login";
  if (localStorage.inviteCode) {
    url += "?inviteCode=" + localStorage.inviteCode;
  }
  return url;
});

export const http = Axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});
const hostingUrl = process.env.VUE_APP_HOST_URL;
export const http2 = Axios.create({
  baseURL: hostingUrl,
});
Vue.prototype.$getImgSrc = function (src) {
  if (!src) src = "img/bg/empty/project.png";
  else if (!/^http/.test(src)) src = hostingUrl + src;
  return src;
};
Vue.prototype.$getPolygonUrl = (hash) => {
  const pre = inDev
    ? "https://mumbai.polygonscan.com/tx/"
    : "https://polygonscan.com/tx/";
  return pre + hash;
};

const RefreshPath = "/refresh";
const RefreshLockKey = "refresh";
const lock = new AsyncLock({ timeout: 5000 });

[http, http2].forEach((axios) => {
  axios.interceptors.request.use(
    async (config) => {
      let token = "";
      if (config.url != RefreshPath) {
        await lock
          .acquire(RefreshLockKey, async () => {
            token = localStorage.token;
            let { accessTokenExpireAt, refreshToken } = JSON.parse(
              localStorage.authData || "{}"
            );
            if (token && Date.now() + 3600 * 1e3 >= accessTokenExpireAt) {
              const { data } = await http.post(
                RefreshPath,
                {
                  refreshToken,
                },
                {
                  params: {
                    _auth: 1,
                  },
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                }
              );
              localStorage.authData = JSON.stringify(data);
              token = data.accessToken;
              localStorage.token = token;
            }
          })
          .then(() => {});
      } else {
        token = localStorage.token;
      }

      const params = (config.params = config.params || {});
      if (params._auth && !/^http/.test(config.url)) {
        config.url = authApi + config.url;
        delete params._auth;
      }
      config.url = config.url.replace("$v3", v3Api).replace("$auth", authApi);

      if (config.url.includes(authApi)) {
        token = "Bearer " + token;
      }
      if (token && config.url != RefreshPath) {
        config.headers.common["Authorization"] = token;
      }

      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    (res) => {
      const data = res.data;
      if (typeof data == "object" && data && "code" in data) {
        if (data.code != 200 && data.code != "SUCCESS") {
          let msg = data.message || `${data.code} error`;
          handleMsg(200, data.code, msg, res.config);
          Vue.prototype.$loading.close();
          // console.log(data, res.config);
          const error = new Error(msg);
          error.code = data.code;
          throw error;
        }
        if ("data" in data) {
          return data;
        }
      }
      return res;
    },
    (error) => {
      const {
        data = {},
        status,
        statusText,
        config = {},
      } = error.response || {};
      console.log(error, status, statusText);
      if (status == 409) {
        console.log(data);
        setTimeout(() => {
          if (typeof data.data == "string") {
            const jsonData = JSON.parse(data.data);
            localStorage.authData = JSON.stringify(jsonData);
            localStorage.token = jsonData.accessToken;
            localStorage.stsData1 = "";
            Vue.prototype
              .$alert(" Successfully bound your account.")
              .then(() => {
                window.location.reload();
              });
          } else {
            Vue.prototype.$alert(data.message).then(() => {
              window.location.reload();
            });
          }
        }, 10);
      } else {
        let msg = data.message || error.message;
        handleMsg(status, data.code, msg, config);
      }
      error.code = data.code;
      return Promise.reject(error);
    }
  );
});

function goLogin() {
  localStorage.clear();
  if (location.hash != "#/login") {
    localStorage.loginTo = location.hash;
    location.href = getLoginUrl();
    console.log("logout");
  }
}

async function handleMsg(status, code, msg, config) {
  console.log(code, msg);
  if (!msg && typeof code == "string") {
    msg = code;
  }
  msg = msg || "Unknown Error";
  const vue = Vue.prototype;
  await vue.$sleep(10);
  if (status == 401 || code == 401) {
    goLogin();
  } else if (msg == "Network Error") {
    vue
      .$confirm(
        "A network error has occurred. Please check your connections and try again.",
        msg,
        {
          confirmText: "Retry",
        }
      )
      .then(() => {
        location.reload();
      });
  } else if (msg && !config.noTip) {
    vue.$alert(msg).then(() => {
      if (msg == "Request aborted") {
        location.reload();
      }
    });
  }
}

Vue.prototype.$http = http;
Vue.prototype.$http2 = http2;

export default http;
