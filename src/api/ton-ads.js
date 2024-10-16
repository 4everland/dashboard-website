import axios from "axios";
export const getAds = (openId, limit) => {
  const exchangeCampaignId = "670cc52a2934a8a35de244ed";
  return axios.get(
    `https://staging.ton.ai/api/v2/openapi/matching/exchange?exchangeCampaignId=${exchangeCampaignId}&openId=${openId}&type=telegram&limit=${limit}`,
    {
      headers: {
        "x-api-key": "ga9C3SzRL8rmnvVWmsO5ISoHDtwaNp",
      },
    }
  );
};

export const clickAds = (
  telegramUserId,
  inExchangeCampaignId,
  outExchangeCampaignId
) => {
  return axios.post(
    `https://staging.ton.ai/api/v2/openapi/exchange/event/report`,
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
    "https://staging.ton.ai/api/v2/openapi/exchange/event/report/conversion",
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
