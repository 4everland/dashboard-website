<template>
  <e-toggle-card title="Environment Variables" v-model="isShow">
    <env-form-view v-model="list" @edit="isEdit = true"></env-form-view>
    <env-form-textarea
      v-model="list"
      @edit="isEdit = false"
    ></env-form-textarea>
  </e-toggle-card>
</template>

<script>
import EToggleCard from "@/views/hosting/common/e-toggle-card";
import EnvFormView from "./env-form-view.vue";
import EnvFormTextarea from "./env-form-textarea.vue";
export default {
  props: {
    value: Array,
  },
  data() {
    return {
      isShow: false,
      list: this.value || [],
      isEdit: false,
    };
  },
  watch: {
    value(val) {
      this.list = val;
      this.isShow = true;
    },
    list(val) {
      this.$emit("input", val);
    },
  },
  mounted() {
    if (this.list.length) this.isShow = true;
  },
  components: {
    EToggleCard,
    EnvFormView,
    EnvFormTextarea,
  },
};
</script>
