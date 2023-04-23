<template>
  <div style="height: calc(75vh - 215px)">
    <h3>Recommended Templates</h3>
    <v-skeleton-loader
      class="mt-10 mb-10"
      v-if="loading"
      type="article"
    ></v-skeleton-loader>
    <v-row class="mb-2 pos-r ov-h" v-else style="max-height: 95%">
      <v-col xl="4" cols="6" v-for="it in web3TplList" :key="it.id">
        <!-- @click="$emit('item', it)" -->

        <div
          class="bd-1 d-b hover-1 pos-r bdrs-6 ov-h"
          v-ripple
          style="height: 250px"
        >
          <img
            :style="{
              height: '130px',
              width: '100%',
              'object-fit': 'cover',
            }"
            :src="it.backgroundImage"
            alt=""
          />
          <div class="px-2">
            <h2 class="gray-3 fz-16 mb-1">{{ it.name }}</h2>
            <p
              class="gray line-2"
              style="line-height: 18px"
              :class="asMobile ? 'fz-12' : 'fz-14'"
            >
              {{ it.desc }}
            </p>
          </div>
          <div
            class="px-2 al-c space-btw pos-a left-0 btm-0 pb-2"
            style="width: 100%"
          >
            <!-- <div class="fz-14">Deploy</div> -->

            <div class="al-c">
              <img
                width="18"
                src="/img/svg/hosting/m-github.svg"
                alt=""
                @click.stop="openLink(it.githubUrl)"
              />
              <img
                class="ml-4"
                width="18"
                src="/img/svg/hosting/preview.svg"
                alt=""
                @click.stop="openLink(it.preview)"
              />
            </div>
            <v-btn color="primary" x-small text>Start</v-btn>
          </div>
        </div>
      </v-col>
      <v-col xl="4" cols="6">
        <div
          class="
            bd-1
            d-b
            hover-1
            pos-r
            bdrs-6
            d-flex
            al-c
            flex-column
            justify-center
          "
          v-ripple
          style="height: 250px"
          @click="openLink('https://github.com/4everland/Templates')"
        >
          <v-icon size="50" color="primary">mdi-plus</v-icon>
          <h3 class="fz-16 mt-5">Submit a template</h3>
        </div>
      </v-col>

      <div class="garlxy pos-a al-c justify-center flex-column">
        <h3 class="fz-18">Template Deployment - WL Only</h3>
        <a href="https://discord.com/invite/4everland" target="__blank"
          >More info</a
        >
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      web3TplList: [],
      loading: true,
    };
  },
  created() {
    this.getWeb3TplList();
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    // tplList() {
    //   const arr = ["vue", "create-react-app", "nextjs", "nuxtjs"];
    //   return arr.map((name) => {
    //     return this.$getFramework(name);
    //   });
    // },
  },
  methods: {
    async getWeb3TplList() {
      try {
        this.loading = true;
        const { data } = await this.$http("$hosting/template/web3/list");
        console.log(data, "data");
        this.web3TplList = this.web3TplList.concat(data);
        this.$emit("list", this.web3TplList);
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    openLink(url) {
      window.open(url);
    },
  },
};
</script>
<style lang="scss" scoped>
.garlxy {
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}
</style>
