<template>
  <div>
    <v-skeleton-loader
      v-if="JSON.stringify(configJson) == '{}'"
      type="article"
    ></v-skeleton-loader>
    <div v-else class="main-wrap">
      <template-config :configJson="configJson"></template-config>
      <div class="al-c justify-center mt-8">
        <v-btn
          width="100"
          color="primary"
          @click="handleDeploy"
          :disabled="disableDeploy"
          >Deploy</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import TemplateConfig from "../common/template-config.vue";
import { mapState } from "vuex";
export default {
  components: {
    TemplateConfig,
  },
  data() {
    return {
      configJson: {},
    };
  },
  props: {
    active: Boolean,
  },
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      userInfo: (s) => s.userInfo,
    }),
    disableDeploy() {
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
      return this.info.configJson == JSON.stringify(configJson);
    },
  },
  created() {
    this.getConfigJson();
  },
  methods: {
    getConfigJson() {
      const configJson = JSON.parse(this.info.configJson);
      let tags = configJson.config.filter((it) => it.tag).map((it) => it.tag);
      tags = this.unique(tags);
      this.configJson = this.tagGrouping(tags, configJson.config);
    },

    async handleDeploy() {
      try {
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

        await this.$confirm(
          "The changes will take effect after redeployment. Are you sure you want to proceed?",
          "Tip"
        );
        this.$loading();
        const { data } = await this.$http.post(
          "$hosting/template/web3/project/redeploy",
          {
            web3TemplateId: this.info.web3TemplateId,
            configJson: JSON.stringify(configJson),
            projectId: this.info.id,
          }
        );
        this.$router.push(
          `/hosting/build/${this.info.name}/${this.info.id}/${data.taskId}`
        );
      } catch (error) {
        console.log(error);
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
          console.log(it);
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
  },
  watch: {
    active(val) {
      if (val) this.getConfigJson();
    },
  },
};
</script>

<style lang="scss" scoped></style>
