<template>
  <v-list-item-icon>
    <v-icon size="18" v-if="it.icon">{{ it.icon }}</v-icon>
    <img
      v-else
      :src="`img/svg/drawer/${it.img}${active ? '-1' : '-0'}.svg`"
      width="18"
    />
  </v-list-item-icon>
</template>

<script>
export default {
  props: {
    it: Object,
    active: Boolean,
  },
};
</script>