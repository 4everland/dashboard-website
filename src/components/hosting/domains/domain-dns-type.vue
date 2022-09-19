<template>
  <div>
    <v-radio-group v-model="type" mandatory>
      <v-radio
        class="mb-3"
        v-for="(it, i) in options"
        :key="i"
        :label="it.label"
        :value="it.value"
      ></v-radio>
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
          label: `Add www.${this.domain} and redirect ${this.domain} to it`,
        },
        {
          value: 1,
          label: `Add ${this.domain} and redirect www.${this.domain} to it`,
        },
        {
          value: 2,
          label: `Add ${this.domain}`,
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