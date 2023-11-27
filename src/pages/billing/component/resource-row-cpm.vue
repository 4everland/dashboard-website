<template>
  <div class="resource-row-cpm mb-1">
    <h3 class="fz-16 mt-1" v-show="name != 'IPFS Storage Days'">
      {{ name }}
    </h3>
    <div class="al-c mt-2">
      <div
        v-for="(item, index) in tags"
        :key="index"
        class="tag cursor-p fz-12 al-c justify-center"
        :class="curIndex == index ? 'active' : ''"
        @click="handleTag(index)"
      >
        {{ item.text }}
      </div>
      <div
        class="select-content justify-center al-c ml-2"
        :class="curIndex == -1 ? 'active' : ''"
      >
        <input
          type="text"
          class="fz-12 ta-c resource-input flex-1"
          @input="handleInput"
          v-model="value"
        />
        <!-- <v-select
          class="hide-msg resource-select fz-12"
          v-if="items.length > 1"
          v-model="selected"
          dense
          solo
          :items="items"
        ></v-select> -->

        <div v-if="items.length > 1" class="al-c select-resource pa-1">
          <select
            @change="handleChangeUnit"
            class="cursor-p"
            :id="'select_' + name"
            v-model="selected"
          >
            <option
              class="fz-14"
              :value="it.value"
              v-for="it in items"
              :key="it.value"
            >
              {{ it.text }}
            </option>
          </select>
        </div>
        <span class="fz-12" v-else>{{ items[0].text }}</span>
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
      type: Number,
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
    handleChangeUnit(e) {
      this.selected = e.target.value;
      this.handleInput();
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
.resource-row-cpm {
  width: 48%;
  min-width: 300px;
}
.select-content {
  flex: 1;
  width: 92px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  height: 40px;
  padding: 12px 8px;
  box-sizing: border-box;
}

.select-content.active {
  border: 1px solid #735ea1;
}
.tag {
  // width: 80px;
  flex: 1;
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
  width: 41px;
  padding-right: 10px;
  box-sizing: border-box;
  text-align: right;
}

// .resource-select :deep .v-input__control {
//   width: 50px;
// }
.select-resource {
  position: relative;
  border-radius: 2px;
  background: #f1f5f9;
  font-size: 12px;
}
</style>
