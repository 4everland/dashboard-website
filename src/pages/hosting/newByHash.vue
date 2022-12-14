<template>
  <div class="main-wrap">
    <div>IPFS Path</div>
    <v-row class="mt-3">
      <v-col :sm="2" :cols="12"
        ><v-select
          class="ipfs-input hide-msg"
          outlined
          :items="items"
          dense
          v-model="seleted"
        ></v-select
      ></v-col>
      <v-col :sm="10" :cols="12" class="d-flex al-start">
        <v-text-field
          persistent-placeholder
          outlined
          dense
          label=""
        ></v-text-field>
      </v-col>
    </v-row>
    <div>The Project Name</div>
    <v-text-field
      class="mt-4"
      persistent-placeholder
      outlined
      dense
    ></v-text-field>
    <h3 class="mt-2">Hosting Platform</h3>
    <v-row>
      <v-col
        cols="12"
        md="4"
        v-for="(it, i) in platList"
        :key="i"
        @click="form.platform = it.name"
      >
        <div
          class="d-flex al-c bdrs-3 plat-item"
          :class="{
            active: form.platform == it.name,
          }"
        >
          <img :src="'/img/svg/hosting/' + it.icon" height="30" />
          <div class="ml-2 fw-b fz-16 pos-r">
            <span> {{ it.label }}</span>
          </div>
          <img
            class="ml-auto"
            v-if="it.name == 'IC'"
            :src="
              form.platform == it.name
                ? '/img/svg/hosting/h-beta.svg'
                : '/img/svg/hosting/h-beta-active.svg'
            "
            height="20"
            alt=""
          />
        </div>
      </v-col>
      <v-col v-if="form.platform == 'AR'">
        <div class="gray fz-14">
          <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon> All assets in
          Arweave are linked using relative paths due to its features.
        </div>
      </v-col>
    </v-row>
    <div class="mt-6">IPNS Automatic Deployment</div>
    <div class="d-flex al-start mt-3">
      <span class="mr-auto fz-14">
        Always allow 4EVERLAND to regularly check the IPNS for updated CID files
        and redeploy the project if it has been updated.</span
      >
      <v-switch class="hide-msg" v-model="isAutoDeploy"></v-switch>
    </div>
    <div class="tips fz-14 mt-2">
      Tips: Automatic IPNS Redeployment will also consume your storage,
      bindwidth, and build minutes. Alternatively, you can update the CID
      manually after the project is created, since the network may not monitor
      every update.
    </div>

    <div class="d-flex justify-end mt-7">
      <v-btn color="primary" width="120" @click="onDeploy">Deploy</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: ["IPFS", "IPNS"],
      seleted: "IPFS",
      platList: [
        {
          label: "IPFS",
          name: "IPFS",
          icon: "h-ipfs.svg",
        },
        {
          label: "Arweave",
          name: "AR",
          icon: "h-ar.svg",
        },
        {
          label: "Internet Computer",
          name: "IC",
          icon: "h-ic.svg",
        },
      ],
      form: {
        platform: "",
      },
      isAutoDeploy: false,
    };
  },
  methods: {
    onDeploy() {
      console.log(111);
    },
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
.ipfs-input ::v-deep .v-input__slot {
  background: #f7f7f7 !important;
  border-radius: 2px;
  box-shadow: none !important;
}
.tips {
  color: #889ab3;
}
</style>