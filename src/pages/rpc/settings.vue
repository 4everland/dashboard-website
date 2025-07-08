<template>
  <div class="settings-page px-3">
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:item="{ item }">
          <router-link
            v-if="!item.disabled"
            :to="item.to"
            class="breadcrumb-link"
          >
            {{ item.text }}
          </router-link>
          <span v-else>
            {{ item.text }}
          </span>
        </template>
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <div>
      <div class="d-flex al-c mb-4 justify-space-between">
        <span class="list-tit">General Settings</span>
      </div>
      <v-form ref="form" v-model="valid">
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
            <v-btn
              class="mt-2"
              :disabled="!valid"
              color="primary"
              large
              @click="setKeyInfo"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <div class="mt-16">
      <div class="d-flex al-c mb-4 justify-space-between">
        <span class="list-tit">Secuity</span>
      </div>
      <v-row>
        <v-col cols="12" class="d-flex al-c">
          <v-checkbox
            v-model="enabled"
            label="Enable JWT for ALL Requests"
            @change="changeEnabled"
          ></v-checkbox>
          <a
            href="https://docs.4everland.org/rpc-beta/json-web-token-jwt"
            target="_blank"
            rel="noopener noreferrer"
            class="text-link ml-6 primary--text"
            >What's JWT?</a
          >
        </v-col>
      </v-row>
      <v-form ref="secuityForm" v-model="secuityValid">
        <v-row>
          <v-col cols="12" class="py-0" style="max-width: 560px">
            <p class="int-name">JWT Public Key Name</p>
            <div class="mt-2">
              <v-text-field
                outlined
                dense
                counter="32"
                required
                :rules="secuityRules.name"
                v-model.trim="secuityInfo.name"
                placeholder="E.g., chains, networks, etc."
              >
              </v-text-field>
            </div>
          </v-col>
          <v-col cols="12" class="py-0">
            <p class="int-name">JWT Public Key</p>
            <div class="mt-2">
              <v-textarea
                class="hide-msg"
                outlined
                v-model.trim="secuityInfo.pk"
                auto-grow
                rows="4"
              ></v-textarea>
            </div>
          </v-col>

          <v-col cols="12" class="pb-4" v-if="secuityList.length > 0">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">ID</th>
                    <th class="text-left">JWT Public Key</th>
                    <th class="text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in secuityList" :key="item.id">
                    <td>
                      <span class="name-td">
                        {{ item.name }}
                      </span>
                    </td>
                    <td>
                      <span>{{ item.id }}</span>
                      <v-btn
                        icon
                        v-clipboard="item.id"
                        @success="$toast('Copied!')"
                      >
                        <img
                          :src="require('/public/img/svg/rpc/copy.svg')"
                          width="16"
                        />
                      </v-btn>
                    </td>
                    <td class="d-flex al-c">
                      <span class="pk-td">{{ item.pk }}</span>
                      <v-btn
                        icon
                        v-clipboard="item.pk"
                        @success="$toast('Copied!')"
                      >
                        <img
                          :src="require('/public/img/svg/rpc/copy.svg')"
                          width="16"
                        />
                      </v-btn>
                    </td>
                    <td>
                      <v-btn icon @click="removeSecuity(item.id)">
                        <img
                          :src="require('/public/img/svg/rpc/remove.svg')"
                          width="24"
                        />
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col cols="12" class="pb-4">
            <div>
              <v-btn
                :disabled="!secuityValid"
                color="primary"
                large
                @click="addSecurity"
                :loading="addLoading"
                >Add</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <div class="mt-16">
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
              <v-btn icon v-clipboard="userKey" @success="$toast('Copied!')">
                <img
                  :src="require('/public/img/svg/rpc/copy.svg')"
                  width="24"
                />
              </v-btn>
            </div>
          </div>
          <div class="mt-6">
            <v-btn
              color="primary"
              large
              @click="onReset"
              :loading="resetLoading"
              >Reset</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="mt-16 mb-16">
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
            <v-btn
              color="primary"
              large
              @click="onDelete"
              :loading="deleteLoading"
              >Delete</v-btn
            >
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
  fetchSecurityMessage,
  switchSecurity,
  sendSecurity,
  deleteSecurity,
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
      valid: false,
      secuityValid: false,
      rules: {
        name: [
          (val) => (val || "").length > 0 || "This field is required",
          (val) => (val || "").length <= 40 || "Max 40 characters",
        ],
        notes: [(val) => (val || "").length <= 80 || "Max 80 characters"],
      },
      secuityRules: {
        name: [
          (val) => (val || "").length > 0 || "This field is required",
          (val) => (val || "").length <= 32 || "Max 32 characters",
        ],
      },
      enabled: false,
      keyInfo: {
        name: "",
        notes: "",
      },
      secuityList: [],
      secuityInfo: {
        name: "",
        pk: "",
      },
      userKey: "",
      addLoading: false,
      resetLoading: false,
      deleteLoading: false,
      breadcrumbsItems: [
        {
          text: "RPC",
          disabled: false,
          to: "/rpc",
        },
        {
          text: this.$route.params.name,
          disabled: false,
          to: `/rpc/detail/${this.$route.params.name}/${this.$route.params.id}`,
        },
        {
          text: "General Settings",
          disabled: true,
        },
      ],
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
      this.getSecurityMessage();
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
      this.$toast("Successful!");
      this.init();
    },
    async getSecurityMessage() {
      const id = this.id;
      const { data } = await fetchSecurityMessage(id);
      this.enabled = data.enabled;
      this.secuityList = data.list;
    },
    async changeEnabled() {
      const id = this.id;
      const params = {
        enabled: this.enabled,
      };
      await switchSecurity(id, params);
    },
    async addSecurity() {
      this.addLoading = true;
      const id = this.id;
      const params = this.secuityInfo;
      try {
        await sendSecurity(id, params);
        this.$refs.secuityForm.reset();
        this.secuityInfo = {
          name: "",
          pk: "",
        };
        this.getSecurityMessage();
      } catch (error) {
        console.log(error);
      } finally {
        this.addLoading = false;
      }
    },
    async removeSecuity(securityId) {
      const id = this.id;
      await deleteSecurity(id, securityId);
      this.getSecurityMessage();
    },
    async onReset() {
      this.$confirm(
        "After resetting, the previous key will no longer be usable. Are you sure you want to proceed with the reset?",
        "Reset the API key",
        {
          cancelText: "Cancel",
          confirmText: "Confirm",
        }
      ).then(async () => {
        this.resetLoading = true;
        const id = this.id;
        try {
          const { data } = await resetKey(id);
          this.userKey = data;
        } catch (error) {
          console.log(error);
        } finally {
          this.resetLoading = false;
        }
      });
    },
    async onDelete() {
      this.$confirm(
        "Once deleted, this API key cannot be recovered. Are you sure you want to proceed with the deletion?",
        "Delete the API key",
        {
          cancelText: "Cancel",
          confirmText: "Confirm",
        }
      ).then(async () => {
        this.deleteLoading = true;
        const id = this.id;
        try {
          await deletetKey(id);
          this.$router.push("/rpc");
        } catch (error) {
          console.log(error);
        } finally {
          this.deleteLoading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .breadcrumbs {
    position: static !important;
  }
  .v-breadcrumbs {
    padding: 0 0 16px 0;
    margin-top: -12px;
  }
}
.breadcrumbs {
  position: fixed;
  top: 0;
  left: 242px;
  z-index: 10;
}
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
  .name-td {
    display: inline-block;
    max-width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .pk-td {
    display: inline-block;
    max-width: 300px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .text-link {
    color: #735ea1;
    font-size: 14px;
    font-weight: 700;
    text-decoration-line: underline;
  }
}
</style>
