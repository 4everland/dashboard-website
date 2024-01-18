<template>
  <div>
    <!-- <div class="my-5">
      <v-btn @click="onComplete" color="primary" class="ml-4">Complete</v-btn>
    </div> -->
    <!-- <v-form ref="form" v-model="valid">
      <v-row>
        <v-col
          cols="6"
          v-for="(item, index) in editList"
          :key="index"
          class="al-c"
        >
          <v-text-field
            class="fz-14"
            v-model="item.env"
            color="deep-purple"
            placeholder="VUE_APP_BASE_URL=XXX"
            dense
            :rules="rules"
            outlined
          ></v-text-field>
          <v-btn color="error" icon @click="onDel(index)">
            <v-icon size="16">mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form> -->

    <!-- <v-textarea v-model="envArea" rows="15" row-height="30"></v-textarea> -->

    <!-- <CodeEditor
      :modelValue.sync="envArea"
      :display-language="false"
      theme="github"
      :line-nums="true"
      font-size="14px"
      width="100%"
      height="500px"
      @content="getContent"
    ></CodeEditor> -->

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
      editList: [],
      valid: true,
      envArea: "",
    };
  },
  computed: {
    rules() {
      return [
        (val) => {
          if (/^\w+=\W*/.test(val) || !val) return true;
          return false;
        },
      ];
    },
  },
  watch: {
    value(val) {
      this.editList = val.map((it) => {
        return {
          ...it,
          env: it.key ? it.key + "=" + it.value : "",
        };
      });
    },
  },
  methods: {
    getContent(val) {
      console.log(val);
    },
    onAdd() {
      this.editList.push({
        env: "",
        key: "",
        value: "",
      });
    },
    onDel(i) {
      this.editList.splice(i, 1);
    },
    onComplete() {
      let envs = this.envArea.split("\n");
      console.log(envs);
      envs = envs.filter((it) => {
        const trimStr = it.trim();
        return !trimStr.startsWith("#") && trimStr != "";
      });
      const list = envs
        .map((it) => {
          it;
          const index = it.indexOf("=");
          const key = it.slice(0, index).trim();
          const value = it.slice(index + 1).trim();
          return {
            key,
            value,
          };
        })
        .filter((it) => it.key);
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
