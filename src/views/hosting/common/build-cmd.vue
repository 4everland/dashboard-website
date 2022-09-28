<template>
  <div>
    <e-menu offset-y offset-overflow>
      <v-text-field
        slot="ref"
        v-model="val"
        :outlined="!label"
        dense
        :placeholder="placeholder"
        :label="label"
        persistent-placeholder
      />
      <div class="bg-white ov-a">
        <v-list style="max-height: 260px">
          <v-list-item
            link
            @click="onOpt(item)"
            v-for="(item, i) in options"
            :key="i"
          >
            <v-list-item-title :title="item.script">
              <span
                :class="{
                  'color-1 fw-b': item.value == val,
                }"
                >{{ item.key }}</span
              >
              <span class="gray ml-1 mr-2" v-if="item.key">:</span>
              <span class="gray fz-13 line-1">{{
                (item.script || "").cutStr(60)
              }}</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </e-menu>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    placeholder: String,
    scripts: null,
    label: String,
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
        script: "No command",
      });
      return res;
    },
  },
  methods: {
    onOpt(it) {
      this.val = it.value;
    },
  },
};
</script>