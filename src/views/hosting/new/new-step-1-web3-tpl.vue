<template>
  <div class="main-wrap" style="min-height: 551px">
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
          class="d-flex al-c bdrs-4 plat-item"
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
    <h3 class="mt-5">The Project Name</h3>
    <v-text-field
      class="mt-4"
      persistent-placeholder
      outlined
      placeholder="Enter the project name"
      v-model="form.projectName"
      dense
      :rules="[(v) => !!(v || '').trim() || 'Please enter a project name']"
    ></v-text-field>

    <h3 class="mt-2">Edit Configurations</h3>
    <v-row>
      <v-col cols="12" md="6" v-for="(it, i) of configJson" :key="i">
        <div>{{ i }}</div>
        <template v-for="(item, idx) in it">
          <!-- <v-text-field
              :key="idx"
              class="mt-4"
              persistent-placeholder
              outlined
              :placeholder="item.placeholder"
              v-model="item.value"
              :maxlength="item.maxLen"
              :rules="getRules(item)"
              dense
            ></v-text-field> -->
          <v-text-field
            :key="idx"
            class="mt-4"
            persistent-placeholder
            outlined
            :placeholder="item.placeholder"
            v-model="item.value"
            dense
          ></v-text-field>
        </template>
      </v-col>
    </v-row>

    <div class="d-flex justify-center mt-7">
      <v-btn color="primary" min-width="100" @click="onDeploy">Deploy</v-btn>
      <v-btn outlined class="ml-6" min-width="100" @click="$emit('back')"
        >Back</v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
        platform: "IPFS",
        projectName: "",
        web3TemplateId: null,
      },
      configJson: [],
    };
  },
  created() {
    this.parseJson();
    this.form.web3TemplateId = this.$route.query.id;
  },
  methods: {
    parseJson() {
      const configJson = JSON.parse(localStorage.curTplJson);
      console.log(configJson);
      this.configJson = configJson;
    },
    async onDeploy() {
      try {
        // const valid = await this.$refs.iptForm.validate();
        // console.log(valid);
        // if (!valid) return;
        this.$loading();
        const { data } = await this.$http.post(
          "$hosting/template/web3/project/create",
          {
            ...this.form,
            configJson: JSON.stringify(this.configJson),
          },
          {
            noTip: 1,
          }
        );
        const {
          data: { taskId },
        } = await this.$http.post(
          `$hosting/project/task/cid/${data.projectId}/deploy/create`
        );
        this.$emit("onWeb3TplDeploy", {
          projectId: data.projectId,
          taskId: taskId,
        });
      } catch (error) {
        const { data = {} } = error.response || {};
        let msg = data.message || error.message;
        await this.$alert(msg);
      }
      this.$loading.close();
    },
    getRules(item) {
      if (!item.regExp) return [];
      let regMsg = item.regMsg ?? "Invalid " + item.key;
      return [
        (v) => {
          return item.required && !v ? "required" : true;
        },
        (v) => {
          return !!v && new RegExp(item.regExp).test(v) ? true : regMsg;
        },
      ];
    },
    onBack() {
      this.$router.back();
      this.curStep -= 1;
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

::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details {
  margin: 0 !important;
}
</style>
