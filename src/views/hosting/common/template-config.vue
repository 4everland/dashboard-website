<template>
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
                    (it) =>
                      it.type == 'table' ||
                      it.type == 'switch' ||
                      it.type == 'textarea'
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
                  <div v-if="item.type == 'select'" :key="idx">
                    <v-select
                      v-model="item.selected"
                      :items="item.items"
                      dense
                      outlined
                      persistent-placeholder
                      :placeholder="item.placeholder"
                      class="hide-msg mt-4"
                    ></v-select>
                  </div>

                  <div v-if="item.type == 'textarea'" :key="idx">
                    <v-textarea
                      outlined
                      class="mt-4 hide-msg"
                      persistent-placeholder
                      :placeholder="item.placeholder"
                      v-model="item.value"
                    ></v-textarea>
                  </div>
                  <div v-if="item.type == 'table'" :key="idx" class="pos-r">
                    <div class="pos-a right-0" style="top: -40px">
                      <v-btn
                        color="primary"
                        width="130"
                        @click="handleAdd(item.headers, item.items)"
                        >Add</v-btn
                      >
                    </div>
                    <v-data-table
                      :items="item.items"
                      :headers="handleInitheader(item.headers)"
                      hide-default-footer
                      disable-pagination
                    >
                      <template #item.action="{ index }">
                        <div class="al-c" style="justify-content: flex-end">
                          <img
                            class="cursor-p"
                            @click="
                              handleEditTableData(
                                item.headers,
                                item.items,
                                index
                              )
                            "
                            src="/img/svg/hosting/edit.svg"
                            width="20"
                            alt=""
                          />
                          <img
                            class="cursor-p ml-6"
                            @click="handleDeleteTableData(item.items, index)"
                            src="/img/svg/hosting/decrement.svg"
                            width="20"
                            alt=""
                          />
                        </div>
                      </template>
                    </v-data-table>
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

            <div v-if="item.type == 'select'" :key="idx">
              <v-select
                v-model="item.selected"
                :items="item.items"
                dense
                outlined
                persistent-placeholder
                :placeholder="item.placeholder"
                class="hide-msg mt-4"
              ></v-select>
            </div>
            <div v-if="item.type == 'textarea'" :key="idx">
              <v-textarea
                outlined
                class="mt-4 hide-msg"
                persistent-placeholder
                :placeholder="item.placeholder"
                v-model="item.value"
              ></v-textarea>
            </div>

            <div v-if="item.type == 'table'" :key="idx" class="pos-r">
              <div class="pos-a right-0" style="top: -40px">
                <v-btn
                  color="primary"
                  width="130"
                  @click="handleAdd(item.headers, item.items)"
                  >Add</v-btn
                >
              </div>
              <v-data-table
                :items="item.items"
                :headers="handleInitheader(item.headers)"
                hide-default-footer
                disable-pagination
              >
                <template #item.action="{ index }">
                  <div class="al-c" style="justify-content: flex-end">
                    <img
                      class="cursor-p"
                      @click="
                        handleEditTableData(item.headers, item.items, index)
                      "
                      src="/img/svg/hosting/edit.svg"
                      width="20"
                      alt=""
                    />
                    <img
                      class="cursor-p ml-6"
                      @click="handleDeleteTableData(item.items, index)"
                      src="/img/svg/hosting/decrement.svg"
                      width="20"
                      alt=""
                    />
                  </div>
                </template>
              </v-data-table>
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

    <v-dialog v-model="showTableAdd" max-width="500">
      <div class="pa-6">
        <h2 class="mb-5">Add Items</h2>
        <div v-for="it in tableForm" :key="it.value" class="px-3">
          <v-text-field
            v-if="it.value != 'action'"
            persistent-placeholder
            v-model="it.value1"
            :label="it.text"
          ></v-text-field>
        </div>
        <div class="al-c justify-center mt-3">
          <v-btn width="200" color="primary" @click="handleSaveTable"
            >Save</v-btn
          >
        </div>
      </div>
    </v-dialog>
    <v-dialog v-model="showTableEdit" max-width="500">
      <div class="pa-6">
        <h2 class="mb-5">Edit Items</h2>
        <div v-for="it in tableForm" :key="it.value" class="px-3">
          <v-text-field
            v-if="it.value != 'action'"
            persistent-placeholder
            v-model="it.value1"
            :label="it.text"
          ></v-text-field>
        </div>
        <div class="al-c justify-center mt-2">
          <v-btn width="200" color="primary" @click="handleEditTable"
            >Save</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    configJson: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showTableAdd: false,
      showTableEdit: false,
      curEditIndex: 0,
      tableForm: [],
      curTableData: {},
    };
  },
  methods: {
    handleInitheader(headers) {
      let tableHeaders = [];
      tableHeaders = headers.map((it) => {
        return {
          ...it,
          sortable: false,
        };
      });
      tableHeaders.push({
        text: "Action",
        value: "action",
        sortable: false,
        align: "end",
      });
      return tableHeaders;
    },
    handleAdd(headers, tableData) {
      this.tableForm = headers
        .map((it) => {
          return {
            ...it,
            value1: "",
          };
        })
        .filter((it) => it.text != "Action");
      this.curTableData = tableData;
      this.showTableAdd = true;
    },
    handleDeleteTableData(list, i) {
      list.splice(i, 1);
    },
    handleEditTableData(headers, list, i) {
      this.tableForm = headers
        .map((it) => {
          return {
            ...it,
            value1: "",
          };
        })
        .filter((it) => it.text != "Action");
      this.curEditIndex = i;
      this.curTableData = list;
      let curObj = list[i];
      for (const key in curObj) {
        this.tableForm.forEach((it) => {
          if (it.value == key) {
            it.value1 = curObj[key];
          }
        });
      }
      this.showTableEdit = true;
    },
    handleEditTable() {
      let tableForm = {};
      this.tableForm.forEach((it) => {
        this.$set(tableForm, it.value, it.value1);
      });
      this.curTableData.splice(this.curEditIndex, 1, tableForm);
      this.showTableEdit = false;
    },
    handleSaveTable() {
      let tableForm = {};
      this.tableForm.forEach((it) => {
        this.$set(tableForm, it.value, it.value1);
      });
      this.curTableData.push(tableForm);
      this.showTableAdd = false;
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
