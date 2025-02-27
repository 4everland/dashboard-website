<template>
  <e-kv2 :label="label">
    <div class="al-c" v-if="content">
      <e-link class="fz-14" :href="link">
        {{ cutStr ? value.cutStr(20, 10) : value }}
      </e-link>
      <img
        src="/img/svg/copy.svg"
        width="12"
        class="ml-3 hover-1"
        @success="$toast('Copied!')"
        v-clipboard="copyVal"
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
    online: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    transformIpfsPath() {
      return function (val) {
        const str = val.replace("/ipfs/", "").replace("/ipns/", "");
        return str;
      };
    },
    value() {
      return this.transformIpfsPath(this.content);
    },
    copyVal() {
      return this.value.replace("ipfs://", "").replace("ipns://", "");
    },
    link() {
      return this.$utils.getCidLink(this.copyVal, this.platForm, this.online, 'hosting');
    },
  },
  components: {
    HStatus,
  },
};
</script>

<style lang="scss" scoped></style>
