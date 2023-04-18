<template>
  <div>
    <h3>Recommended Templates</h3>
    <v-skeleton-loader
      class="mt-10 mb-10"
      v-if="loading"
      type="article"
    ></v-skeleton-loader>
    <v-row class="mb-2" v-else>
      <v-col cols="6" v-for="it in web3TplList" :key="it.id">
        <div class="bd-1 d-b hover-1 pos-r bdrs-6" style="height: 270px">
          <img
            :style="{
              height: '160px',
              width: '100%',
              'object-fit': 'cover',
            }"
            :src="it.preview"
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
                @click.stop="onGithub(it.githubUrl)"
              />
              <v-icon
                class="ml-4"
                size="18"
                color="primary"
                @click="onPreview(it.preview)"
                >mdi-open-in-new</v-icon
              >
            </div>
            <v-btn color="primary" x-small text @click="$emit('item', it)">
              Start</v-btn
            >
          </div>
        </div>
      </v-col>
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
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    onGithub(url) {
      window.open(url);
    },
    onPreview(url) {
      window.open(url);
    },
  },
};
</script>
