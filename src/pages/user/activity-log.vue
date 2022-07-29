<template>
  <div>
    <div class="al-c" v-for="it in list" :key="it.id">
      <v-avatar size="40" class="bg-white d-b bd-1">
        <svg
          style="display: block"
          width="80"
          height="80"
          :data-jdenticon-value="it.guid"
        ></svg>
      </v-avatar>
      <div class="ml-4 fz-14">
        <div>
          <span>{{ it.guid }}</span>
        </div>
        <div class="gray">
          <e-time>{{ it.operateAt }}</e-time>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          id: 1,
          guid: "ddd",
          operateAt: Date.now(),
        },
      ],
    };
  },
  mounted() {
    // this.getList();
    this.updateIcon();
  },
  methods: {
    updateIcon() {
      setTimeout(() => {
        window.jdenticon();
      }, 100);
    },
    async getList() {
      try {
        const api = this.$inDev ? "https://log.foreverland.xyz" : "";
        const { data } = await this.$http2.get(api + "/action/logs", {
          params: {
            time: Date.now(),
          },
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>