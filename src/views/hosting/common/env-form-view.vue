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
          <v-btn color="primary" class="ml-4" @click="isEdit = !isEdit">{{
            isEdit ? "Complete" : "Edit"
          }}</v-btn>
        </v-col>
      </v-row>

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

      <div class="form-advance mt-5" v-show="isEdit">
        <v-form>
          <div
            v-for="(item, index) in list"
            :key="index"
            class="al-c form-advance-item"
            style="gap: 10px"
          >
            <v-text-field
              outlined
              dense
              v-model="item.key"
              :counter="10"
              label="KEY"
            ></v-text-field>

            <v-text-field
              outlined
              dense
              v-model="item.value"
              label="VALUE"
            ></v-text-field>
            <v-btn color="error" icon @click="onDel(index)">
              <v-icon size="16">mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-form>
      </div>
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
