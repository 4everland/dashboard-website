<template>
  <div>
    <div class="detail-logs">
      <v-form ref="form">
        <div class="pa-4">
          <v-row>
            <v-col cols="12">
              <div>
                <v-row>
                  <v-col cols="12" md="4">
                    <div class="icon-box">
                      <div>
                        <v-img
                          max-height="40"
                          max-width="40"
                          src="@/assets/imgs/raas/email.svg"
                        ></v-img>
                      </div>
                      <div class="main-box">
                        <div class="mb-2 d-flex space-btw">
                          <div>
                            <span>Email</span>
                          </div>
                        </div>
                        <v-text-field
                          v-model="email"
                          outlined
                          placeholder="Please enter contact email"
                          dense
                        >
                        </v-text-field>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="icon-box">
                      <div>
                        <v-img
                          max-height="40"
                          max-width="40"
                          src="@/assets/imgs/raas/x.svg"
                        ></v-img>
                      </div>
                      <div class="main-box">
                        <div class="mb-2 d-flex space-btw">
                          <div>
                            <span>X (Optional)</span>
                          </div>
                        </div>
                        <v-text-field
                          v-model="xId"
                          outlined
                          prefix="Twitter.com/"
                          placeholder="Please enter your X handle"
                          dense
                        >
                        </v-text-field>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="icon-box">
                      <div>
                        <v-img
                          max-height="40"
                          max-width="40"
                          src="@/assets/imgs/raas/telegram.svg"
                        ></v-img>
                      </div>
                      <div class="main-box">
                        <div class="mb-2 d-flex space-btw">
                          <div>
                            <span>Telegram</span>
                          </div>
                        </div>
                        <v-text-field
                          v-model="telegram"
                          persistent-placeholder
                          outlined
                          placeholder="Please enter your telegram"
                          dense
                        >
                        </v-text-field>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
          <div style="text-align: right">
            <v-btn color="primary" width="96" @click="onSave"> Save </v-btn>
          </div>
        </div>
      </v-form>
    </div>
    <div class="detail-logs mt-4">
      <div class="raas-title">Customized Services</div>
      <div class="contact-us mt-4">
        For tailored brand element adjustments on your Bridge and Explorer, or
        any other customization requirements,please don't hesitate to
        <a
          href="https://discord.com/invite/4everland"
          target="_blank"
          rel="noopener noreferrer"
          >contact us</a
        >.
      </div>
    </div>
  </div>
</template>

<script>
import { sendContactInfo } from "@/api/raas.js";
export default {
  name: "DashboardWebsiteRaasSetting",
  props: {
    infoData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    infoData(val) {
      this.init(val);
    },
  },
  data() {
    return {
      email: "",
      xId: "",
      telegram: "",
    };
  },

  mounted() {
    this.id = this.$route.params.id;
    this.init(this.infoData);
  },

  methods: {
    init(val) {
      const { email, xId, telegram } = val;
      this.email = email;
      this.xId = xId;
      this.telegram = telegram;
    },
    async onSave() {
      const id = this.id;
      const params = {
        email: this.email,
        xId: this.xId,
        telegram: this.telegram,
      };
      await sendContactInfo(id, params);
      this.$toast("Saved successfully.");
    },
  },
};
</script>

<style lang="scss" scoped>
.raas-title {
  color: #0f172a;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.contact-us {
  color: #94a3b8;
  font-family: "SF Pro Text";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.detail-logs {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #cbd5e1;
  background: #fff;
  .icon-box {
    display: flex;
    gap: 8px;
    .main-box {
      flex: 1;
    }
  }
}
</style>
