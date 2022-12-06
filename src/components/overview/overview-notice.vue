<template>
  <div class="notice-container al-c" v-if="noticeList.length">
    <img width="20" class="mr-4" src="/img/svg/overview/notice.svg" alt="" />
    <v-carousel
      :show-arrows="false"
      vertical
      hide-delimiters
      :interval="5000"
      cycle
      height="30"
    >
      <v-carousel-item
        v-for="item in list"
        :reverse-transition="true"
        :key="item.id"
      >
        <template>
          <div class="notice-content">
            <a class="fz-14 message" :href="item.url">{{ item.message }}</a>
          </div>
        </template>
      </v-carousel-item>
    </v-carousel>
    <v-icon size="20" color="#ff994e" @click="handleCloseNotice"
      >mdi-close</v-icon
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      noticeList: [],
    };
  },
  created() {
    this.getList();
  },
  computed: {
    list() {
      let list = this.noticeList;
      if (this.noticeList.length == 2) {
        let transformList = this.noticeList.map((it) => {
          return {
            id: it.id + "-" + it.id,
            message: it.message,
            url: it.url,
          };
        });
        list = list.concat(transformList);
      }
      return list;
    },
  },
  methods: {
    async getList() {
      try {
        const { data } = await this.$http2.get("$auth/broadcast", { noTip: 1 });
        console.log(data);
        const historyNoticeList = JSON.parse(localStorage.getItem("notice"));
        this.noticeList = historyNoticeList
          ? historyNoticeList.concat(data.list)
          : data.list;
        localStorage.setItem("notice", JSON.stringify(this.noticeList));
      } catch (error) {
        //
        console.log(error);
        this.noticeList = JSON.parse(localStorage.getItem("notice"))
          ? JSON.parse(localStorage.getItem("notice"))
          : [];
      }
    },
    handleCloseNotice() {
      this.noticeList = [];
      localStorage.removeItem("notice");
    },
  },
};
</script>

<style lang="scss" scoped>
.notice-container {
  height: 50px;
  padding: 0 20px;
  border-radius: 10px;
  background: #fff2e8;
  // box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
  //   0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
.notice-content {
  height: 100%;
  line-height: 30px;
  .message {
    color: #ff994e;
  }
}
</style>