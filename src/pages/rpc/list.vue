<template>
  <div>
    <top-board ref="topBoard" :overViewData="overViewData" />
    <v-row class="mt-2">
      <v-col cols="12">
        <div class="api-list">
          <div class="d-flex al-c mb-8 justify-space-between">
            <span class="list-tit">My API Keys</span>
            <v-btn color="primary" @click="newCreate" :loading="createLoading">
              <img :src="require('/public/img/svg/rpc/key.svg')" width="24" />
              <span class="ml-2">Create New key</span>
            </v-btn>
          </div>
          <div class="empty-box" v-if="apiList.length == 0">
            <img src="@/assets/imgs/rpc/empty.png" width="240" />
            <div class="empty-tips">
              Please note that the RPC service in the current trial phase only
              allows you to create one free key! The creation of paid keys will
              be available soon.
            </div>
          </div>
          <div class="list-box" v-else>
            <div
              class="list-item d-flex al-c"
              v-for="item in apiList"
              :key="item.id"
              @click="toDetail(item)"
            >
              <div class="name-box">
                <div class="project-name">
                  {{ item.name }}
                  <span class="free" v-if="item.type == 'FREE'">Free</span>
                </div>
                <div class="project-tips">{{ item.notes || "-" }}</div>
              </div>
              <div class="status-box">
                <div
                  class="project-status"
                  :class="item.active ? 'active-status' : ''"
                >
                  <span class="point"></span>
                  {{ item.active ? "Active" : "Inactive" }}
                </div>
                <div class="project-tips text-center">Status</div>
              </div>
              <div class="status-box">
                <div class="project-request">{{ item.requests }}</div>
                <div class="project-tips">Requests (24hrs)</div>
              </div>
              <div>
                <img
                  :src="require('/public/img/svg/rpc/chevron-right.svg')"
                  width="24"
                />
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="newKeyShowPop" max-width="600" persistent>
      <div class="pd-30">
        <h3>Create An APl Key</h3>
        <v-form ref="form" v-model="valid">
          <div class="mt-6">
            <p>API Key Name</p>
            <div class="mt-2">
              <v-text-field
                outlined
                dense
                counter="40"
                required
                :rules="rules.name"
                v-model.trim="newAPIData.name"
                placeholder="Type in a name for your API Key"
              >
              </v-text-field>
            </div>
            <p>Notes</p>
            <div class="mt-2">
              <v-text-field
                outlined
                dense
                counter="80"
                :rules="rules.notes"
                v-model.trim="newAPIData.notes"
                placeholder="E.g., chains, networks, etc."
              >
              </v-text-field>
            </div>
          </div>

          <div class="mt-6 ta-r">
            <v-btn min-width="130" text plain tile @click="resetInput"
              >Cancel</v-btn
            >
            <v-btn
              :disabled="!valid"
              :loading="loading"
              min-width="130"
              color="primary"
              @click="setCreate"
              class="ml-4"
              >Create</v-btn
            >
          </div>
        </v-form>
      </div>
    </v-dialog>

    <v-dialog v-model="noMoreKey" max-width="600" persistent>
      <div class="pd-30">
        <h3>Create An APl Key</h3>
        <div class="mt-6">
          Please note that currently, only one API Key can be created per
          account. We will launch paid API keys soon, so stay tuned.
        </div>
        <div class="mt-6 ta-r">
          <v-btn @click="noMoreKey = false" color="primary"
            >All right, got it.</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import topBoard from "./topBoard.vue";
import { fetchOverview, fetchKeyList, sendCreateKey } from "@/api/rpc.js";
export default {
  name: "RpcList",
  components: {
    topBoard,
  },
  computed: {},
  data() {
    return {
      createLoading: true,
      valid: false,
      loading: false,
      apiList: [],
      newKeyShowPop: false,
      noMoreKey: false,
      rules: {
        name: [
          (val) => (val || "").length > 0 || "This field is required",
          (val) => (val || "").length <= 40 || "Max 40 characters",
        ],
        notes: [(val) => (val || "").length <= 80 || "Max 80 characters"],
      },
      newAPIData: {
        name: "",
        notes: "",
      },
      overViewData: {
        rate: 0,
        requests: 0,
        usage: 0,
      },
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.getOverview();
      this.$refs.topBoard.setOverView(1);
      this.getApiList();
    },
    async getOverview() {
      const { data } = await fetchOverview();
      this.overViewData = data;
    },
    async getApiList() {
      const { data } = await fetchKeyList();
      this.apiList = data;
      this.createLoading = false;
    },
    async newCreate() {
      if (this.apiList.length > 0) {
        this.noMoreKey = true;
      } else {
        this.newKeyShowPop = true;
      }
    },
    async setCreate() {
      this.loading = true;
      const newAPIData = this.newAPIData;
      await sendCreateKey(newAPIData);
      this.loading = false;
      this.resetInput();
      this.init();
    },
    resetInput() {
      this.$refs.form.reset();
      this.newAPIData = {
        name: "",
        notes: "",
      };
      this.newKeyShowPop = false;
    },
    toDetail(item) {
      this.$router.push({
        path: `/rpc/detail/${item.name}/${item.id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.api-list {
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05);
  padding: 24px;
  .list-tit {
    color: #000;
    font-size: 24px;
    font-weight: 400;
  }
  .empty-box {
    text-align: center;
    padding: 90px 0;
    .empty-tips {
      color: #64748b;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      max-width: 640px;
      margin: 0 auto;
      margin-top: 24px;
    }
  }
  .list-box {
    .list-item {
      padding: 12px 24px;
      justify-content: space-between;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      cursor: pointer;
      margin-bottom: 24px;
      .name-box {
        width: 50%;
        max-width: 660px;
      }
      .status-box {
        width: 160px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .project-name {
        color: #000;
        font-size: 20px;
        font-weight: 700;
        .free {
          padding: 2px 8px;
          border-radius: 2px;
          background: #0a9e71;
          color: #fff;
          font-size: 12px;
          font-weight: 400;
          margin-left: 8px;
        }
      }
      .project-tips {
        width: 100%;
        color: #64748b;
        font-size: 14px;
        font-weight: 400;
        margin-top: 8px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .project-status {
        color: #94a3b8;
        font-size: 20px;
        font-weight: 700;
        display: flex;
        align-items: center;
        .point {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #94a3b8;
          margin-right: 4px;
        }
      }
      .active-status {
        color: #00bd9a;
        .point {
          background-color: #00bd9a;
        }
      }
      .project-request {
        color: #000;
        font-size: 20px;
        font-weight: 700;
        text-align: center;
      }
    }
  }
}
</style>
