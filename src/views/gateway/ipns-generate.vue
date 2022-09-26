<style lang="scss">
.check-all {
  background: #e1e4e8 !important;
}
</style>

<template>
  <div>
    <v-btn color="primary" @click="onShow">
      <span class="fz-18">+</span>
      <span class="ml-1">Generate</span>
    </v-btn>
    <v-dialog v-model="showPop" max-width="600">
      <div class="pa-6 pt-5">
        <h3>Create Gateway</h3>
        <div class="pa-5" v-if="stepIdx == 0">
          <div class="fz-14 gray">Set a gateway name</div>
          <div class="al-c mt-3 mb-5">
            <v-text-field
              class="hide-msg"
              outlined
              dense
              solo
              placeholder="my company name"
              suffix=".4everland.link"
            ></v-text-field>
            <v-btn color="primary" class="ml-3">Checkout</v-btn>
          </div>
        </div>
        <template v-else>
          <div class="gray fz-13 mt-1">Gateway Access</div>
          <div class="pa-5">
            <div class="al-c hide-msg">
              <span class="mr-auto">Private Gateway</span>
              <v-switch v-model="form.isPrivate" dense></v-switch>
            </div>
            <div class="mt-1 fz-13 gray">
              Tips：Choose whether or not you want your gateway to be able to
              pull content from the whole IPFS network or just content you have
              pinned.
            </div>
            <div class="mt-3 al-c">
              <span>Using this Gateway</span>
              <e-tooltip top>
                <v-icon slot="ref" size="14" color="#999" class="ml-2"
                  >mdi-alert-circle</v-icon
                >
                <span
                  >Specify which files are accessible through the gateway,
                  including all or some projects or files.</span
                >
              </e-tooltip>
              <div class="ml-auto hide-msg" style="width: 160px">
                <v-select
                  dense
                  outlined
                  :items="useOptions"
                  item-text="text"
                  item-value="value"
                  v-model="useIdx"
                  :menu-props="{ offsetY: true }"
                ></v-select>
              </div>
            </div>
            <div class="mt-5" v-if="useIdx > 0">
              <v-skeleton-loader
                v-if="!useList"
                type="article"
              ></v-skeleton-loader>
              <e-empty v-else-if="!useList.length" class="pt-6"
                >No {{ useIdx == 1 ? "Projects" : "Buckets" }}</e-empty
              >
              <div
                v-else
                class="bd-1 bdc-d0 bg-f9 bdrs-5 mt-2 ov-a"
                style="max-height: 236px"
              >
                <div
                  @click="onCheck(it)"
                  class="pa-2 pl-5 pr-5 al-c hover-c2"
                  :class="{
                    'check-all mb-1 pa-3 pos-s top-0 z-100': i == 0,
                  }"
                  v-for="(it, i) in useList"
                  :key="i"
                >
                  <img src="/img/svg/overview/uv-dir.svg" width="14" />
                  <span class="fz-14 ml-3">{{ it.name }}</span>
                  <img
                    class="ml-auto"
                    :src="`/img/svg/overview/uv-${
                      getChecked(it) ? 'checked' : 'uncheck'
                    }.svg`"
                    width="16"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <div class="ta-c mt-5">
          <v-btn outlined width="100" @click="showPop = false">Cancel</v-btn>
          <v-btn color="primary" class="ml-6" width="100" @click="onNext">{{
            stepIdx == 0 ? "Next" : "Create"
          }}</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPop: false,
      stepIdx: 0,
      form: {
        isPrivate: true,
      },
      hostingChecked: [],
      bucketChecked: [],
      useIdx: 0,
      useOptions: [
        { text: "All", value: 0 },
        { text: "Hosting", value: 1 },
        { text: "Bucket", value: 2 },
      ],
      useList: [],
      checkAll: false,
    };
  },
  watch: {
    useIdx() {
      this.getUseList();
    },
  },
  methods: {
    async getUseList() {
      try {
        this.useList = null;
        let list = [];
        if (this.useIdx == 1) {
          let { data } = await this.$http2.get("/project/simple");
          list = data.map((it) => {
            return {
              name: it.projectName,
              id: it.projectId,
            };
          });
        }
        list.unshift({
          name: this.useIdx == 1 ? "All Projects" : "All Buckets",
          id: 0,
        });
        this.useList = list;
      } catch (error) {
        console.log(error);
      }
    },
    onCheck(it) {
      if (it.id == 0) {
        this.checkAll = !this.checkAll;
        let checked = [];
        if (this.checkAll) checked = this.useList.map((it) => it.id);
        if (this.useIdx == 1) this.hostingChecked = checked;
        else this.bucketChecked = checked;
        return;
      }
      const arr = this.useIdx == 1 ? this.hostingChecked : this.bucketChecked;
      const idx = arr.indexOf(it.id);
      if (idx > -1) arr.splice(idx, 1);
      else arr.push(it.id);
      this.checkAll = arr.length == this.useList.length;
    },
    getChecked(it) {
      if (it.id == 0) {
        return this.checkAll;
      }
      const arr = this.useIdx == 1 ? this.hostingChecked : this.bucketChecked;
      return arr.includes(it.id);
    },
    onShow() {
      this.stepIdx = 0;
      this.showPop = true;
    },
    onNext() {
      if (this.stepIdx == 0) {
        this.stepIdx = 1;
      }
    },
  },
};
</script>