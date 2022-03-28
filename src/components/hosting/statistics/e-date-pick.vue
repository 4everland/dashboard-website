<template>
  <v-menu
    v-model="showPop"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        class="hide-msg"
        :value="date"
        readonly
        prepend-icon="mdi-calendar"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      no-title
      @input="showPop = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      date: null,
      val: null,
      showPop: false,
    };
  },
  mounted() {
    this.date = new Date().format("yy-MM-dd");
  },
  watch: {
    date(val) {
      const date = val.toDate();
      this.$emit("input", this.$getUTC0(date));
    },
  },
};
</script>