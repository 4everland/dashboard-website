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
    value() {},
  },
  methods: {
    // initEnvArea(){
    //   this.value
    // },
    onComplete() {
      let envs = this.envArea.split("\n");
      envs = envs.filter((it) => {
        const trimStr = it.trim();
        return !trimStr.startsWith("#") && trimStr != "";
      });
      let envList = envs
        .map((it) => {
          const index = it.indexOf("=");
          if (index == -1) return { key: "", value: "" };
          const key = it.slice(0, index).trim();
          const value = it.slice(index + 1).trim();
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
