<template>
  <div>
    <div class="form-table">
      <v-row>
        <v-col cols="6" md="4">
          <h4>Name</h4>
          <v-text-field
            v-model="form.key"
            placeholder="Variable_Name"
            outlined
            dense
            @paste.stop="opaste"
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="4">
          <h4>Value</h4>
          <v-text-field
            @keyup.enter="onAdd"
            v-model="form.value"
            placeholder="Example Value"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="4" class="al-end d-flex">
          <!-- <h4 class="op-0">Hide</h4> -->
          <v-btn color="primary" @click="onAdd">Add</v-btn>
          <v-btn color="primary" class="ml-4" @click="$emit('edit')">{{
            isEdit ? "Complete" : "Edit"
          }}</v-btn>
        </v-col>
      </v-row>

      <div class="fz-14 gray mt-3">
        Tip: Populate the form by pasting a .env file above.
      </div>

      <v-data-table
        class="mt-5"
        :headers="headers"
        :items="list"
        hide-default-footer
        :items-per-page="-1"
        v-show="list.length && !isEdit"
      >
        <template v-slot:item.act="{ index }">
          <v-btn color="error" icon @click="onDel(index)">
            <v-icon size="16">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Array,
  },
  data() {
    return {
      form: {
        key: "",
        value: "",
      },
      headers: [
        { text: "Name", value: "key" },
        { text: "Value", value: "value" },
        { text: "Action", value: "act" },
      ],
      list: this.value || [],
      isEdit: false,
    };
  },
  watch: {
    value(val) {
      this.list = val;
    },
    list(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    onAdd() {
      const { key } = this.form;
      const hasSameKey = this.list.some((it) => it.key == key);
      if (hasSameKey) return this.$toast("Already Existed Name");
      if (!key) return this.$toast("Empty Name");
      this.list.push(this.form);
      this.form = {
        key: "",
        value: "",
      };
    },
    onDel(i) {
      this.list.splice(i, 1);
    },
    opaste(e) {
      // Get pasteData
      const clipboardData = e.clipboardData;
      const pasteData = clipboardData.getData("Text");
      const disableIpt = this.pasteRules(pasteData);
      // Disabled Input
      if (disableIpt) e.preventDefault();
    },
    pasteRules(pasteData) {
      let envs = pasteData.split("\n");
      envs = envs.filter((it) => {
        const trimStr = it.trim();
        return !trimStr.startsWith("#") && trimStr != "";
      });
      let envList = envs
        .map((it) => {
          const index = it.indexOf("=");
          if (index == -1) return { key: "", value: "" };
          const key = it.slice(0, index).trim();
          if (key.indexOf(" ") != -1) return { key: "", value: "" };
          const value = it.slice(index + 1).trim();
          return {
            key,
            value,
          };
        })
        .filter((it) => it.key);
      if (!envList.length) return false;

      let list = [...this.list, ...envList];
      let Obj = {};
      list.forEach((it) => {
        Obj[it.key] = it;
      });
      this.list = Object.values(Obj);

      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.form-advance-item {
  gap: 24px;
}

.form-advance-item + .form-advance-item {
  margin-top: 24px;
}
</style>
