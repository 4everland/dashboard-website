<template>
  <div>
    <h3 class="my-3 fz-16">{{ name }}</h3>
    <div class="al-c">
      <div
        v-for="(item, index) in tags"
        :key="index"
        class="tag cursor-p fz-14 al-c justify-center"
        :class="curIndex == index ? 'active' : ''"
        @click="handleTag(index)"
      >
        {{ item.text }}
      </div>
      <div
        class="select-content al-c ml-2"
        :class="curIndex == -1 ? 'active' : ''"
      >
        <input
          type="text"
          class="fz-14 ta-c resource-input"
          @input="handleInput"
          v-model="value"
        />
        <v-select
          class="hide-msg resource-select fz-12"
          v-if="items.length > 1"
          v-model="selected"
          dense
          solo
          :items="items"
        ></v-select>
        <span class="fz-13 ml-3" v-else>{{ items[0].text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    tags: {
      type: Array,
      default: () => [
        {
          text: "30GB",
          value: 30 * Math.pow(1024, 3),
        },
        {
          text: "80GB",
          value: 80 * Math.pow(1024, 3),
        },
        {
          text: "500GB",
          value: 500 * Math.pow(1024, 3),
        },
      ],
    },
    items: {
      type: Array,
      default: () => {
        return [
          {
            text: "MB",
            value: Math.pow(1024, 2),
          },
          { text: "GB", value: Math.pow(1024, 3) },
          {
            text: "TB",
            value: Math.pow(1024, 4),
          },
        ];
      },
    },
    unit: {
      default: Math.pow(1024, 3),
    },
  },
  data() {
    return {
      value: "",
      curIndex: null,
      selected: Math.pow(1024, 3),
    };
  },
  created() {
    this.selected = this.unit;
  },
  methods: {
    handleTag(i) {
      console.log(this.curIndex, i);
      if (this.curIndex == i) {
        this.curIndex = null;
        this.$emit("countPrice", { value: 0, type: this.name });
      } else {
        this.curIndex = i;
        this.$emit("countPrice", {
          value: this.tags[this.curIndex].value,
          type: this.name,
        });
      }
    },
    handleInput() {
      this.$emit("countPrice", {
        value: this.value * this.selected,
        type: this.name,
      });
    },
    handleChangeUnit(val) {
      console.log(val);
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.curIndex = -1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.select-content {
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  width: 148px;
  height: 40px;
  padding: 10px;
  box-sizing: border-box;
}

.select-content.active {
  border: 1px solid #735ea1;
}
.tag {
  width: 120px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
}

.tag + .tag {
  margin-left: 8px;
}
.tag.active {
  border: 1px solid #735ea1;
  color: #735ea1;
  font-weight: bold;
}
.resource-input {
  width: 50px;
  text-align: right;
}

// .resource-select :deep .v-input__control {
//   width: 50px;
// }
</style>
