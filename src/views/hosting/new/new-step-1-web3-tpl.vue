<template>
  <div class="main-wrap" style="min-height: 551px">
    <e-platform :platform.sync="form.platform"></e-platform>
    <h3 style="margin-top: 56px">The Project Name</h3>
    <v-text-field
      class="mt-4"
      persistent-placeholder
      outlined
      placeholder="Enter the project name"
      v-model="form.projectName"
      dense
      :rules="[(v) => !!(v || '').trim() || 'Please enter a project name']"
    ></v-text-field>

    <h3 style="margin-top: 48px; margin-bottom: 36px">Edit Configurations</h3>
    <template-config ref="configRef" :configJson="configJson"></template-config>
    <div class="d-flex justify-center mt-7">
      <v-btn color="primary" min-width="100" @click="onDeploy">Deploy</v-btn>
      <v-btn outlined class="ml-6" min-width="100" @click="$emit('back')"
        >Back</v-btn
      >
    </div>
  </div>
</template>

<script>
import TemplateConfig from "../common/template-config.vue";
export default {
  components: {
    TemplateConfig,
  },
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
        projectName: "",
        web3TemplateId: null,
      },
      configJson: {},
    };
  },
  created() {
    this.parseJson();
    this.form.web3TemplateId = this.$route.query.id;
  },
  methods: {
    parseJson() {
      const configJson = JSON.parse(localStorage.curTplJson);
      let tags = configJson.config.filter((it) => it.tag).map((it) => it.tag);
      tags = this.unique(tags);
      this.configJson = this.tagGrouping(tags, configJson.config);
    },
    async onDeploy() {
      try {
        // const valid = await this.$refs.iptForm.validate();
        // console.log(valid);
        // if (!valid) return;
        let configJson = {
          config: [],
        };
        this.configJson.forEach((it) => {
          if (it.groupName) {
            configJson.config.push(...it.group);
          } else {
            configJson.config.push(it);
          }
        });
        this.$loading();
        const { data } = await this.$http.post(
          "$hosting/template/web3/project/create",
          {
            ...this.form,
            configJson: JSON.stringify(configJson),
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
    unique(arr) {
      return arr.filter(function (item, index, arr) {
        return arr.indexOf(item, 0) === index;
      });
    },
    tagGrouping(group, arr) {
      let configs = [];
      group.forEach((it) => {
        let group = { groupName: it, group: [], col: 2 };
        configs.push(group);
        for (const configItem of arr) {
          if (configItem.tag == it) {
            group.group.push(configItem);
          }
        }
      });
      const noTags = arr
        .filter((it) => !it.tag)
        .map((it) => {
          if (
            it.options.some(
              (it) =>
                it.type == "table" ||
                it.type == "switch" ||
                it.type == "textarea"
            )
          ) {
            it.col = 1;
          }
          return it;
        });
      configs = configs.concat(noTags);
      return configs;
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
