<template>
  <div class="d-flex al-c">
    <v-text-field
      v-if="!options.length"
      v-model="val"
      outlined
      dense
      :placeholder="placeholder"
    />
    <v-select
      v-else
      v-model="val"
      outlined
      dense
      :menu-props="{ offsetY: true }"
      :items="options"
      item-text="text"
      item-value="value"
    >
      <template #item="{ item }">
        <span>{{ item.key }}</span>
        <span class="gray ml-1 mr-2" v-if="item.key">:</span>
        <span class="gray fz-13 line-1" style="max-width: 320px">{{
          item.script
        }}</span>
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    placeholder: String,
    scripts: null,
  },
  watch: {
    val() {
      this.$emit("input", this.val);
    },
    value() {
      if (this.value != this.val) this.val = this.value;
    },
  },
  data() {
    return {
      val: this.value,
    };
  },
  computed: {
    options() {
      let res = [];
      if (this.scripts) {
        for (const key in this.scripts) {
          const method = /build/.test(key) ? "unshift" : "push";
          let value = "npm run " + key;
          const script = this.scripts[key];
          if (script == "next build") value = script;
          res[method]({
            key,
            text: value,
            value,
            script,
          });
        }
      }
      res.unshift({
        key: "",
        text: "",
        value: "",
        script: "empty",
      });
      return res;
    },
  },
};
</script>