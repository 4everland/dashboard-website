<template>
  <div>
    <h3 class="mt-2">Hosting Platform</h3>
    <v-row>
      <v-col
        cols="12"
        class="five-per-row"
        v-for="(it, i) in platList"
        :key="i"
        @click="$emit('update:platform', it.name)"
      >
        <div
          class="d-flex al-c bdrs-4 plat-item pos-r"
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
          label: "Walrus",
          name: "WALRUS",
          icon: "icon_walrus.svg",
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
  .tag {
    right: 0;
    top: 0;
    padding: 2px 10px;
    color: #000;
    background: #edad27;
    border-radius: 0 4px 0 4px;
  }
}
.beta-icon {
  position: absolute;
  right: -55px;
  top: -7px;
}
@media (min-width: 960px) {
  .five-per-row {
    flex: 0 0 20% !important;
    max-width: 20% !important;
  }
}
</style>
