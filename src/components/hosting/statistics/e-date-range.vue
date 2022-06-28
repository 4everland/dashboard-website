<template>
  <div class="d-flex al-c">
    <v-icon class="ml-auto mr-2">mdi-calendar-month-outline</v-icon>
    <v-select
      style="max-width: 260px"
      class="mt-3"
      v-model="date"
      :items="dateList"
      item-text="text"
      item-value="value"
      single-line
      dense
      :menu-props="{
        offsetY: true,
      }"
    >
    </v-select>

    <v-dialog v-model="showPop" max-width="500">
      <v-date-picker
        v-model="dates"
        range
        :allowed-dates="isAllow"
      ></v-date-picker>
      <div class="ta-r pd-20">
        <v-btn text @click="onCancel">Cancel</v-btn>
        <v-btn
          color="primary"
          class="ml-4"
          :disabled="dates.length < 2"
          @click="onOk"
          >OK</v-btn
        >
      </div>
    </v-dialog>
  </div>
</template>

<script>
let now = new Date();
const MON_T = 30 * 86400 * 1000;

export default {
  props: {
    val: String,
    dayType: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      date: null,
      showPop: false,
      dates: [],
      preDate: null,
      pickDates: [],
    };
  },
  computed: {
    dateList() {
      const list = [
        {
          text: "Past 24h",
          value: "24h",
        },
        {
          text: "Past 7d",
          value: "7d",
        },
        {
          text: "Past 30d",
          value: "30d",
        },
      ];
      if (this.pickDates.length == 2) {
        list.push({
          text: `${this.pickDates[0]
            .toDate()
            .format("date")} ~ ${this.pickDates[1].toDate().format("date")}`,
          value: this.getVal(this.pickDates),
        });
      }
      list.push({
        text: "Custom time",
        value: "custom",
      });
      return list;
    },
  },
  mounted() {
    if (this.val) this.date = this.val;
  },
  watch: {
    date(val, oldVal) {
      if (val == "custom") {
        this.showPop = true;
        this.preDate = oldVal;
        this.date = null;
      } else if (val) {
        this.onInput(val);
      }
    },
    showPop() {
      if (!this.showPop && !this.date) this.date = this.preDate;
    },
  },
  methods: {
    isAllow(val) {
      const date = val.toDate();
      let isOk = date < now;
      if (isOk && this.dates.length == 1) {
        return Math.abs(date - this.dates[0].toDate()) < MON_T;
      }
      return isOk;
    },
    onInput(val) {
      const offset = now.getTimezoneOffset() * 60e3;

      if (val == "24h" && !this.dayType) {
        this.$emit("dates", val);
        return;
      }
      if (val == "24h" && this.dayType) {
        const data = new Date().getTime();
        let end = data * 1;
        let start = end - 24 * 60 * 60 * 1000;
        end -= offset;
        start -= offset;
        return this.$emit("dates", [start, end]);
      }
      const mat = /^(\d+)(\D)$/.exec(val);
      let start, end;
      if (mat) {
        let num = mat[1];
        const date = this.dayType
          ? new Date().getTime()
          : new Date().getToday();
        end = date * 1;
        start = this.dayType
          ? end - num * 24 * 3600 * 1e3
          : date.getNextDay(-num) * 1;
      } else {
        const arr = val.split(",");
        start = arr[0].toDate() * 1;
        end = arr[1].toDate().getDayEnd() * 1;
      }
      end -= offset;
      start -= offset;
      this.$emit(
        "dates",
        this.dayType
          ? [start, end]
          : [parseInt(start / 1e3), parseInt(end / 1e3)]
      );
    },
    onCancel() {
      this.showPop = false;
    },
    onOk() {
      this.pickDates = [...this.dates];
      this.dates = [];
      this.date = this.getVal(this.pickDates);
      this.showPop = false;
    },
    getVal(arr) {
      return arr.join(",");
    },
  },
};
</script>