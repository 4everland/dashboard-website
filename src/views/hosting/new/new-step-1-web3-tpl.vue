<template>
  <div class="main-wrap" style="min-height: 551px">
    <e-platform :platform.sync="form.platform"></e-platform>
    <h3 style="margin-top: 56px">The Project Name</h3>
    <v-text-field
      class="mt-4"
      persistent-placeholder
      outlined
      placeholder="Enter the project name"
      v-model="form.projectName"
      dense
      :rules="[(v) => !!(v || '').trim() || 'Please enter a project name']"
    ></v-text-field>

    <h3 style="margin-top: 48px; margin-bottom: 36px">Edit Configurations</h3>
    <v-row>
      <template v-for="(it, i) in configJson">
        <v-col cols="12" :md="it.group || it.col == 1 ? 12 : 6" :key="i">
          <template v-if="it.groupName">
            <div class="fz-17 mb-3">{{ it.groupName }}</div>
            <div class="group-container pa-6">
              <!-- group -->
              <v-row>
                <v-col
                  cols="12"
                  :md="
                    group.options.some(
                      (it) => it.type == 'table' || it.type == 'switch'
                    )
                      ? 12
                      : 6
                  "
                  v-for="group in it.group"
                  :key="group.name"
                >
                  <div class="mb-2">{{ group.name }}</div>
                  <template v-for="(item, idx) in group.options">
                    <v-text-field
                      v-if="item.type == 'text'"
                      :key="idx"
                      class="mt-4 hide-msg"
                      persistent-placeholder
                      outlined
                      :placeholder="item.placeholder"
                      v-model="item.value"
                      dense
                    ></v-text-field>
                    <div v-if="item.type == 'table'" :key="idx" class="pos-r">
                      <div class="pos-a right-0" style="top: -40px">
                        <v-btn
                          color="primary"
                          width="130"
                          @click="handleAdd(item.headers)"
                          >Add</v-btn
                        >
                      </div>
                      <v-data-table
                        :items="item.items"
                        :headers="[
                          ...item.headers,
                          { text: 'Action', value: 'action' },
                        ]"
                        hide-default-footer
                        disable-pagination
                      >
                        <template #item.action="{ index }">
                          <img
                            class="cursor-p"
                            @click="handleDeleteTableData(item.items, index)"
                            src="/img/svg/hosting/decrement.svg"
                            width="20"
                            alt=""
                          />
                        </template>
                      </v-data-table>

                      <v-dialog v-model="showTableAdd" max-width="500">
                        <div class="pa-5">
                          <div v-for="it in tableForm" :key="it.value">
                            <v-text-field
                              v-if="it.value != 'action'"
                              persistent-placeholder
                              v-model="it.value1"
                              :label="it.text"
                            ></v-text-field>
                          </div>
                          <v-btn
                            color="primary"
                            @click="handleSaveTable(item.items)"
                            >Save</v-btn
                          >
                        </div>
                      </v-dialog>
                    </div>
                    <div
                      v-if="item.type == 'switch'"
                      :key="idx"
                      class="d-flex al-c switch-config-item"
                    >
                      <span class="fz-14">{{ item.text }}</span>
                      <v-switch
                        class="hide-msg mt-0 ml-4"
                        v-model="item.value"
                      ></v-switch>
                    </div>
                  </template>
                </v-col>
              </v-row>
            </div>
          </template>
          <template v-else>
            <div class="mb-3">{{ it.name }}</div>
            <template v-for="(item, idx) in it.options">
              <v-text-field
                v-if="item.type == 'text'"
                :key="idx"
                class="mt-4 hide-msg"
                persistent-placeholder
                outlined
                :placeholder="item.placeholder"
                v-model="item.value"
                dense
              ></v-text-field>
              <div v-if="item.type == 'table'" :key="idx" class="pos-r">
                <div class="pos-a right-0" style="top: -40px">
                  <v-btn color="primary" tile @click="handleAdd(item.headers)"
                    >Add</v-btn
                  >
                </div>
                <v-data-table
                  :items="item.items"
                  :headers="[
                    ...item.headers,
                    { text: 'Action', value: 'action' },
                  ]"
                  hide-default-footer
                  disable-pagination
                >
                  <template #item.action="{ index }">
                    <img
                      class="cursor-p"
                      @click="handleDeleteTableData(item.items, index)"
                      src="/img/svg/hosting/decrement.svg"
                      width="20"
                      alt=""
                    />
                  </template>
                </v-data-table>

                <v-dialog v-model="showTableAdd" max-width="500">
                  <div class="pa-5">
                    <div v-for="it in tableForm" :key="it.value">
                      <v-text-field
                        v-if="it.value != 'action'"
                        persistent-placeholder
                        v-model="it.value"
                        :label="it.text"
                      ></v-text-field>
                    </div>
                    <v-btn color="primary" @click="handleSaveTable(item.items)"
                      >Save</v-btn
                    >
                  </div>
                </v-dialog>
              </div>
              <div
                v-if="item.type == 'switch'"
                :key="idx"
                class="d-flex al-c switch-config-item"
              >
                <span class="fz-14">{{ item.text }}</span>
                <v-switch
                  class="hide-msg mt-0 ml-4"
                  v-model="item.value"
                ></v-switch>
              </div>
            </template>
          </template>
        </v-col>
      </template>
    </v-row>

    <div class="d-flex justify-center mt-7">
      <v-btn color="primary" min-width="100" @click="onDeploy">Deploy</v-btn>
      <v-btn outlined class="ml-6" min-width="100" @click="$emit('back')"
        >Back</v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      platList: [
        {
          label: "IPFS",
          name: "IPFS",
          icon: "h-ipfs.svg",
        },
        {
          label: "Arweave",
          name: "AR",
          icon: "h-ar.svg",
        },
        {
          label: "Greenfield",
          name: "GREENFIELD",
          icon: "h-greenfield.svg",
        },
        {
          label: "Internet Computer",
          name: "IC",
          icon: "h-ic.svg",
        },
      ],
      form: {
        platform: "IPFS",
        projectName: "",
        web3TemplateId: null,
      },
      configJson: {},
      showTableAdd: false,
      tableForm: [],
    };
  },
  created() {
    this.parseJson();
    this.form.web3TemplateId = this.$route.query.id;
  },
  methods: {
    parseJson() {
      const configJson = JSON.parse(localStorage.curTplJson);
      console.log(configJson);
      let tags = configJson.config.filter((it) => it.tag).map((it) => it.tag);
      tags = this.unique(tags);
      this.configJson = this.tagGrouping(tags, configJson.config);
    },
    async onDeploy() {
      try {
        // const valid = await this.$refs.iptForm.validate();
        // console.log(valid);
        // if (!valid) return;
        let configJson = {
          config: [],
        };
        this.configJson.forEach((it) => {
          if (it.groupName) {
            configJson.config.push(...it.group);
          } else {
            configJson.config.push(it);
          }
        });
        console.log(configJson);
        // return;
        this.$loading();
        const { data } = await this.$http.post(
          "$hosting/template/web3/project/create",
          {
            ...this.form,
            configJson: JSON.stringify(configJson),
          },
          {
            noTip: 1,
          }
        );
        const {
          data: { taskId },
        } = await this.$http.post(
          `$hosting/project/task/cid/${data.projectId}/deploy/create`
        );
        this.$emit("onWeb3TplDeploy", {
          projectId: data.projectId,
          taskId: taskId,
        });
      } catch (error) {
        const { data = {} } = error.response || {};
        let msg = data.message || error.message;
        await this.$alert(msg);
      }
      this.$loading.close();
    },
    unique(arr) {
      return arr.filter(function (item, index, arr) {
        return arr.indexOf(item, 0) === index;
      });
    },
    tagGrouping(group, arr) {
      let configs = [];
      group.forEach((it) => {
        let group = { groupName: it, group: [], col: 2 };
        configs.push(group);
        for (const configItem of arr) {
          if (configItem.tag == it) {
            group.group.push(configItem);
          }
        }
      });
      const noTags = arr
        .filter((it) => !it.tag)
        .map((it) => {
          console.log(it);
          if (it.options.some((it) => it.type == "table")) {
            it.col = 1;
          }
          return it;
        });
      configs = configs.concat(noTags);
      console.log(configs);
      return configs;
    },
    onBack() {
      this.$router.back();
      this.curStep -= 1;
    },

    handleAdd(headers) {
      let transferHeader = JSON.parse(JSON.stringify(headers));
      this.tableForm = transferHeader
        .map((it) => {
          it.value1 = "";
          return it;
        })
        .filter((it) => it.text != "Action");
      this.showTableAdd = true;
    },
    handleDeleteTableData(list, i) {
      list.splice(i, 1);
      console.log(i);
    },
    handleSaveTable(tableData) {
      let tableForm = {};
      this.tableForm.forEach((it) => {
        this.$set(tableForm, it.value, it.value1);
      });
      tableData.push(tableForm);
      this.showTableAdd = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.plat-item {
  padding: 14px 12px;
  background: #eef0f4;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
  &.active {
    background: #634695;
    color: #fff;
  }
}
.beta-icon {
  position: absolute;
  right: -55px;
  top: -7px;
}
.ipfs-input ::v-deep .v-input__slot {
  background: #f7f7f7 !important;
  border-radius: 2px;
  box-shadow: none !important;
}
.tips {
  color: #889ab3;
}

::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details {
  margin: 0 !important;
}
.group-container {
  border: 1px solid rgba(140, 140, 161, 0.25);
  border-radius: 8px;
}
.switch-config-item {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid rgba(140, 140, 161, 0.25);
}
</style>
