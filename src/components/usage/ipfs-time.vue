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
        <e-kv label="Current:">
          <span class="color-1">200GB</span>
        </e-kv>
      </p>
      <p class="mt-3">
        <e-kv label="Effective Time:">
          <span>2022</span>
        </e-kv>
      </p>
      <div class="mt-5 hide-msg">
        <e-expand-btn>
          <div class="al-c" style="min-height: 30px">
            <div style="min-width: ">
              <v-switch label="Add Limit" v-model="showLimit"></v-switch>
            </div>
            <div class="al-c" v-if="showLimit">
              <span class="ml-1 mr-4">:</span>
              <usage-input
                v-model="form.limit"
                :min="100"
                :max="10000"
                :step="100"
              />
              <span class="ml-2 fz-14">GB</span>
            </div>
          </div>
          <div class="al-c mt-4" style="min-height: 30px">
            <v-switch
              label="Extend effective time"
              v-model="showExtend"
            ></v-switch>
            <div class="al-c" v-if="showExtend">
              <span class="ml-1 mr-4">:</span>
              <v-select
                class="mt-0"
                v-model="form.month"
                :items="[1, 2, 3, 6, 12]"
                style="max-width: 50px"
                dense
                :menu-props="{
                  offsetY: true,
                }"
              ></v-select>
              <span class="ml-2">Month</span>
            </div>
          </div>
        </e-expand-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      month: 1,
      showLimit: false,
      showExtend: false,
      form: {
        limit: 100,
        month: 1,
      },
    };
  },
};
</script>