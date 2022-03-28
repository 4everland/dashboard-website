<template>
  <v-tooltip v-if="date" top>
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on"> {{ pre }} {{ niceTime }} {{ sub }} </span>
    </template>
    <span>
      {{ fullTime }}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    value: null,
    endAt: null,
    format: String,
    pre: String,
    sub: String,
  },
  computed: {
    nowDate() {
      return this.$store.state.nowDate;
    },
    date() {
      let val = this.value;
      if (!val) {
        const [el] = this.$slots.default || [];
        if (el) {
          val = el.text.trim();
          if (val > 0) val *= 1;
          // console.log(val)
        }
      }
      if (!val) return;
      return new Date(val);
    },
    endDate() {
      if (this.endAt) {
        return new Date(this.endAt);
      }
      return null;
    },
    niceTime() {
      let time = this.date.toNiceTime(this.endDate || this.nowDate);
      if (this.endAt) time = time.replace("ago", "");
      return time;
    },
    fullTime() {
      let time = this.date.format(this.format);
      if (this.endDate) {
        time += " ~ " + this.endDate.format(this.format);
      }
      return time;
    },
  },
};
</script>