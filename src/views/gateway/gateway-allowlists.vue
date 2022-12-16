<template>
  <div class="gateway-allowlists">
    <div>
      <div class="d-flex justify-space-between al-c">
        <span class="mr-auto">User Agent</span>
        <v-switch class="hide-msg" v-model="isUserAgent" dense></v-switch>
      </div>
      <div class="fz-14 tips mt-2" v-if="!isUserAgent">
        To limit access to your application to specific user agents, add them to
        the USER AGENTS allowlist. When you enable User-Agent Allowlist, any API
        requests originating from other platforms are rejected.
      </div>
      <div v-else>
        <div class="d-flex mt-3">
          <v-text-field
            class="post-input"
            persistent-placeholder
            outlined
            dense
            ref="agentInput"
            v-model="userAgent"
            :counter="32"
            :rules="[
              (val) => {
                return val.length > 32
                  ? 'Must be less than 32 characters'
                  : true;
              },
            ]"
            label=""
          ></v-text-field>
          <v-btn
            class="ml-8"
            color="primary"
            width="120"
            @click="handleAddUserAgent"
            >Add</v-btn
          >
        </div>
        <div class="fz-14 tips">
          Tips: The USER AGENTS allowlist utilizes partial string matching. If
          the allowlisted string is present in the request's full User-Agent, it
          is registered as a match.
        </div>
        <load-list :list="userAgentList">
          <template v-slot="{ item }">
            <div class="list-item al-c justify-space-between">
              <span class="fz-14">{{ item }}</span>
              <v-btn text color="primary" @click="handleRemoveUserAgent"
                >Remove</v-btn
              >
            </div>
          </template>
        </load-list>
      </div>
    </div>
    <div class="mt-15">
      <div class="d-flex justify-space-between al-c">
        <span class="mr-auto">Origins</span>
        <v-switch class="hide-msg" v-model="isOrigins" dense></v-switch>
      </div>
      <div class="fz-14 tips mt-2" v-if="!isOrigins">
        To limit access to your application to specific URLs, add them to the
        Origins allowlist. When you enable Origins Allowlist, any API requests
        originating from other platforms are rejected.
      </div>

      <div v-else>
        <div class="al-c">
          <span class="mr-5 fz-14">Always allow access</span>
          <v-radio-group
            v-model="radioGroup"
            @change="handleChangeAllowAccess"
            class="hide-msg assess-address"
            row
          >
            <v-radio
              v-for="n in allowAccess"
              :key="n.value"
              :label="n.text"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </div>
        <div class="d-flex mt-3" v-if="!isBulkOperation">
          <v-text-field
            class="post-input"
            persistent-placeholder
            outlined
            v-model="origin"
            dense
            ref="originInput"
            :counter="64"
            :rules="[
              (val) => {
                return this.$regMap.domain.test(val)
                  ? true
                  : 'Must be a top-level or second-level domain with less than 64 characters';
              },
              (val) => {
                return val.length > 64
                  ? 'Must be a domain name with less than 64 characters'
                  : true;
              },
            ]"
            label=""
          ></v-text-field>
          <v-btn
            class="ml-8"
            color="primary"
            width="120"
            @click="handleAddOrigins"
            >Add</v-btn
          >
        </div>
        <div class="fz-14 tips" v-if="!isBulkOperation">
          Tips: Origin allowlists support wildcard subdomain patterns.
        </div>
        <load-list :list="originsList" v-if="!isBulkOperation">
          <template v-slot="{ item, index }">
            <div class="list-item al-c justify-space-between origin-item px-4">
              <span class="fz-14">{{ item }}{{ index }}</span>
              <v-btn text color="primary" @click="handleRemoveOrigin(item)"
                >Remove</v-btn
              >
            </div>
          </template>
        </load-list>

        <div v-if="isBulkOperation">
          <v-textarea
            outlined
            name="input-7-4"
            :value="bulkOrigins"
          ></v-textarea>
          <div class="al-c mt-4">
            <span class="tips fz-14"
              >Please use ';' to split URLs, click the SAVE button after
              modification</span
            >
            <v-btn color="primary" width="120" @click="onBulkSave">Save</v-btn>
          </div>
        </div>
        <span class="cursor-p" @click="handleBulkOperation"
          >Bulk Operation</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          name: "",
          scope: "",
        };
      },
    },
  },
  data() {
    return {
      isUserAgent: false,
      isOrigins: false,
      userAgent: "",
      origin: "",
      userAgentList: [],
      originsList: [],
      allowAccess: [
        {
          text: "Yes",
          value: true,
        },
        {
          text: "No",
          value: false,
        },
      ],
      radioGroup: false,
      isBulkOperation: false,
    };
  },
  computed: {
    bulkOrigins() {
      return this.originsList.join(";");
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.isUserAgent = this.info.enableUserAgent;
      this.isOrigins = this.info.enableOrigin;
      this.userAgentList = this.info.userAgents;
      this.originsList = this.info.origins;
      this.radioGroup = this.info.allowBlankOrigin;
    },
    async handleAddUserAgent() {
      try {
        this.$loading();
        const userAgents = JSON.parse(JSON.stringify(this.userAgentList));
        userAgents.push(this.userAgent);
        await this.$http.put(
          `$gateway/gateway/${this.info.name}/useragent`,
          {
            userAgents,
          },
          {
            noTip: 1,
          }
        );
        this.userAgent = "";
        this.$emit("handleEvent");
        this.$loading.close();
      } catch (error) {
        console.log(error);
        if (
          error.message ==
          "ParamsError: origins or useragent exceed the limit error"
        ) {
          this.$alert(
            "Maximum allowed is 20 user-agents. In case of capacity expansion, please contact us."
          );
        } else {
          this.$alert(error.message);
        }
      }
    },
    async handleAddOrigins() {
      try {
        this.$loading();
        const origins = JSON.parse(JSON.stringify(this.originsList));
        origins.push(this.origin);
        await this.$http.put(
          `$gateway/gateway/${this.info.name}/origin`,
          {
            origins,
            allowBlankOrigin: this.radioGroup,
          },
          {
            noTip: 1,
          }
        );
        this.origin = "";
        this.$emit("handleEvent");
        this.$loading.close();
      } catch (error) {
        //
        if (
          error.message ==
          "ParamsError: origins or useragent exceed the limit error"
        ) {
          this.$alert(
            "Maximum allowed is 100 domains. In case of capacity expansion, please contact us."
          );
        } else {
          this.$alert(error.message);
        }
      }
    },
    async handleRemoveUserAgent(item) {
      this.$loading();
      const userAgents = JSON.parse(JSON.stringify(this.userAgentList));
      let index = userAgents.findIndex((it) => it == item);
      userAgents.splice(index, 1);
      try {
        await this.$http.put(`$gateway/gateway/${this.info.name}/useragent`, {
          userAgents,
        });
        this.$emit("handleEvent");
      } catch (error) {
        //
        console.log(error);
      }
      this.$loading.close();
    },
    async handleRemoveOrigin(item) {
      this.$loading();
      const origins = JSON.parse(JSON.stringify(this.originsList));
      let index = origins.findIndex((it) => it == item);
      origins.splice(index, 1);
      try {
        await this.$http.put(`$gateway/gateway/${this.info.name}/origin`, {
          origins,
          allowBlankOrigin: this.radioGroup,
        });
        this.$emit("handleEvent");
      } catch (error) {
        //
        console.log(error);
      }
      this.$loading.close();
    },
    async openOrigin(val) {
      try {
        this.$loading();
        await this.$http.put(`$gateway/gateway/${this.info.name}/origin`, {
          origins: [],
          allowBlankOrigin: val,
        });
        this.origin = "";
        this.$emit("handleEvent");
      } catch (error) {
        //
        console.log(error);
      }
      this.$loading.close();
    },
    async handleChangeAllowAccess() {
      try {
        this.$loading();
        await this.$http.put(`$gateway/gateway/${this.info.name}/origin`, {
          origins: this.originsList,
          allowBlankOrigin: this.radioGroup,
        });
        this.origin = "";
        this.$emit("handleEvent");
      } catch (error) {
        //
        console.log(error);
      }
      this.$loading.close();
    },
    handleBulkOperation() {
      this.isBulkOperation = true;
    },
    async onBulkSave() {
      console.log(11);
    },
  },
  watch: {
    async isOrigins(val) {
      if (this.info.enableOrigin == val) return;
      this.openOrigin(val);
    },
    info() {
      this.initData();
    },
    origin(val) {
      if (!val) {
        this.$refs.originInput.resetValidation();
      }
    },
    userAgent(val) {
      if (!val) {
        this.$refs.agentInput.resetValidation();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.gateway-allowlists {
  transition: all 3s ease;
}
::v-deep .assess-address {
  margin-top: 0;
}
.tips {
  color: #889ab3;
}
.list-item {
  padding: 5px 0;
  height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid #d0dae9;
}
.origin-item {
  background: #f7fafb;
}
</style>