<template>
  <div class="m-auto" style="max-width: 780px">
    <v-skeleton-loader type="article" v-if="!list" />
    <v-timeline dense align-top v-else>
      <v-timeline-item small v-for="(it, i) in list" :key="i">
        <div class="pos-r bdrs-10 bd-1">
          <video
            v-if="it.video"
            :src="it.video"
            class="d-b m-auto w100p"
            controls
            style="max-height: 360px"
          ></video>
          <v-img
            :src="
              /^http/.test(it.img)
                ? it.img
                : 'https://static1.4everland.org/' + it.img
            "
            class="w100p mb-4"
            contain
            max-height="360"
            min-height="300"
            v-else-if="it.img"
          />
        </div>
        <div class="color-1 fw-b mt-2">
          {{ it.time.toDate().format("date") }}
        </div>
        <div class="mt-3 mb-5">
          <div class="lh-2 gray-6 fz-14">
            <h3>{{ it.title }}</h3>
            <ul>
              <li v-for="(txt, j) in it.lines" :key="j" v-html="txt"></li>
            </ul>
          </div>
        </div>
        <!-- <v-divider></v-divider> -->
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    return {
      list: null,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        const { data } = await Axios.get(
          "https://static1.4everland.org/config/changelog.json"
        );
        this.list = data;
        this.$setState({
          changelogNum: data.length,
        });
        localStorage.changelogNum = data.length;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>