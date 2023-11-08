<template>
  <div class="settings-page">
    <div>
      <div class="d-flex al-c mb-4 justify-space-between">
        <span class="list-tit">General Settings</span>
      </div>
      <v-row>
        <v-col cols="12" md="6" class="py-0">
          <p class="int-name">API Key Name</p>
          <div class="mt-2">
            <v-text-field
              outlined
              dense
              counter="40"
              required
              :rules="rules.name"
              v-model.trim="keyInfo.name"
              placeholder="Type in a name for your API Key"
            >
            </v-text-field>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="py-0">
          <p class="int-name">Notes</p>
          <div class="mt-2">
            <v-text-field
              outlined
              dense
              counter="80"
              v-model.trim="keyInfo.notes"
              placeholder="E.g., chains, networks, etc."
            >
            </v-text-field>
          </div>
        </v-col>
        <v-col cols="12" class="py-0">
          <p class="int-name">API Key Status</p>
          <div class="mt-2" style="width: 220px">
            <e-radio-btn
              class="ml-auto"
              minWidth="110px"
              minHeight="32px"
              :options="typeList"
              v-model="typeIdx"
            ></e-radio-btn>
          </div>
        </v-col>
        <v-col cols="12">
          <v-btn color="primary" large @click="setKeyInfo"> Save </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="mt-6">
      <div class="d-flex al-c mb-4 justify-space-between">
        <span class="list-tit">Secuity</span>
      </div>
      <v-row>
        <v-col cols="12" class="py-0">
          <v-checkbox
            v-model="checkbox"
            label="Enable JWT for ALL Requests"
          ></v-checkbox>
        </v-col>
        <v-col cols="12" class="py-0" style="max-width: 560px">
          <p class="int-name">JWT Public Key Name</p>
          <div class="mt-2">
            <v-text-field
              outlined
              dense
              counter="80"
              v-model.trim="keyInfo.notes"
              placeholder="E.g., chains, networks, etc."
            >
            </v-text-field>
          </div>
        </v-col>
        <v-col cols="12" class="py-0">
          <p class="int-name">JWT Public Key</p>
          <div class="mt-2">
            <v-textarea outlined value="" auto-grow rows="4"></v-textarea>
          </div>
        </v-col>
        <v-col cols="12" class="py-0">
          <div>
            <v-btn color="primary" large>Add</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="mt-6 mb-16">
      <div class="d-flex al-c mb-4 justify-space-between">
        <span class="list-tit">Reset</span>
      </div>
      <v-row>
        <v-col cols="12" class="py-0">
          <span class="api-key-tips">
            If your API key has been compromised, you can reset it. Please note
            that resetting it is irreversible and cannot be undone.
          </span>
          <div class="d-flex al-c">
            <div class="api-key-box">
              <span>{{ userKey }}</span>
              <img :src="require('/public/img/svg/rpc/copy.svg')" width="24" />
            </div>
          </div>
          <div class="mt-6">
            <v-btn color="primary" large @click="onReset">Reset</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="mt-6 mb-16">
      <div class="d-flex al-c mb-4 justify-space-between">
        <span class="list-tit">Delete</span>
      </div>
      <v-row>
        <v-col cols="12" class="py-0">
          <span class="api-key-tips">
            Once the APl key is deleted, it cannot be recovered. Please proceed
            with caution.
          </span>
          <div class="mt-6">
            <v-btn color="primary" large @click="onDelete">Delete</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import {
  fetchKeyDetail,
  fetchKeyDetailInfo,
  sendKeyDetailInfo,
  resetKey,
  deletetKey,
} from "@/api/rpc.js";

export default {
  data() {
    return {
      name: "",
      id: "",
      typeList: ["Active", "Inactive"],
      typeIdx: 0,
      rules: {
        name: [(val) => (val || "").length > 0 || "This field is required"],
      },
      checkbox: true,
      keyInfo: {
        name: "",
        notes: "",
      },
      userKey: "",
    };
  },
  created() {
    this.name = this.$route.params.name;
    this.id = this.$route.params.id;
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.getKeyInfo();
      this.getKey();
    },
    async getKey() {
      const id = this.id;
      const { data } = await fetchKeyDetail(id);
      this.userKey = data.userKey;
    },
    async getKeyInfo() {
      const id = this.id;
      const { data } = await fetchKeyDetailInfo(id);
      this.keyInfo.name = data.name;
      this.keyInfo.notes = data.notes;
      if (data.active) {
        this.typeIdx = 0;
      } else {
        this.typeIdx = 1;
      }
    },
    async setKeyInfo() {
      const id = this.id;
      let keyInfo = this.keyInfo;
      if (this.typeIdx == 0) {
        keyInfo.active = true;
      } else {
        keyInfo.active = false;
      }
      await sendKeyDetailInfo(id, keyInfo);
      this.init();
    },
    async onReset() {
      const id = this.id;
      await resetKey(id);
    },
    async onDelete() {
      const id = this.id;
      await deletetKey(id);
      this.$router.push("/rpc");
    },
  },
};
</script>

<style lang="scss" scoped>
.settings-page {
  .list-tit {
    color: #000;
    font-size: 24px;
    font-weight: 400;
  }
  .int-name {
    color: #64748b;
    font-size: 14px;
    font-weight: 400;
  }
  .api-key-tips {
    display: block;
    color: #000;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 16px;
  }
  .api-key-box {
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: #f1f5f9;
    gap: 253px;
  }
}
</style>
