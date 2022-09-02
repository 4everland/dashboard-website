<template>
  <div class="al-c">
    <v-btn
      @click="curIdx = i == curIdx ? -1 : i"
      :outlined="i != curIdx"
      :color="i == curIdx ? 'primary' : '#6c7789'"
      depressed
      class="mr-5"
      small
      v-for="(it, i) in list"
      :key="i"
    >
      {{ it.text }}
    </v-btn>
    <input
      v-model="inputVal"
      type="tel"
      class="bd-1 bdc-c pa-1 pl-2 bdrs-2 fz-14 mr-2"
      :class="{
        'bdc-c1': inputVal > 0,
      }"
      style="width: 70px"
    />
    <e-menu offset-y open-on-hover v-if="unitList.length">
      <v-btn plain small color="#000" class="al-c" slot="ref">
        <span>{{ unitItem.text }}</span>
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
      <v-list dense>
        <v-list-item-group v-model="unitIdx">
          <v-list-item link v-for="(it, i) in unitList" :key="i">
            <span class="fz-14">{{ it.text }}</span>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </e-menu>
    <span v-else>
      {{ unit }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    options: Array,
    unit: String,
  },
  computed: {
    list() {
      return (this.options || []).map((num) => {
        if (this.unit != "GB")
          return {
            num,
            text: num + " " + this.unit,
          };
        return {
          num,
          text: this.$utils.getFileSize(num, false, 0),
        };
      });
    },
    unitItem() {
      if (this.unit == "Day") {
        return {
          value: 86400,
          text: "Day",
        };
      }
      if (this.unit == "Min") {
        return {
          value: 60,
          text: "Min",
        };
      }
      return this.unitList[this.unitIdx] || {};
    },
    unitList() {
      if (this.unit == "GB") {
        return [
          {
            text: "MB",
            value: Math.pow(1024, 2),
          },
          {
            text: "GB",
            value: Math.pow(1024, 3),
          },
          {
            text: "TB",
            value: Math.pow(1024, 4),
          },
        ];
      }
      if (this.unit == "Mth") {
        const mon = 30 * 86400;
        return [
          {
            text: "Mth",
            value: mon,
          },
          {
            text: "Year",
            value: mon * 12,
          },
        ];
      }
      return [];
    },
  },
  data() {
    return {
      curIdx: -1,
      inputVal: "",
      unitIdx: 0,
    };
  },
  created() {
    // console.log(this.options, this.curIdx);
    if (this.unit == "GB") this.unitIdx = 1;
  },
  watch: {
    inputVal(val) {
      if (val > 0) {
        let max = 1024;
        if (this.unit == "Min") max = 10000;
        else if (this.unit == "Day") max = 1000;
        else if (this.unit == "Mth") max = 12;
        this.inputVal = Math.min(val * 1, max);
        this.curIdx = -1;
      } else {
        this.inputVal = "";
      }
      this.onInput();
    },
    curIdx(val) {
      if (val > -1) this.inputVal = "";
      this.onInput();
    },
    unitItem() {
      this.onInput();
    },
  },
  methods: {
    onInput() {
      let val = 0;
      let text = "";
      if (this.curIdx > -1) {
        const item = this.list[this.curIdx];
        val = item.num;
        if (this.unit == "Min") val *= 60;
        else if (this.unit == "Mth") val *= 30 * 86400;
        else if (this.unit == "Day") val *= 86400;
        text = item.text;
      } else if (this.inputVal > 0) {
        text = this.inputVal + " " + this.unitItem.text;
        val = this.inputVal * this.unitItem.value;
      }
      this.$emit("input", {
        val,
        text,
      });
    },
  },
};
</script>