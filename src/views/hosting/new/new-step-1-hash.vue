<template>
  <div class="main-wrap" style="min-height: 551px">
    <v-form ref="form">
      <div>IPFS Path</div>
      <v-row class="mt-3">
        <v-col :sm="2" :cols="12"
          ><v-select
            class="ipfs-input hide-msg"
            outlined
            :items="items"
            dense
            @change="handleChangeDeployType"
            v-model="seleted"
          ></v-select
        ></v-col>
        <v-col :sm="10" :cols="12" class="d-flex al-start">
          <v-text-field
            ref="ipfsPathRef"
            persistent-placeholder
            outlined
            dense
            label=""
            :placeholder="
              seleted == 'IPFS' ? 'Enter the IPFS CID' : 'Enter the IPNS'
            "
            v-model="form.ipfsPath"
            :rules="inputRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <div class="fz-14 gray">
        <v-icon size="14">mdi-alert-circle</v-icon>
        Due to the vast scale of the IPFS network, finding content for IPFS Path
        deployments may take some time.
      </div>
      <div class="mt-5">The Project Name</div>
      <v-text-field
        class="mt-4"
        persistent-placeholder
        outlined
        placeholder="Enter the project name"
        v-model="form.name"
        dense
        :rules="[(v) => !!(v || '').trim() || 'Please enter a project name']"
      ></v-text-field>
      <e-platform :platform.sync="form.platform"></e-platform>

      <div v-if="seleted == 'IPNS'">
        <div class="mt-10">IPNS Automatic Deployment</div>
        <div class="d-flex al-c mt-3">
          <span class="mr-auto fz-14">
            Always allow 4EVERLAND to regularly check the IPNS for updated CID
            files and redeploy the project if it has been updated.</span
          >
          <v-switch class="hide-msg mt-0" v-model="form.ipnsAuto"></v-switch>
        </div>
        <div class="tips fz-14 mt-4">
          Tips: Automatic IPNS Redeployment will also consume your storage,
          Bandwidth, and build minutes. Alternatively, you can update the CID
          manually after the project is created, since the network may not
          monitor every update.
        </div>
      </div>

      <div class="d-flex justify-center mt-7">
        <v-btn color="primary" min-width="100" @click="onDeploy">Deploy</v-btn>
        <v-btn outlined class="ml-6" min-width="100" @click="$emit('back')"
          >Back</v-btn
        >
      </div>
    </v-form>
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
          label: "Greenfield",
          name: "GREENFIELD",
          icon: "h-greenfield.svg",
        },
        {
          label: "Internet Computer",
          name: "IC",
          icon: "h-ic.svg",
        },
      ],
      form: {
        platform: "IPFS",
        name: "",
        ipfsPath: "",
        deployType: "CID",
        ipnsAuto: false,
      },
    };
  },
  created() {
    this.getDeployParams();
  },
  computed: {
    finalHash() {
      if (this.seleted == "IPFS") {
        return /^\/ipfs\//.test(this.form.ipfsPath)
          ? this.form.ipfsPath
          : "/ipfs/" + this.form.ipfsPath;
      } else {
        return /^\/ipns\//.test(this.form.ipfsPath)
          ? this.form.ipfsPath
          : "/ipns/" + this.form.ipfsPath;
      }
    },
    inputRules() {
      if (this.seleted == "IPNS")
        return [
          (v) => !!(v || "").trim() || "Invalid IPFS path",
          (v) => (/^[a-zA-Z0-9]+$/.test(v) ? true : "Invalid IPFS path"),
        ];
      return [
        (v) => !!(v || "").trim() || "Invalid IPFS path",
        (v) =>
          /^(\/ipfs\/)?(Qm[A-Za-z0-9]{44}|b[A-Za-z0-9]{58})$/.test(v)
            ? true
            : "Invalid IPFS path",
      ];
    },
  },
  methods: {
    getDeployParams() {
      const { deployType, hash } = this.$route.query;
      console.log(deployType, hash);
      this.seleted = deployType;
      this.form.ipfsPath = hash;
    },
    async onDeploy() {
      try {
        const valid = await this.$refs.form.validate();
        if (!valid) return;
        this.$loading();
        const { data } = await this.$http.post("$hosting/project", {
          ...this.form,
          ipfsPath: this.finalHash,
        });
        const {
          data: { taskId },
        } = await this.$http.post(
          `$hosting/project/task/cid/${data.projectId}/deploy/create`
        );
        this.$emit("onHashDeloy", {
          projectId: data.projectId,
          taskId: taskId,
        });
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
    handleChangeDeployType(val) {
      // console.log(this.$refs.ipfsPathRef);
      this.$refs.ipfsPathRef.reset();
      // if (val == "IPFS") {
      //   this.form.deployType = "CID";
      // } else if (val == "IPNS") {
      //   this.form.deployType = "IPNS";
      // } else {
      //   this.form.deployType = undefined;
      // }
    },
    onBack() {
      this.$router.back();
      this.curStep -= 1;
    },
  },
  watch: {
    seleted(val) {
      if (val == "IPNS") {
        this.form.deployType = "IPNS";
      } else if (val == "IPFS") {
        this.form.deployType = "CID";
      }
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
