<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <div
          class="main-wrap"
          :style="{
            'min-height': minHeight,
          }"
        >
          <h3>Import Git Repository</h3>
          <new-step-0-git
            ref="git"
            :active="active"
            @list="onGitList"
            @select="onImport"
          />
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div class="main-wrap">
          <new-step-0-hash @onHashStart="onHashStart"></new-step-0-hash>
        </div>
        <div class="main-wrap mt-5">
          <!-- <new-step-0-tpl @item="onTplItem" /> -->

          <!-- <new-step-0-web3tpl></new-step-0-web3tpl> -->
          <!-- <NewStep0Web3Tpl @item="onWeb3TplItem"></NewStep0Web3Tpl> -->
          <new-step-0-web3-tpl
            @list="onWeb3List"
            @item="onWeb3TplItem"
          ></new-step-0-web3-tpl>
        </div>
      </v-col>
    </v-row>

    <div class="ta-c fz-14 mt-5">
      Want to deploy with the CLI?
      <a href="https://docs.4everland.org/hositng/hosting-cli" target="__blank"
        >Find out more</a
      >
    </div>
  </div>
</template>

<script>
import NewStep0Git from "@/views/hosting/new/new-step-0-git";
// import NewStep0Tpl from "@/views/hosting/new/new-step-0-tpl";
import NewStep0Web3Tpl from "@/views/hosting/new/new-step-0-web3-tpl";
import NewStep0Hash from "@/views/hosting/new/new-step-0-hash";

export default {
  props: {
    active: Boolean,
  },
  data() {
    const { c } = this.$route.query;
    return {
      minHeight: "75vh",
      cloneDir: c,
      isClone: false,
    };
  },
  methods: {
    onTplItem(it) {
      // const gitref = this.$refs.git;
      // if (!gitref.isBind) return gitref.addNew();
      const src =
        "https://github.com/4everland/project-templates/tree/main/examples/" +
        it.slug;
      const link = `/hosting/new?type=clone-flow&s=${encodeURIComponent(src)}`;
      this.$navTo(link);
    },
    onImport(it) {
      this.$emit("set-info", it);
      this.$router.push("/hosting/new?c=" + it.name);
      this.$emit("next");
    },
    onGitList(list) {
      if (this.cloneDir) {
        const item = list.filter((it) => it.name == this.cloneDir)[0];
        if (item) {
          this.isClone = true;
          this.onImport(item);
        }
        this.cloneDir = "";
      }
    },

    onWeb3List(list) {
      if (this.$route.query.id && this.$route.query.type == "web3Tpl") {
        const item = list.filter((it) => it.id == this.$route.query.id)[0];
        if (item) {
          this.onWeb3TplItem(item);
        }
      }
    },
    onHashStart({ hash, deployType }) {
      this.$router.push(
        `/hosting/new?type=hash&deployType=${deployType}&hash=${hash}`
      );
      this.$emit("next");
    },
    onWeb3TplItem(it) {
      localStorage.setItem("curTplJson", it.configJson);
      const link = `/hosting/new?type=web3Tpl&id=${it.id}`;
      this.$navTo(link);
      this.$emit("next");
    },
  },
  components: {
    NewStep0Git,
    // NewStep0Tpl,
    NewStep0Hash,
    NewStep0Web3Tpl,
  },
};
</script>