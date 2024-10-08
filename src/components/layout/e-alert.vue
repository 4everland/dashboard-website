<template>
  <div>
    <v-snackbar
      top
      outlined
      :color="noticeInfo.color || 'primary'"
      timeout="2000"
      v-bind="noticeInfo.attrs"
      v-model="showSnackbar"
    >
      <div class="snackbar-content">
        <div v-html="noticeInfo.content"></div>
      </div>
      <!-- <template #action>
        <v-btn text @click="showSnackbar = false"> close </v-btn>
      </template> -->
    </v-snackbar>

    <v-dialog
      v-model="showLoading"
      max-width="280px"
      :persistent="alertInfo.persistent"
    >
      <v-card>
        <div class="ta-c pd-30">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <div class="mt-5" v-if="alertInfo.title">
            {{ alertInfo.title }}
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showAlert"
      :max-width="alertInfo.maxWidth || 600"
      width="600"
      :persistent="alertInfo.persistent"
    >
      <v-card class="pd-10">
        <v-card-title v-if="!alertInfo.hideTitle">
          <!-- <v-icon v-show="!alertInfo.hideIcon" :color="iconColor" class="mr-2">
            {{ iconName }}
          </v-icon> -->
          <b style="word-break: break-word">{{
            alertInfo.title
              ? alertInfo.title
              : alertInfo.showCancel
              ? "Confirm"
              : "Tip"
          }}</b>
        </v-card-title>
        <div v-else class="pd-15"></div>

        <v-card-text>
          <div class="pa-5">
            <div
              class="fz-16 gray-6"
              :class="{
                'text-center': alertInfo.textCenter,
              }"
              v-html="alertInfo.content"
            ></div>
            <div class="mt-10" v-if="alertInfo.showInput">
              <v-form ref="form" lazy-validation @submit.native.prevent>
                <v-text-field
                  persistent-placeholder
                  v-model.trim="inputVal"
                  autofocus
                  dense
                  autocomplete="off"
                  v-bind="alertInfo.inputAttrs"
                  @keyup.enter="hideAlert(1)"
                ></v-text-field>
                <v-text-field
                  persistent-placeholder
                  class="mt-8"
                  v-if="alertInfo.input2Attrs"
                  v-model="inputVal2"
                  dense
                  autocomplete="off"
                  v-bind="alertInfo.input2Attrs"
                  @keyup.enter="hideAlert(1)"
                ></v-text-field>
              </v-form>
            </div>
            <component
              :is="alertInfo.comp1"
              v-if="alertInfo.comp1"
              v-bind="alertInfo.comp1Props"
              :form="alertInfo.form1"
              @input="onForm1"
            ></component>
          </div>
        </v-card-text>
        <v-card-actions class="pb-3 ta-c">
          <v-spacer></v-spacer>

          <v-btn
            :min-width="asMobile ? 120 : 180"
            v-bind="{
              color: 'primary',
              ...alertInfo.confirmTextAttrs,
            }"
            v-if="!alertInfo.hideConfirm"
            @click="hideAlert(1)"
          >
            {{ alertInfo.confirmText || "OK" }}
          </v-btn>
          <v-btn
            outlined
            :min-width="asMobile ? 120 : 180"
            class="ml-6"
            v-if="alertInfo.showCancel"
            @click="hideAlert(0)"
          >
            {{ alertInfo.cancelText || "Cancel" }}
          </v-btn>
          <v-btn
            class="ml-4"
            color="primary"
            v-clipboard="alertInfo.copyText"
            @success="hideAlert(1)"
            v-if="alertInfo.copyText"
          >
            {{ alertInfo.copyBtnText || "Copy" }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar top timeout="2000" dark v-model="showBoosterSnackbar">
      <div class="snackbar-content d-flex align-center">
        <img
          v-show="boosterToastInfo.type == 'success'"
          class="mr-3"
          src="/img/svg/success.svg"
          width="20"
          alt=""
        />
        <img
          v-show="boosterToastInfo.type == 'error'"
          class="mr-3"
          src="/img/svg/error.svg"
          width="20"
          alt=""
        />
        <img
          v-show="boosterToastInfo.type == 'info'"
          class="mr-3"
          src="/img/svg/info.svg"
          width="20"
          alt=""
        />

        <div>{{ boosterToastInfo.content }}</div>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      alertInfo: (s) => s.alertInfo,
    }),
    iconName() {
      const { type, icon } = this.alertInfo;
      if (icon) return icon;
      return type == "success" ? "mdi-check-circle" : "mdi-alert-circle";
    },
    iconColor() {
      const { type, iconColor } = this.alertInfo;
      return iconColor || type || "warning";
    },
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    return {
      showAlert: false,
      showLoading: false,
      showSnackbar: false,
      inputVal: "",
      inputVal2: "",
      noticeInfo: {},
      showBoosterSnackbar: false,
      boosterToastInfo: {},
    };
  },
  watch: {
    alertInfo(info) {
      this.showAlert = false;
      this.showLoading = false;
      this.form1 = null;
      if (info.type == "loading") {
        this.showLoading = info.isLoading;
      } else if (info.type == "snackbar") {
        this.showSnackbar = true;
      } else this.showAlert = true;
    },
    showAlert(val) {
      if (val) this.isComplete = false;
      // else if (!this.isComplete) {
      //   const res = this.alertInfo.type == "alert" ? 1 : 0;
      //   this.hideAlert(res);
      // }
    },
  },
  created() {
    const showModal = (config) => {
      return new Promise((resolve, reject) => {
        if (config.showInput) {
          setTimeout(() => {
            this.$refs.form.reset();
          }, 5);
          setTimeout(() => {
            let val = config.defaultValue;
            if (val) this.inputVal = val;
          }, 10);
        }
        this.$setState({
          alertInfo: {
            ...config,
            success(e) {
              resolve(e);
            },
            fail(e) {
              reject(e);
            },
          },
        });
      });
    };
    Vue.prototype.$loading = (title, opts = {}) => {
      return showModal({
        title,
        ...opts,
        type: "loading",
        isLoading: true,
      });
    };
    Vue.prototype.$loading.close = () => {
      return showModal({
        type: "loading",
        isLoading: false,
      });
    };

    Vue.prototype.$alert = (content, title, opts = {}) => {
      return showModal({
        type: "alert",
        title,
        content,
        ...opts,
      });
    };
    Vue.prototype.$confirm = (content, title, opts = {}) => {
      return showModal({
        type: "confirm",
        title,
        content,
        showCancel: true,
        ...opts,
      });
    };
    Vue.prototype.$prompt = (content, title, opts = {}) => {
      return showModal({
        type: "prompt",
        title,
        content,
        showCancel: true,
        showInput: true,
        ...opts,
      });
    };
    Vue.prototype.$toast = Vue.prototype.$notice = (
      content,
      color,
      attrs = {},
      opts = {}
    ) => {
      this.showSnackbar = false;
      if ((!color && /success|copied/i.test(content)) || color == 1) {
        color = "success";
      }
      this.noticeInfo = {
        type: "snackbar",
        content,
        color,
        attrs,
        ...opts,
      };
      this.showSnackbar = true;
    };

    Vue.prototype.$toast2 = (content, type = "success") => {
      this.showBoosterSnackbar = false;
      this.boosterToastInfo = {
        content,
        type,
      };
      this.showBoosterSnackbar = true;
    };
  },
  methods: {
    onForm1(form) {
      this.form1 = form;
    },
    async hideAlert(isOk) {
      this.isComplete = true;
      const { success, fail, showInput, comp1 } = this.alertInfo;
      let body = {};
      if (comp1) {
        body.form1 = this.form1 || this.alertInfo.form1 || {};
      }
      if (isOk) {
        if (showInput) {
          const valid = this.$refs.form.validate();
          if (!valid) {
            // fail(new Error('incorrent input'))
            return;
          }
          body.value = this.inputVal;
        }
        if (success) success(body);
      } else {
        if (fail) fail(body);
      }
      this.showAlert = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.snackbar-content {
  text-align: center;
}
</style>
