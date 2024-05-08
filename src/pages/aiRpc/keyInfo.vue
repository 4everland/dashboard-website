<template>
  <div class="key-info">
    <div class="key-info-header">
      <div v-if="keyInfo">
        <div class="al-c mb-4">
          <h3 class="fz-16">API Key</h3>
          <div class="ml-auto fz-14">
            <v-btn color="primary" @click="handleShowSetting">
              <img
                class="mr-2"
                src="/img/svg/ai-rpc/setting.svg"
                width="24"
                height="24"
                alt=""
              />
              Setting</v-btn
            >
            <v-btn outlined class="ml-4" @click="handleDelete">
              <img
                class="mr-2"
                src="/img/svg/ai-rpc/trash.svg"
                width="24"
                height="24"
                alt=""
              />
              Delete</v-btn
            >
          </div>
        </div>

        <div class="mb-4">
          <div class="fz-12 mb-2 key-title">key</div>
          <div class="al-c flex-wrap">
            <div class="key-secret pa-2 al-c">
              <span class="fz-14">{{ keyInfo.key }}</span>
              <img
                class="cursor-p ml-4"
                src="/img/svg/ai-rpc/copy.svg"
                width="24"
                height="24"
                alt=""
                v-clipboard="keyInfo.key"
                @success="$toast('Copied!')"
              />
            </div>
            <v-btn
              text
              :loading="resetLoading"
              @click="handleResetSecret"
              class="ml-4"
            >
              <img
                class="mr-1"
                src="/img/svg/ai-rpc/reset.svg"
                width="24"
                height="24"
                alt=""
              />
              Reset
            </v-btn>
          </div>
          <v-row class="mt-2" justify="space-between">
            <v-col cols="12" sm="2">
              <div class="param-title">Status</div>
              <!-- <div class="param-data">{{ keyInfo.isActived }}</div> -->

              <div class="status-tag d-ib fz-14">
                <span
                  class="dot d-ib"
                  :class="{ active: keyInfo.isActived }"
                ></span>
                <span class="ml-1">
                  {{ keyInfo.isActived ? "Active" : "Inactive" }}</span
                >
              </div>
            </v-col>
            <v-col cols="12" sm="2">
              <div class="param-title">Created on</div>
              <div class="param-data">
                {{ new Date(keyInfo.createdAt).format() }}
              </div>
            </v-col>
            <v-col cols="12" sm="2">
              <div class="param-title">Limits</div>
              <div class="param-data">
                {{
                  keyInfo.limit
                    ? $utils.formatLand(keyInfo.limit, false, false)
                    : "--"
                }}
                LAND
              </div>
            </v-col>
            <v-col cols="12" sm="2">
              <div class="param-title">Used</div>
              <div class="param-data">
                {{ $utils.formatLand(keyInfo.used, false, false) }} LAND
              </div>
            </v-col>
            <v-col cols="12" sm="2">
              <div class="param-title">Total Used</div>
              <div class="param-data">
                {{ $utils.formatLand(keyInfo.totalUsed, false, false) }} LAND
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <v-skeleton-loader type="article" v-else />
    </div>

    <div class="activity mt-4">
      <div class="pa-4 al-c space-btw">
        <div class="fw-b fz-16">Activity</div>

        <div class="al-c" v-show="activityList.length > 0">
          <div class="fz-14 mr-2">Model</div>
          <div style="width: 200px">
            <v-select
              v-model="curModel"
              :items="modelList"
              class="hide-msg"
              outlined
              dense
              @change="handleChangeModel"
            ></v-select>
          </div>
        </div>
      </div>

      <div class="pos-r activity-list">
        <div v-if="activityList.length">
          <v-simple-table>
            <template v-slot:default>
              <thead style="background: #f8fafc">
                <tr>
                  <th class="text-left">Timestamp</th>
                  <th class="text-left">Model</th>
                  <th class="text-left">Tokens</th>
                  <th class="text-left">Cost (LAND)</th>
                  <th class="text-left">
                    Host
                    <v-tooltip top max-width="300">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon size="18" v-bind="attrs" v-on="on"
                          >mdi-alert-circle-outline</v-icon
                        >
                      </template>
                      <span
                        >The time it took to receive the first byte of the
                        streamed generation from the model host, a.k.a. "time to
                        first byte."</span
                      >
                    </v-tooltip>
                  </th>
                  <th class="text-left">Speed</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in activityList" :key="item.id">
                  <td class="fz-14">
                    {{ new Date(item.createdAt * 1000).format() }}
                  </td>
                  <td class="fz-14">{{ item.model }}</td>
                  <td class="fz-14">
                    {{ item.inputTokens }} —> {{ item.outputTokens }}
                  </td>
                  <td class="fz-14">
                    {{ $utils.formatLand(item.cost, false, false) }} LAND
                  </td>
                  <td class="fz-14">{{ item.host }}s</td>
                  <td class="fz-14">{{ item.speed }} t/s</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-pagination
            v-if="pageLen > 1"
            class="py-4"
            @input="getActivityList"
            v-model="page"
            :length="pageLen"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            :total-visible="7"
          ></v-pagination>
        </div>
        <div class="pos-a no-date h-flex al-c" v-else>
          <img src="/img/svg/new-billing/no-date.svg" width="240" alt="" />
          <span class="mt-3 fz-14">No Data</span>
        </div>
      </div>
    </div>

    <v-dialog v-model="showSetting" persistent max-width="512">
      <div class="pa-6 create-keys">
        <div class="al-c space-btw mb-6">
          <h3 class="fz-16">Setting</h3>
          <img
            @click="showSetting = false"
            class="cursor-p"
            src="/img/svg/ai-rpc/close.svg"
            width="24"
            height="24"
            alt=""
          />
        </div>

        <div class="mb-4">
          <div class="ipt-label mb-2">
            API Key Name <span style="color: red">*</span>
          </div>
          <div class="al-c limit-ipt pa-2">
            <input class="flex-1" placeholder="" v-model="name" />
          </div>
        </div>
        <div class="mb-4">
          <div class="ipt-label mb-2">Monthly Limits (Optionals)</div>
          <div class="al-c limit-ipt">
            <input
              class="flex-1 px-2"
              placeholder=""
              v-model="limit"
              @input="handleLimitInput"
            />
            <div class="land">LAND</div>
          </div>
        </div>

        <div>
          <div class="ipt-label mb-2">Status</div>
          <div class="al-c">
            <div
              class="status-tab"
              :class="{ active: isActived }"
              @click="isActived = true"
            >
              Active
            </div>
            <div
              class="status-tab ml-2"
              :class="{ active: !isActived }"
              @click="isActived = false"
            >
              Inactive
            </div>
          </div>
        </div>

        <div class="mt-6 al-c justify-end">
          <v-btn text @click="showSetting = false">Cancel</v-btn>
          <v-btn
            color="primary"
            class="ml-2"
            :disabled="!name"
            @click="handleSettingConfirm"
            :loading="settingLoading"
            >Save</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      showSetting: false,
      name: "",
      limit: "",
      isActived: false,
      keyInfo: null,
      settingLoading: false,
      total: 0,
      size: 10,
      resetLoading: false,
      activityList: [],
      modelList: [{ text: "All", value: "" }],
      curModel: "",
    };
  },
  computed: {
    pageLen() {
      return Math.ceil(this.total / this.size);
    },
  },
  created() {
    this.getKeyInfo();
    this.getActivityList();
    this.getModelslist();
  },
  methods: {
    onPage() {
      this.getActivityList();
    },
    handleShowSetting() {
      this.showSetting = true;
      this.isActived = this.keyInfo.isActived;
      this.name = this.keyInfo.name;
      this.limit = this.keyInfo.limit;
    },
    async getKeyInfo() {
      try {
        const { data } = await this.$http.get(
          `$rpc/rpc/ai/manager/keys/${this.$route.params.id}`
        );

        this.keyInfo = data;
        this.isActived = data.isActived;
        this.name = data.name;
        this.limit = data.limit;
      } catch (error) {
        console.log(error);
      }
    },
    handleLimitInput() {
      this.limit = this.limit.replace(/[^\d]/g, "").replace(/^0+/, "");
    },

    async handleResetSecret() {
      try {
        await this.$confirm(
          "After resetting, the previous key will no longer be usable. Are you sure you want to proceed with the reset？",
          "Reset the API key"
        );
        this.resetLoading = true;
        await this.$http.post(
          `$rpc/rpc/ai/manager/keys/${this.$route.params.id}/reset`
        );
        await this.getKeyInfo();
      } catch (error) {
        console.log(error);
      }
      this.resetLoading = false;
    },

    async handleDelete() {
      try {
        await this.$confirm(
          "Once deleted, this API key cannot be recovered. Are you sure you want to proceed with the deletion?",
          "Delete the API key"
        );
        this.$loading();
        await this.$http.delete(
          `$rpc/rpc/ai/manager/keys/${this.$route.params.id}`
        );
        this.$toast("Delete successfully");
        this.$router.push("/ai-rpc?tab=Keys");
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
    async handleSettingConfirm() {
      this.settingLoading = true;
      try {
        await this.$http.put(
          `$rpc/rpc/ai/manager/keys/${this.$route.params.id}`,
          {
            name: this.name,
            limit: this.limit,
            isActived: this.isActived,
          }
        );

        await this.getKeyInfo();
        this.$toast("Update successfully");
        this.showSetting = false;

        this.$router.replace(
          `/ai-rpc/key/${this.name}/${this.$route.params.id}`
        );
      } catch (error) {
        console.log(error);
      }
      this.settingLoading = false;
    },

    async getActivityList() {
      try {
        const { data } = await this.$http.get(
          `$rpc/rpc/ai/manager/activities/${this.$route.params.id}?page=${
            this.page
          }&size=${this.size}${this.curModel ? `&model=${this.curModel}` : ""}`
        );
        this.activityList = data.items;
        this.total = data.total;
      } catch (error) {
        console.log(error);
      }
    },

    async getModelslist() {
      try {
        const { data } = await this.$http.get(
          `$rpc/rpc/ai/manager/activities/${this.$route.params.id}/models`
        );
        let originData = data.items.map((it) => {
          return {
            text: it,
            value: it,
          };
        });
        this.modelList = [...this.modelList, ...originData];
      } catch (error) {
        console.log(error);
      }
    },

    handleChangeModel() {
      this.page = 0;
      this.getActivityList();
    },
  },
};
</script>
<style>
.v-text-field__details {
  padding: 0 !important;
  margin-bottom: 0 !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>

<style lang="scss" scoped>
.key-info {
  .key-info-header {
    padding: 16px 16px 0 16px;
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    background: #fff;
    .key-title {
      color: #475569;
    }
    .key-secret {
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
    }
    .param-title {
      color: #475569;
      font-size: 12px;
    }
    .param-data {
      font-size: 14px;
      color: #0f172a;
    }
    .status-tag {
      padding: 4px 8px;
      border-radius: 4px;
      color: #334155;

      border: 1px solid #cbd5e1;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #cbd5e1;
    }
    .dot.active {
      background: #00bd9a;
    }
  }
  .activity {
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    background: #fff;

    .activity-list {
      min-height: 50vh;
      .no-date {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
.create-keys {
  .ipt-label {
    color: #64748b;
    font-size: 14px;
  }
}
.status-tab {
  padding: 8px 16px;
  font-size: 14;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  cursor: pointer;
}
.status-tab.active {
  border: 1px solid rgba(115, 94, 161, 0.25);
  background: #f3e8ff;
  color: #735ea1;
  font-weight: bold;
}
.limit-ipt {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  overflow: hidden;
  .land {
    padding: 8px 16px;
    border-left: 1px solid #cbd5e1;
    background: #f8fafc;
  }
}
</style>
