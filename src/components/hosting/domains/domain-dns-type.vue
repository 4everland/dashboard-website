<template>
  <div>
    <v-radio-group v-model="type" mandatory>
      <v-radio
        class="mb-4"
        v-for="(it, i) in options"
        :key="i"
        :label="it.label"
        :value="it.value"
      >
        <template v-slot:label>
          <div class="fz-15" v-html="it.label"></div>
        </template>
      </v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    domain: String,
  },
  data() {
    return {
      type: 0,
    };
  },
  computed: {
    options() {
      return [
        {
          value: 0,
          label: `Add <span class="color-1">www.${this.domain}</span> and redirect <span class="color-1">${this.domain}</span> to it`,
        },
        {
          value: 1,
          label: `Add <span class="color-1">${this.domain}</span> and redirect <span class="color-1">www.${this.domain}</span> to it`,
        },
        {
          value: 2,
          label: `Add <span class="color-1">${this.domain}</span>`,
        },
      ];
    },
  },
  watch: {
    type() {
      this.$emit("input", {
        type: this.type,
      });
    },
  },
};
</script>