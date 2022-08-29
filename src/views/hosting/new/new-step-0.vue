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
        <div
          class="main-wrap"
          :style="{
            'min-height': minHeight,
          }"
        >
          <new-step-0-tpl @item="onTplItem" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NewStep0Git from "@/views/hosting/new/new-step-0-git";
import NewStep0Tpl from "@/views/hosting/new/new-step-0-tpl";

export default {
  props: {
    active: Boolean,
  },
  data() {
    const { c } = this.$route.query;
    return {
      minHeight: "551px",
      cloneDir: c,
      isClone: false,
    };
  },
  methods: {
    onTplItem(it) {
      const gitref = this.$refs.git;
      if (!gitref.isBind) return gitref.addNew();
      const src =
        "https://github.com/4everland/project-templates/tree/main/examples/" +
        it.slug;
      const link = `/hosting/new?type=clone-flow&s=${encodeURIComponent(
        src
      )}&n=${it.name}`;
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
  },
  components: {
    NewStep0Git,
    NewStep0Tpl,
  },
};
</script>