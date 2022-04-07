<template>
  <div>
    <h3>Clone Template</h3>
    <div class="gray fz-15">Alternatively, get Started with template</div>
    <v-row class="mt-2 mb-2">
      <v-col cols="6" v-for="(it, i) in tplList" :key="i">
        <div
          class="bd-1 d-b hover-1 pos-r pd-20"
          style="height: 192px"
          :style="{
            background: `-webkit-linear-gradient(-65deg, ${it.bg1}, #fff 50%)`,
          }"
          v-ripple
          @click="$emit('item', it)"
        >
          <h2 class="gray-3 fz-16 mb-2">{{ it.name }}</h2>
          <p class="gray" :class="asMobile ? 'fz-12' : 'fz-14'">
            {{ it.solution }}
          </p>
          <img
            :src="it.logo"
            class="pos-a right-0 btm-0 pa-3"
            :style="{
              height: asMobile ? '55px' : '70px',
            }"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    tplList() {
      const arr = ["vue", "create-react-app", "nextjs", "nuxtjs"];
      return arr.map((name) => {
        return this.$getFramework(name);
      });
    },
  },
};
</script>