<template>
  <div class="pos-r">
    <e-right-opt-wrap fix style="top: -10px">
      <e-menu offset-y open-on-hover>
        <v-btn slot="ref" outlined color="#6C7789">
          <span class="ml-2">{{ date }}</span>
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
        <v-date-picker v-model="date" :allowed-dates="isAllow"></v-date-picker>
      </e-menu>
    </e-right-opt-wrap>

    <v-skeleton-loader
      v-if="!list"
      type="article"
      style="max-width: 400px; min-height: 300px"
    ></v-skeleton-loader>
    <e-empty v-else-if="!list.length" class="pt-10">No Logs</e-empty>
    <template v-else>
      <div class="al-c mb-5" v-for="it in list" :key="it.id">
        <!-- <div class="bdrs-100 bd-1">
        </div> -->
        <e-avatar :diameter="34" :address="it.addr"></e-avatar>

        <div class="ml-4 fz-14">
          <div>
            <span>{{ it.label }}</span>
            <span class="ml-5">{{ it.desc }}</span>
          </div>
          <div class="gray mt-1 fz-12">
            <span>{{ new Date(it.operateAt * 1e3).format() }}</span>
            <template v-if="it.path">
              <span class="ml-2">in</span>
              <e-link class="ml-2" :href="it.link">
                <u class="gray">{{ it.path }}</u>
              </e-link>
            </template>
          </div>
        </div>
      </div>
    </template>
    <e-pagi
      class="pa-5"
      @input="getList"
      v-model="page"
      :limit="10"
      :total="total"
    />
  </div>
</template>

<script>
const now = new Date();
export default {
  data() {
    return {
      list: null,
      date: now.format("yy-MM-dd"),
      page: 1,
      total: 0,
      start: "2022-7-27".toDate() * 1,
    };
  },
  mounted() {
    setTimeout(() => {
      this.list = [];
    }, 5000);
  },
};
</script>

<style lang="scss" scoped>
</style>