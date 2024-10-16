import axios from "axios";

const inDev = /xyz/.test(process.env.VUE_APP_BASE_URL);

let url = inDev ? "https://staging.ton.ai" : "https://app.ton.ai";
export const clickAds = (
  telegramUserId,
  inExchangeCampaignId,
  outExchangeCampaignId
) => {
  return axios.post(
    `${url}/api/v2/openapi/exchange/event/report`,
    {
      eventType: "click",
      eventData: {
        telegramUserId,
        inExchangeCampaignId,
        outExchangeCampaignId,
      },
    },
    {
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.VUE_APP_TON_AI_ADS_KEY,
      },
    }
  );
};

export const conversionAds = (userId) => {
  return axios.post(
    `${url}/api/v2/openapi/exchange/event/report/conversion`,
    {
      eventType: "conversion",
      eventData: {
        telegramUserId: userId,
      },
    },
    {
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.VUE_APP_TON_AI_ADS_KEY,
      },
    }
  );
};
