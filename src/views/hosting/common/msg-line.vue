<template>
  <div>
    <e-kv2 label="IPNS" v-if="info.deployType == 'IPNS'">
      <div class="al-c" v-if="content">
        <e-link class="fz-14" :href="$utils.getCidLink(content, platForm)">
          {{ content }}
        </e-link>
        <img
          src="/img/svg/copy.svg"
          width="12"
          class="ml-3 hover-1"
          @success="$toast('Copied!')"
          v-clipboard="content"
        />
      </div>
      <h-status
        v-else
        :val="state == 'failure' ? 'Not synchronized' : state"
      ></h-status>
    </e-kv2>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: "",
    },
    platForm: {
      type: String,
      default: "IPFS",
    },
    state: String,
  },
};
</script>

<style lang="scss" scoped>
</style>