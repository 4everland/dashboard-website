<template>
  <div>
    <div class="al-c fz-14 mt-5 hide-msg" v-if="expired">
      <span class="mr-3">Effective Time:</span>
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
    <div v-else class="mt-2 fz-14">
      <p>
        <e-kv label="Current capacity:">
          <span class="color-1">{{ curStor }}</span>
        </e-kv>
      </p>
      <p class="mt-3">
        <e-kv label="Service duration:">
          <span
            >{{ formatTime(usage.ipfsStorageStart) }} -
            {{ formatTime(usage.ipfsStorageExpired) }}</span
          >
        </e-kv>
      </p>
      <div class="mt-5 hide-msg">
        <e-expand-btn>
          <div class="al-c" style="min-height: 30px">
            <div style="min-width: ">
              <v-switch label="Add the capacity" v-model="moreStor"></v-switch>
            </div>
            <div class="al-c" v-if="moreStor">
              <span class="ml-1 mr-4">:</span>
              <usage-input
                v-model="form.stor"
                :min="10"
                :max="10000"
                :step="10"
              />
              <span class="ml-2 fz-14">GB</span>
            </div>
          </div>
          <div class="ml-11 mt-2 gray" v-if="moreStor">
            The usage time of additional resources will be from now until
            {{ formatTime(usage.ipfsStorageExpired) }}
          </div>
          <div class="al-c mt-4" style="min-height: 30px">
            <v-switch
              label="Extend service duration"
              v-model="moreMon"
            ></v-switch>
            <div class="al-c" v-if="moreMon">
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
          <div class="ml-11 mt-2 gray" v-if="moreMon">
            The increased service time will include the {{ curStor }} memory
            purchased before
            {{
              moreStor
                ? `and the ${form.stor}GB memory purchased this time`
                : ""
            }}
          </div>
        </e-expand-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    usage: Object,
    expired: Boolean,
  },
  data() {
    return {
      moreStor: false,
      moreMon: false,
      form: {
        stor: 10,
        month: 1,
      },
    };
  },
  computed: {
    curStor() {
      return this.$utils.getFileSize(this.usage.ipfsStorage);
    },
  },
  watch: {
    moreStor() {
      this.onInput();
    },
    moreMon() {
      this.onInput();
    },
    "form.stor"() {
      this.onInput();
    },
    "form.month"() {
      this.onInput();
    },
  },
  methods: {
    formatTime(time) {
      return new Date(time * 1e3).format("date");
    },
    onInput() {
      const body = {
        stor: 0,
        month: 0,
      };
      const form = this.form;
      if (this.expired || this.moreMon) {
        body.month = form.month;
      }
      if (this.moreStor) {
        body.stor = form.stor;
      }
      this.$emit("input", body);
    },
  },
};
</script>