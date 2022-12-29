<template>
  <div class="gateway-allowlists">
    <!-- <div>
      <div class="d-flex justify-space-between al-c">
        <span class="mr-auto">User Agent</span>
        <v-switch
          class="hide-msg"
          @change="handleChangeUserAgent"
          v-model="isUserAgent"
          dense
        ></v-switch>
      </div>
      <div class="fz-14 tips mt-2" v-if="!isUserAgent">
        When user-agent is enabled, only API requests with the user-agent
        parameter defined in Allowlist are allowed to use the dedicated gateway,
        and all other API requests are rejected, according to Allowlist.
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
                return val && val.length > 32
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
            :disabled="userAgent == ''"
            @click="handleAddUserAgent"
            >Add</v-btn
          >
        </div>
        <div class="fz-14 tips">
          Tips: The USER AGENTS allowlist utilizes partial string matching. If
          the allowlisted string is present in the request's full User-Agent, it
          is registered as a match.
        </div>
        <div class="fz-14 mt-5 tips-warning" v-show="userAgentList.length == 0">
          When this is enabled but no User-agent is added, it is regarded as
          disabled.
        </div>
        <load-list :list="userAgentList">
          <template v-slot="{ item }">
            <div class="list-item al-c justify-space-between">
              <span class="fz-14">{{ item }}</span>
              <v-btn text color="primary" @click="handleRemoveUserAgent(item)"
                >Remove</v-btn
              >
            </div>
          </template>
        </load-list>
      </div>
    </div> -->
    <div>
      <div class="d-flex justify-space-between al-c">
        <span class="mr-auto">Origins</span>
        <v-switch
          class="hide-msg"
          @change="handleChangeOrigins"
          v-model="isOrigins"
          dense
        ></v-switch>
      </div>
      <div class="fz-14 tips mt-2" v-if="!isOrigins">
        When Origins is enabled, only API requests with the Origins parameter
        defined in Allowlist are allowed to use the dedicated gateway, and all
        other API requests are rejected, according to Allowlist.
      </div>

      <div v-else>
        <!-- <div class="al-c">
          <span class="mr-5 fz-14">Always allow access via address bar?</span>
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
        </div> -->
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
                return this.$regMap.secondLevelDomain.test(val) || !val
                  ? true
                  : 'Must be a top-level or second-level english domain with less than 64 characters';
              },
              (val) => {
                return val && val.length > 64
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
            :disabled="origin == ''"
            @click="handleAddOrigins"
            >Add</v-btn
          >
        </div>
        <div class="fz-14 tips" v-if="!isBulkOperation">
          Tips: Origin allowlists support wildcard subdomain patterns.
        </div>
        <div class="fz-14 mt-4 tips-warning" v-if="originsList.length == 0">
          Your current configuration only allows you to access the gateway via
          the address bar.
        </div>
        <load-list class="mt-4" :list="originsList" v-if="!isBulkOperation">
          <template v-slot="{ item }">
            <div class="list-item al-c justify-space-between">
              <span class="fz-14">{{ item }}</span>
              <v-btn text color="primary" @click="handleRemoveOrigin(item)"
                >Remove</v-btn
              >
            </div>
          </template>
        </load-list>

        <div v-if="isBulkOperation" class="mt-4">
          <v-textarea
            outlined
            name="input-7-4"
            height="300"
            v-model="bulkOriginsStr"
            ref="originArea"
            :rules="textAreaRules"
            :spellcheck="false"
          ></v-textarea>
          <div class="al-c mt-4">
            <span class="tips fz-14 mr-auto"
              >Please use ';' to split URLs, click the SAVE button after
              modification</span
            >
            <v-btn color="primary" width="120" @click="onBulkSave">Save</v-btn>
          </div>
        </div>
        <span
          v-show="!isBulkOperation"
          class="cursor-p fz-14"
          style="color: #775da6"
          @click="handleBulkOperation"
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
      bulkOriginsStr: [],
      textAreaRules: [
        (val) => {
          const arr = val.split(";");
          if (arr.length > 100) {
            return "Maximum allowed is 100 URLs. In case of capacity expansion, please contact us.";
          }
          for (const it of arr) {
            console.log(this.$regMap.secondLevelDomain.test(it));
            if (!this.$regMap.secondLevelDomain.test(it) && it != "") {
              return "Must be a top-level or second-level english domain";
            }
          }
          return true;
        },
      ],
    };
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
        if (!this.$refs.agentInput.valid) return;
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
        this.$refs.agentInput.reset();
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
        if (!this.$refs.originInput.valid) return;
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
        this.$refs.originInput.reset();
        this.$emit("handleEvent");
        this.$loading.close();
      } catch (error) {
        //
        if (
          error.message ==
          "ParamsError: origins or useragent exceed the limit error"
        ) {
          let html =
            'Maximum allowed is 100 domains. In case of capacity expansion, please <a href="http://discord.gg/4everland" target="__blank">contact us</a> .';
          this.$alert(html);
        } else {
          this.$alert(error.message);
        }
      }
    },
    async handleRemoveUserAgent(item) {
      this.$loading();
      let userAgents = JSON.parse(JSON.stringify(this.userAgentList));
      userAgents = userAgents.filter((it) => it != item);
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
      let origins = JSON.parse(JSON.stringify(this.originsList));
      origins = origins.filter((it) => it != item);
      try {
        if (!this.radioGroup && this.originsList.length == 1) {
          await this.$confirm(
            "Empty origins while disabling gateway access from the address bar will disable the Origins Allowlists, Are you sure you want to disable the allowlist?",
            "",
            {
              cancelText: "Cancel",
              confirmText: "Disable",
              persistent: true,
            }
          );
        }
        this.$loading();
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

    async handleChangeUserAgent(val) {
      if (!val && this.userAgentList.length) {
        try {
          await this.$confirm(
            "Disabling it will clear your user-agents allowlisit configuration. Please confirm before proceeding.",
            "",
            {
              cancelText: "Cancel",
              confirmText: "Disiable",
              persistent: true,
            }
          );
          this.$loading();
          await this.$http.put(`$gateway/gateway/${this.info.name}/useragent`, {
            userAgents: [],
          });
          this.$emit("handleEvent");
        } catch (error) {
          this.isUserAgent = true;
        }
        this.$loading.close();
      }
      this.userAgent = "";
    },
    async handleChangeOrigins(val) {
      if (!val && this.originsList.length) {
        try {
          await this.$confirm(
            "Disabling it will clear your Origin allowlisit configuration. Please confirm before proceeding.",
            "",
            {
              cancelText: "Cancel",
              confirmText: "Disiable",
              persistent: true,
            }
          );
          this.$loading();
          this.origin = "";
          await this.$http.put(`$gateway/gateway/${this.info.name}/origin`, {
            origins: [],
            allowBlankOrigin: false,
          });
          this.$emit("handleEvent");
        } catch (error) {
          this.isOrigins = true;
        }
        this.$loading.close();
      } else {
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
      }
      this.isBulkOperation = false;
    },
    async handleChangeAllowAccess(val) {
      if (!val && this.originsList.length == 0)
        return this.$alert(
          "Please enter one URL below if you want to disable gateway access from the address bar."
        ).then(() => {
          this.radioGroup = true;
        });
      try {
        this.$loading();
        await this.$http.put(`$gateway/gateway/${this.info.name}/origin`, {
          origins: this.originsList,
          allowBlankOrigin: this.radioGroup,
        });
        this.$refs.originInput.reset();
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
      let origins = this.bulkOriginsStr.split(";");
      origins = origins.filter((it) => {
        return it != "";
      });
      try {
        if (!this.$refs.originArea.valid) return;
        if (!this.radioGroup && this.bulkOriginsStr == "") {
          await this.$confirm(
            "Empty origins while disabling gateway access from the address bar will disable the Origins Allowlists, Are you sure you want to disable the allowlist?",
            "",
            {
              cancelText: "Cancel",
              confirmText: "Disable",
              persistent: true,
            }
          );
        }
        this.$loading();
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
        if (/^OriginError/.test(error.message)) {
          this.$alert(
            "Save failed. Please ensure that each entry is a top or second level domain english name with no more than 64 characters."
          );
        }
        if (
          error.message ==
          "ParamsError: origins or useragent exceed the limit error"
        ) {
          let html =
            'Maximum allowed is 100 domains. In case of capacity expansion, please <a href="http://discord.gg/4everland" target="__blank">contact us</a>.';
          this.$alert(html);
        } else {
          this.$alert(error.message);
        }
      }
      this.isBulkOperation = false;
    },
  },
  watch: {
    info() {
      this.initData();
    },
    isBulkOperation() {
      this.bulkOriginsStr = this.originsList.join(";");
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
.tips-warning {
  color: #ff6b6b;
}
.list-item {
  padding: 5px 0;
  height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid #d0dae9;
}
</style>