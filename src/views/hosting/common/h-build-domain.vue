<template>
  <v-row v-if="info">
    <v-col v-for="(it, i) in list" :key="i">
      <div class="bg-f8 bdrs-8 pa-4 pl-6 pr-6">
        <div class="d-flex al-c" v-if="it.domain">
          <span class="gray-6 fz-14 mr-5">{{ it.label }}</span>
          <e-link class="line-1 fz-14" :href="it.to">
            {{ it.domain }}
          </e-link>
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
    platform: String,
  },
  computed: {
    list() {
      console.log(this.platform);
      const { name, id } = this.info;
      const getObj = (key) => {
        let it = {};
        if (this.platform == "IC") {
          it = this.info["latest"];
        } else {
          it = this.info[key];
        }
        if (key == "production" && !it.taskId) {
          it = {
            ...this.info.latest,
            domain: it.domain,
          };
        }
        let to = `/hosting/build/${name}/${id}/${it.taskId}`;
        if (key == "production") to += "?prod=1";

        return {
          label: key.capitalize(),
          to,
          ...it,
        };
      };
      return [getObj("production"), getObj("latest")];
    },
  },
};
</script>