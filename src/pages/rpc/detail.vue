<template>
  <div class="api-detail">
    <div class="d-flex al-c mb-2">
      <e-right-opt-wrap style="width: 100%" :top="-70">
        <v-btn color="primary" :to="`/rpc/settings/${name}/${id}`">
          <img :src="require('/public/img/svg/rpc/settings.svg')" width="24" />
          <span class="ml-2">Settings</span>
        </v-btn>
      </e-right-opt-wrap>
    </div>
    <div class="top-tips" v-show="tipsShow" v-if="keyType == 'FREE'">
      <div class="d-flex al-c">
        <img :src="require('/public/img/svg/rpc/top-tips.svg')" width="24" />
        <span class="ml-2">
          Free Key has a request limit of
          <a
            href="https://docs.4everland.org/rpc/whats-cus-cups"
            target="_blank"
            rel="noopener noreferrer"
            class="text-link"
          >
            300 CUPS </a
          >, with a monthly cap of 150,000,000 CU (currently used:
          {{ usage }} CU).
        </span>
      </div>
      <!-- <img
        :src="require('/public/img/svg/rpc/x-close.svg')"
        width="24"
        style="cursor: pointer"
        @click="tipsShow = false"
      /> -->
    </div>
    <div class="top-tips" v-show="tipsShow" v-else>
      <div class="d-flex al-c">
        <img :src="require('/public/img/svg/rpc/top-tips.svg')" width="24" />
        <span class="ml-2">
          Currently operating with a premium key, consuming your LAND with a
          request limit of
          <a
            href="https://docs.4everland.org/rpc/whats-cus-cups"
            target="_blank"
            rel="noopener noreferrer"
            class="text-link"
          >
            1000 CUPS </a
          >. For enhanced configurations, feel free to
          <a
            href="http://discord.gg/4everland"
            target="_blank"
            rel="noopener noreferrer"
            class="text-link"
            >contact us</a
          >
          for customized solutions.
        </span>
      </div>
      <!-- <img
        :src="require('/public/img/svg/rpc/x-close.svg')"
        width="24"
        style="cursor: pointer"
        @click="tipsShow = false"
      /> -->
    </div>
    <div class="mt-6">
      <div class="d-flex al-c mb-4 justify-space-between">
        <span class="list-tit">API Key</span>
      </div>
      <div class="d-flex al-c">
        <div class="api-key-box">
          <span>{{ userKey }}</span>
          <v-btn icon v-clipboard="userKey" @success="$toast('Copied!')">
            <img :src="require('/public/img/svg/rpc/copy.svg')" width="24" />
          </v-btn>
        </div>
        <div class="ml-2 api-time" v-if="updatedAt">
          Updated on {{ parseTime(updatedAt, "{y}-{m}-{d}") }}
        </div>
        <div class="ml-2 api-time" v-else-if="createdAt">
          Created on {{ parseTime(createdAt, "{y}-{m}-{d}") }}
        </div>
      </div>
      <div class="d-flex al-c mt-2">
        <a
          href="https://docs.4everland.org/rpc/guides"
          target="_blank"
          rel="noopener noreferrer"
          style="
            color: #6172f3;
            font-size: 14px;
            font-weight: 400;
            text-decoration-line: underline;
          "
          >API Reference Doc
        </a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            d="M6 12.5L10 8.5L6 4.5"
            stroke="#735EA1"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="mt-10 endpoints-box">
      <div class="d-flex al-c mb-4 justify-space-between">
        <span class="list-tit">Endpoints</span>
      </div>
      <div class="d-flex al-c justify-space-between">
        <span class="endpoints-tips">
          Our Web3 API Key works across several networks, use it on one or use
          it on all.
        </span>
        <e-radio-btn
          class="ml-auto"
          minWidth="110px"
          minHeight="24px"
          :options="typeList"
          v-model="typeIdx"
          @input="changeType"
        ></e-radio-btn>
      </div>
      <div class="endpoints-list-box mt-4">
        <div
          class="endpoints-list-item"
          v-for="(item, index) in chainList"
          :key="index"
        >
          <div class="d-flex al-c">
            <img :src="item.logo" width="32" />
            <span class="item-name">{{ item.name }}</span>
          </div>
          <div class="d-flex">
            <div style="background-color: #fff; width: 160px">
              <v-select
                class="hide-msg"
                outlined
                :items="item.networks"
                item-text="name"
                item-value="key"
                dense
                @change="
                  (val) => {
                    changeSelectNetwork(val, item);
                  }
                "
                v-model="item.seleted"
              ></v-select>
            </div>
            <div class="d-flex endpoints-link-box">
              <div class="endpoints-link">
                {{ item.rpcUrl }}
              </div>

              <div class="copy-btn">
                <v-btn
                  icon
                  v-clipboard="item.rpcUrl"
                  @success="$toast('Copied!')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <rect x="2" y="8" width="14" height="14" fill="white" />
                  </svg>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchKeyDetail, fetchEndpoints } from "@/api/rpc.js";
import { parseTime } from "@/utils";
export default {
  data() {
    return {
      name: "",
      id: "",
      tipsShow: true,
      typeList: ["Https", "WebSockets"],
      typeIdx: 0,
      apiKeyLise: [
        {
          icon: require("/public/img/svg/rpc/logo/Ethereum.png"),
          name: "Ethereum",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/ETH_Beacon.png"),
          name: "ETH Beacon",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/Polygon.png"),
          name: "Polygon",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/Arbitrum_Nova.png"),
          name: "Arbitrum Nova",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/Arbitrum.png"),
          name: "Arbitrum",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/BNB.png"),
          name: "BNB",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/BSC.png"),
          name: "BSC",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/Polygon.png"),
          name: "Polygon",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/OPTIMISM.png"),
          name: "OPTIMISM",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/SOLANA.png"),
          name: "SOLANA",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/Aptos.png"),
          name: "Aptos",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/NEAR.png"),
          name: "NEAR",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/Avalanche.png"),
          name: "Avalanche (C-Chain)",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
        {
          icon: require("/public/img/svg/rpc/logo/fantom.png"),
          name: "Fantom",
          mainnet: {
            https: "eth-mainnet-rpc.4everland.org/v1/",
            websockets: "eth-mainnet-rpc.4everland.org/ws/v1/",
          },
          testnet: {
            https: "eth-testnet-rpc.4everland.org/v1/",
            websockets: "eth-testnet-rpc.4everland.org/ws/v1/",
          },
          selectItems: ["Mainnet", "Testnet"],
          seleted: "Mainnet",
        },
      ],
      chainList: [],
      userKey: "",
      createdAt: null,
      updatedAt: null,
      usage: 0,
      keyType: "FREE",
    };
  },
  created() {
    this.name = this.$route.params.name;
    this.id = this.$route.params.id;
    this.init();
  },
  mounted() {},
  methods: {
    parseTime,
    async init() {
      await this.getKey();
      await this.getEndpoints("HTTP");
    },
    async getKey() {
      const id = this.id;
      const { data } = await fetchKeyDetail(id);
      this.userKey = data.userKey;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.usage = this.numberWithCommas(data.usage);
      this.keyType = data.keyType;
    },
    async getEndpoints(type) {
      const params = { type: type };
      const { data } = await fetchEndpoints(params);
      data.map((item) => {
        item.seleted = item.networks[0];
        item.rpcUrl = item.url[0].replace("%s", this.userKey);
        return item;
      });
      this.chainList = data;
    },
    changeType(val) {
      switch (val) {
        case 0:
          this.getEndpoints("HTTP");
          break;
        case 1:
          this.getEndpoints("WEBSOCKET");
          break;
      }
    },
    changeSelectNetwork(val, item) {
      if (val == "mainnet") {
        item.rpcUrl = item.url[0].replace("%s", this.userKey);
      } else {
        item.rpcUrl = item.url[1].replace("%s", this.userKey);
      }
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>

<style lang="scss" scoped>
.api-detail {
  .list-tit {
    color: #000;
    font-size: 24px;
    font-weight: 400;
  }
  .top-tips {
    border-radius: 4px;
    background: var(--v-background2-base);
    color: var(--v-primary-base);
    font-size: 14px;
    font-weight: 400;
    display: flex;
    padding: 16px 24px;
    justify-content: space-between;
    align-items: center;
    .text-link {
      color: var(--v-primary-base);
      font-size: 14px;
      font-weight: 700;
      text-decoration-line: underline;
    }
  }
  .api-key-box {
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: #f1f5f9;
    gap: 236px;
  }
  .api-time {
    color: #64748b;
    font-size: 12px;
    font-weight: 400;
  }
  .endpoints-box {
    .endpoints-tips {
      color: #64748b;
      font-size: 16px;
      font-weight: 400;
    }
  }
  .endpoints-list-box {
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    .endpoints-list-item {
      display: flex;
      padding: 16px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cbd5e1;
      .item-name {
        color: #000;
        font-size: 20px;
        font-weight: 700;
        margin-left: 8px;
      }
      .endpoints-link-box {
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: space-between;
        background: #f1f5f9;
        color: #000;
        font-size: 14px;
        font-weight: 400;
        border-radius: 4px;
        overflow: hidden;
        margin-left: 8px;

        .endpoints-link {
          min-width: 550px;
          padding: 12px 8px;
        }
        .copy-btn {
          display: flex;
          padding: 8px;
          align-items: center;
          gap: 464px;
          background: #6172f3;
          cursor: pointer;
        }
      }
    }
    .endpoints-list-item:last-child {
      border: none;
    }
  }
}
</style>
