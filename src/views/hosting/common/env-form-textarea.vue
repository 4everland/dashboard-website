<template>
  <div>
    <div class="fz-14 gray ml-10 my-2">
      Tips: Pre-existing environment variables will be replaced.
    </div>
    <SimpleCodeEditor
      theme="github"
      lineNums
      :modelValue.sync="envArea"
      width="100%"
      height="500px"
    ></SimpleCodeEditor>
    <div class="my-2">
      <v-btn @click="onComplete" color="primary" class="mr-4">Complete</v-btn>
      <v-btn @click="$emit('edit')" outlined>Cancel</v-btn>
    </div>
  </div>
</template>

<script>
import SimpleCodeEditor from "./simple-code-editor";
export default {
  components: {
    SimpleCodeEditor,
  },
  props: {
    value: Array,
  },
  data() {
    return {
      envArea: "",
    };
  },
  watch: {
    value() {
      this.initEnvArea();
    },
  },
  methods: {
    initEnvArea() {
      const envList = this.value.map((it) => it.key + "=" + it.value);
      this.envArea = envList.join("\n");
    },
    onComplete() {
      let envs = this.envArea.split("\n");
      envs = envs.filter((it) => {
        let trimStr = it.trim();
        return !trimStr.startsWith("#") && trimStr != "";
      });
      let envList = envs
        .map((it) => {
          const index = it.indexOf("=");
          if (index == -1) return { key: "", value: "" };

          const key = this.removeQuotes(it.slice(0, index).trim());
          const value = this.removeQuotes(it.slice(index + 1).trim());
          return {
            key,
            value,
          };
        })
        .filter((it) => it.key);
      let list = [...this.value, ...envList];
      let Obj = {};
      list.forEach((it) => {
        Obj[it.key] = it;
      });
      list = Object.values(Obj);
      this.$emit("input", list);
      this.$emit("edit");
      this.$emit("complete", list);
    },

    removeQuotes(str) {
      if (typeof str !== "string") return "";
      let start = 0;
      let end = str.length - 1;
      while (start < end && (str[start] === '"' || str[start] === "'")) {
        start++;
      }
      while (end > start && (str[end] === '"' || str[end] === "'")) {
        end--;
      }
      return str.substring(start, end + 1);
    },
  },
};
</script>

<style lang="scss">
textarea {
  color: #000 !important;
  margin-left: 36px !important;
}
</style>
