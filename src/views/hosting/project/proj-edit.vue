<template>
  <div>
    <v-skeleton-loader
      v-if="JSON.stringify(configJson) == '{}'"
      type="article"
    ></v-skeleton-loader>
    <div v-else class="main-wrap">
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
                    <div class="mb-3">{{ group.name }}</div>
                    <template v-for="(item, idx) in group.options">
                      <v-text-field
                        v-if="item.type == 'text'"
                        :key="idx"
                        class="mt-4"
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
                            tile
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
                  class="mt-4"
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
            </template>
          </v-col>
        </template>
      </v-row>
      <div class="al-c justify-center mt-8">
        <v-btn
          width="100"
          color="primary"
          @click="handleDeploy"
          :disabled="disableDeploy"
          >Deploy</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      configJson: {},
      showTableAdd: false,
      tableForm: [],
    };
  },
  props: {
    active: Boolean,
  },
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      userInfo: (s) => s.userInfo,
    }),
    disableDeploy() {
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
      return this.info.configJson == JSON.stringify(configJson);
    },
  },
  created() {
    this.getConfigJson();
  },
  methods: {
    getConfigJson() {
      const configJson = JSON.parse(this.info.configJson);
      let tags = configJson.config.filter((it) => it.tag).map((it) => it.tag);
      tags = this.unique(tags);
      this.configJson = this.tagGrouping(tags, configJson.config);
    },

    async handleDeploy() {
      try {
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

        await this.$confirm(
          "The changes will take effect after redeployment. Are you sure you want to proceed?",
          "Tip"
        );
        this.$loading();
        const { data } = await this.$http.post(
          "$hosting/template/web3/project/redeploy",
          {
            web3TemplateId: this.info.web3TemplateId,
            configJson: JSON.stringify(configJson),
            projectId: this.info.id,
          }
        );
        this.$router.push(
          `/hosting/build/${this.info.name}/${this.info.id}/${data.taskId}`
        );
      } catch (error) {
        console.log(error);
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
          if (
            it.options.some((it) => it.type == "table" || it.type == "switch")
          ) {
            it.col = 1;
          }
          return it;
        });
      configs = configs.concat(noTags);
      return configs;
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
  watch: {
    active(val) {
      if (val) this.getConfigJson();
    },
  },
};
</script>

<style lang="scss" scoped>
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