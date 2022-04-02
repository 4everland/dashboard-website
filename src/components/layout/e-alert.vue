<template>
  <div>
    <v-snackbar
      :color="noticeInfo.color || 'primary'"
      timeout="2000"
      v-bind="noticeInfo.attrs"
      v-model="showSnackbar"
    >
      {{ noticeInfo.content }}
      <template #action>
        <v-btn text @click="showSnackbar = false"> close </v-btn>
      </template>
    </v-snackbar>

    <v-dialog
      v-model="showLoading"
      max-width="260px"
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
      max-width="500"
      :persistent="alertInfo.persistent"
    >
      <v-card class="pd-10">
        <v-card-title v-if="!alertInfo.hideTitle">
          <!-- <v-icon v-show="!alertInfo.hideIcon" :color="iconColor" class="mr-2">
            {{ iconName }}
          </v-icon> -->
          <b>{{
            alertInfo.title
              ? alertInfo.title
              : alertInfo.showCancel
              ? "Confirm"
              : "Alert"
          }}</b>
        </v-card-title>
        <div v-else class="pd-15"></div>

        <v-card-text>
          <div class="fz-16 gray-6" v-html="alertInfo.content"></div>
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
            :form="alertInfo.form1"
            @input="onForm1"
          ></component>
        </v-card-text>
        <v-card-actions class="pb-3 ta-c">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            rounded
            width="90"
            v-if="alertInfo.showCancel"
            @click="hideAlert(0)"
          >
            {{ alertInfo.cancelText || "Cancel" }}
          </v-btn>
          <v-btn
            class="ml-6"
            rounded
            width="90"
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
  },
  data() {
    return {
      showAlert: false,
      showLoading: false,
      showSnackbar: false,
      inputVal: "",
      inputVal2: "",
      noticeInfo: {},
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
      else if (!this.isComplete) this.hideAlert(0);
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
        title,
        content,
        ...opts,
      });
    };
    Vue.prototype.$confirm = (content, title, opts = {}) => {
      return showModal({
        title,
        content,
        showCancel: true,
        ...opts,
      });
    };
    Vue.prototype.$prompt = (content, title, opts = {}) => {
      return showModal({
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