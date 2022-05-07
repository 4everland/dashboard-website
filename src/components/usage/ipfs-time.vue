<template>
  <div>
    <div class="al-c fz-14 mt-5 hide-msg">
      <span class="mr-3">Effective Time:</span>
      <v-select
        class="mt-0"
        v-model="month"
        :items="[1, 2, 3, 6, 12]"
        style="max-width: 50px"
        dense
        :menu-props="{
          offsetY: true,
        }"
      ></v-select>
      <span class="ml-2">Month</span>
    </div>
    <div class="mt-3 fz-14">
      <p>
        <label class="gray-7">Current: </label>
        <span class="color-1">200GB</span>
      </p>
      <p class="mt-3">
        <label class="gray-7">Effective Time: </label>
        <span>2022</span>
      </p>
      <div class="mt-5">
        <e-expand-btn></e-expand-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      month: 1,
    };
  },
};
</script>