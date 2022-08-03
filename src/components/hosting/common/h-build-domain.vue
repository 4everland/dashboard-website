<template>
  <v-row v-if="info">
    <v-col v-for="(it, i) in list" :key="i">
      <div class="bg-f8 bdrs-8 pa-4 pl-6 pr-6">
        <div class="d-flex al-c" v-if="it.domain">
          <span class="gray-6 fz-14 mr-5">{{ it.label }}</span>
          <a class="line-1" :href="`#${it.to}`">
            {{ it.domain.cutStr(30) }}
          </a>
          <div class="ml-auto shrink-0">
            <e-time span-class="gray fz-14">{{ it.updateAt }}</e-time>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    info: Object,
  },
  computed: {
    list() {
      const { name, id } = this.info;
      const getObj = (key) => {
        let it = this.info[key] || {};
        if (key == "production" && !it.taskId) {
          it = {
            ...this.info.latest,
            domain: it.domain,
          };
        }
        return {
          label: key.capitalize(),
          to: `/hosting/build/${name}/${id}/${it.taskId}`,
          ...it,
        };
      };
      return [getObj("production"), getObj("latest")];
    },
  },
};
</script>