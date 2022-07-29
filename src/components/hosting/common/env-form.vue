<template>
  <e-toggle-card title="Environment Variables" v-model="isShow">
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
      <v-col cols="6" md="4">
        <h4 class="op-0">Hide</h4>
        <v-btn color="primary" @click="onAdd">Add</v-btn>
      </v-col>
    </v-row>

    <v-data-table
      class="mt-5"
      :headers="headers"
      :items="list"
      hide-default-footer
      v-show="list.length"
    >
      <template v-slot:item.act="{ index }">
        <v-btn color="error" icon @click="onDel(index)">
          <v-icon size="16">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </e-toggle-card>
</template>

<script>
export default {
  props: {
    value: Array,
  },
  data() {
    return {
      isShow: false,
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
    };
  },
  watch: {
    value(val) {
      this.list = val;
      this.isShow = true;
    },
    list(val) {
      this.$emit("input", val);
    },
  },
  mounted() {
    if (this.list.length) this.isShow = true;
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