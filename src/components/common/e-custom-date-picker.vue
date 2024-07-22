<template>
  <div>
    <v-select
      class="ipfs-input hide-msg mr-4"
      style="width: 150px"
      outlined
      :items="dateList"
      dense
      @change="change"
      v-model="userSelected"
    ></v-select>
    <v-dialog v-model="showDatePicker" max-width="300">
      <v-date-picker
        v-model="date"
        :allowed-dates="isAllow"
        @change="onDatePicker"
      ></v-date-picker>
    </v-dialog>
  </div>
</template>

<script>
const now = new Date();

export default {
  props: {
    items: {
      type: Array,
      default: () => {
        return [
          { text: "past 7 day", value: "7d" },
          { text: "past 30 day", value: "30d" },
        ];
      },
    },
    selected: {
      default: "7d",
    },
  },
  watch: {
    selected: {
      handler(val) {
        this.userSelected = val;
      },
      immediate: true,
    },
  },
  data() {
    return {
      showDatePicker: false,
      date: null,
      userSelected: null,
      start: "2022-7-27".toDate() * 1,
    };
  },
  computed: {
    dateList() {
      const list = JSON.parse(JSON.stringify(this.items));
      if (this.date) {
        list.push({
          text: this.date,
          value: new Date(this.date).getTime(),
        });
      }
      list.push({
        text: "Custom Time",
        value: "custom",
      });
      return list;
    },
  },
  methods: {
    isAllow(val) {
      const date = val.toDate();
      return date < now && date > this.start;
    },
    change(val) {
      if (val == "custom") return (this.showDatePicker = true);
      this.$emit("date", val);
    },
    onDatePicker(date) {
      this.showDatePicker = false;
      this.date = date;
      this.userSelected = new Date(date).getTime();
      this.$emit("date", this.userSelected);
    },
  },
};
</script>

<style lang="scss" scoped></style>
