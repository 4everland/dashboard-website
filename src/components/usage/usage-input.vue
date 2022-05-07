<style lang="scss">
.usage-input {
  padding: 2px;
  .v-btn--fab {
    $size: 20px;
    width: $size;
    height: $size;
  }
  input {
    outline: none;
    border: none;
    padding: 0 5px;
  }
}
</style>

<template>
  <div class="usage-input bd-1 bdrs-100 d-flex al-c">
    <v-btn
      x-small
      color="primary"
      fab
      depressed
      :disabled="val <= min"
      @click="val -= step"
    >
      <v-icon dark> mdi-minus </v-icon>
    </v-btn>
    <input
      v-model="inputVal"
      @blur="onInput"
      @change="onInput"
      class="ta-c gray"
      type="tel"
      style="width: 60px"
    />
    <v-btn
      x-small
      color="primary"
      fab
      depressed
      :disabled="val >= max"
      @click="val += step"
    >
      <v-icon dark> mdi-plus </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    min: Number,
    max: Number,
    step: Number,
  },
  data() {
    return {
      val: this.value,
      inputVal: this.value,
    };
  },
  watch: {
    val(val) {
      this.inputVal = val;
      this.$emit("input", val);
    },
    inputVal(val) {
      if (val <= 0 || isNaN(val) || val > this.max || val % this.step == 0)
        this.onInput();
    },
    value(val) {
      this.val = val;
    },
  },
  methods: {
    onInput() {
      let val = this.inputVal * 1 || 0;
      val = Math.max(this.min, val);
      val = Math.min(this.max, val);
      const rest = val % this.step;
      if (rest) {
        val -= rest;
        if (rest > this.step / 2) val += this.step;
      }
      this.val = val;
      this.inputVal = val;
    },
  },
};
</script>