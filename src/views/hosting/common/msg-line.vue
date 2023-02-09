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
  },
  computed: {
    transformIpfsPath() {
      return function (val) {
        return val.replace("/ipfs/", "").replace("/ipns/", "");
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>