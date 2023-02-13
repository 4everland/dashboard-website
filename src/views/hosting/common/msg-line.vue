<template>
  <e-kv2 :label="label">
    <div class="al-c" v-if="content">
      <e-link
        class="fz-14"
        :href="$utils.getCidLink(transformIpfsPath(content), platForm)"
      >
        {{ transformIpfsPath(content) }}
      </e-link>
      <img
        src="/img/svg/copy.svg"
        width="12"
        class="ml-3 hover-1"
        @success="$toast('Copied!')"
        v-clipboard="transformIpfsPath(content)"
      />
    </div>
    <h-status
      v-else
      :val="state == 'failure' ? 'Not synchronized' : state"
    ></h-status>
  </e-kv2>
</template>

<script>
import HStatus from "./h-status.vue";
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    platForm: {
      type: String,
      default: "IPFS",
    },
    state: {
      type: String,
      required: true,
    },
    cutStr: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    transformIpfsPath() {
      return function (val) {
        const str = val.replace("/ipfs/", "").replace("/ipns/", "");
        if (this.cutStr) return str.cutStr(20, 10);
        return str;
      };
    },
  },
  components: {
    HStatus,
  },
};
</script>

<style lang="scss" scoped>
</style>