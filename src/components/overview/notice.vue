<template>
  <div class="notice-container al-c">
    <v-icon size="20" class="mr-2">mdi-bell</v-icon>
    <v-carousel
      :show-arrows="false"
      vertical
      hide-delimiters
      :interval="2000"
      cycle
      height="20"
    >
      <v-carousel-item v-for="(item, i) in items" :key="i">
        <template>
          <div class="notice-content">sssss</div>
        </template>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg",
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg",
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        const { data } = await this.$http2.get("$auth/broadcast");
        console.log(data);
      } catch (error) {
        //
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.notice-container {
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  border: 1px solid rosybrown;
}
.notice-content {
  height: 100%;
  line-height: 20px;
}
</style>