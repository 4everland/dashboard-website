<template>
  <div class="al-c">
    <v-btn
      @click="curIdx = i"
      :outlined="i != curIdx"
      :color="i == curIdx ? 'primary' : ''"
      depressed
      class="mr-5"
      small
      v-for="(it, i) in list"
      :key="i"
    >
      {{ it.text }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    options: Array,
    unit: String,
  },
  computed: {
    list() {
      return this.options.map((num) => {
        if (this.unit == "Min")
          return {
            num,
            text: num + " " + this.unit,
          };
        return {
          num,
          text: this.$utils.getFileSize(num, false, 0),
        };
      });
    },
  },
  data() {
    return {
      curIdx: 0,
    };
  },
};
</script>