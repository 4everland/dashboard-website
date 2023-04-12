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
        <div
          class="bd-1 d-b hover-1 pos-r"
          style="height: 270px"
          v-ripple
          @click="$emit('item', it)"
        >
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
            <v-btn color="primary" x-small> Deploy</v-btn>
            <img width="18" src="/img/svg/hosting/m-github.svg" alt="" />
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
        const testArr = [
          {
            id: 0,
            name: "profile tpl",
            desc: "test test testst test tesst test tesst test tesst test tesst test tesst test tes",
            preview:
              "https://bzzb.foreverland-bucket.xyz/16%20%E4%B8%AA%E5%85%8D%E8%B4%B9%E5%9B%BE%E5%BA%8A%E7%BD%91%E7%AB%99%E5%85%A8%E6%94%B6%E9%9B%86-%20%E7%A8%B3%E5%AE%9A%E5%9B%BD%E5%86%85%E5%8F%AF%E7%94%A8%E6%94%AF%E6%8C%81%E5%A4%96%E9%93%BE%E5%9B%BE%E7%89%87%E6%9C%8D%E5%8A%A1%E6%8E%A8%E8%8D%90(%E5%90%AB%E6%B5%8B%E9%80%9F%E5%AF%B9%E6%AF%94)%20-%20%E5%BC%82%E6%AC%A1%E5%85%83%E8%BD%AF%E4%BB%B6%E4%B8%8B%E8%BD%BD.jpg",
            githubUrl: "https://github.com/",
            configJson: JSON.stringify({
              Banner: [
                {
                  type: "text",
                  key: "banner",
                  value: "",
                  placeholder: "请输入banner链接",
                },
              ],
              Avatar: [
                {
                  type: "text",
                  key: "avatar",
                  value: "",
                  placeholder: "请输入avatar链接",
                },
              ],
              Twitter: [
                {
                  type: "text",
                  key: "twitterName",
                  value: "",
                  placeholder: "请输入Twitter名称",
                },
                {
                  type: "text",
                  key: "twitterLink",
                  value: "",
                  placeholder: "请输入Twitter链接",
                },
              ],
            }),
          },
          {
            id: 1,
            name: "chatgpt tpl",
            desc: "test test test",
            preview:
              "https://bzzb.foreverland-bucket.xyz/16%20%E4%B8%AA%E5%85%8D%E8%B4%B9%E5%9B%BE%E5%BA%8A%E7%BD%91%E7%AB%99%E5%85%A8%E6%94%B6%E9%9B%86-%20%E7%A8%B3%E5%AE%9A%E5%9B%BD%E5%86%85%E5%8F%AF%E7%94%A8%E6%94%AF%E6%8C%81%E5%A4%96%E9%93%BE%E5%9B%BE%E7%89%87%E6%9C%8D%E5%8A%A1%E6%8E%A8%E8%8D%90(%E5%90%AB%E6%B5%8B%E9%80%9F%E5%AF%B9%E6%AF%94)%20-%20%E5%BC%82%E6%AC%A1%E5%85%83%E8%BD%AF%E4%BB%B6%E4%B8%8B%E8%BD%BD.jpg",
            githubUrl: "https://github.com/",
            configJson: "json",
          },
        ];
        this.web3TplList = this.web3TplList.concat(testArr);
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
