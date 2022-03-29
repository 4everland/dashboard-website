<template>
  <v-row class="bdrs-5 bg-f6" v-if="info">
    <v-col class="pa-5 h-flex space-btw" style="height: 174px">
      <e-kv2 :label="it.label" v-for="(it, i) in list" :key="i">
        <div class="d-flex al-c">
          <a class="line-1" :href="`#${it.to}`">
            <!-- <h-status :text="it.domain.cutStr(30)" :val="it.state"></h-status> -->
            {{ it.domain.cutStr(30) }}
          </a>
          <div class="ml-auto shrink-0">
            <e-time>{{ it.updateAt }}</e-time>
          </div>
        </div>
      </e-kv2>
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
        const it = this.info[key] || {};
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