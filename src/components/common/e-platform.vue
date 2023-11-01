<template>
  <div>
    <h3 class="mt-2">Hosting Platform</h3>
    <v-row>
      <v-col
        cols="12"
        md="3"
        v-for="(it, i) in platList"
        :key="i"
        @click="$emit('update:platform', it.name)"
      >
        <div
          class="d-flex al-c bdrs-4 plat-item"
          :class="{
            active: platform == it.name,
          }"
        >
          <img :src="'/img/svg/hosting/' + it.icon" height="30" />
          <div class="ml-2 fw-b fz-16 pos-r">
            <span> {{ it.label }}</span>
          </div>
        </div>
      </v-col>
      <v-col v-if="platform == 'AR'">
        <div class="gray fz-14">
          <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon> All assets in
          Arweave are linked using relative paths due to its features.
        </div>
      </v-col>
      <v-col v-if="platform == 'GREENFIELD'">
        <div class="gray fz-14">
          <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon> Please note
          that Greenfield is currently a Testnet and is for experiential use
          only. As such, it is subject to resets, which may result in loss of
          data.
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    platform: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      platList: [
        {
          label: "IPFS/Filecoin",
          name: "IPFS",
          icon: "h-ipfs.svg",
        },
        {
          label: "Arweave",
          name: "AR",
          icon: "h-ar.svg",
        },
        {
          label: "BNB Greenfield",
          name: "GREENFIELD",
          icon: "h-greenfield.svg",
        },
        {
          label: "Internet Computer",
          name: "IC",
          icon: "h-ic.svg",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.plat-item {
  padding: 14px 12px;
  background: #eef0f4;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
  &.active {
    background: #634695;
    color: #fff;
  }
}
.beta-icon {
  position: absolute;
  right: -55px;
  top: -7px;
}
</style>
