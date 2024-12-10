<template>
  <div>
    <v-dialog
      max-width="360"
      content-class="bind-boost-dialog"
      :value="value"
      overlay-opacity="0.9"
      overlay-color="black"
      persistent
    >
      <div class="bind-dialog">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="20"
          alt=""
        />
        <div class="bind-header">
          <img
            class="head-img"
            src="/img/booster/earnings/bind-exchange.png"
            width="295"
            alt=""
          />
          <div class="bind-title">Bind Exchange</div>
        </div>
        <div class="bind-content">
          <div class="bind-receive" v-if="step=='1'">
            <ul>
              <li>
                Your $4EVER will be deposited there during the TGE once bind
                your exchange account.
              </li>
              <li>No Gas fees will be consumed when receiving your $4EVER.</li>
            </ul>
            <div class="head-img">
              <img
                src="/img/booster/earnings/bind-receive.png"
                width="120"
                alt=""
              />
              <div class="bind-text">Bind to receive your $4EVER</div>
              <v-btn class="continue-btn mt-4" @click="showNext('2')">
                <span class="bind-text">Continue</span>
              </v-btn>
            </div>
          </div>
          <div class="bind-select" v-if="step=='2'">
            <div class="bind-text">Select Exchange</div>
            <div class="d-flex justify-space-between align-center">
              <v-radio-group v-model="radioGroup" @change="showNext('3')">
                <v-radio
                  v-for="(item, i) in selectList"
                  :key="i"
                  :value="item.value"
                  :disabled="item.disabled"
                  class="mt-2 select"
                  color="#0FE1F8"
                  :class="{ 'gray_select': item.disabled}"
                >
                  <template v-slot:label>
                    <div class="d-flex justify-end align-center radioItemRight">
                      <div class="pr-2">
                        <img
                          :src="item.logo"
                          width="24"
                          alt=""
                        />
                      </div>
                      <div class="step-text">{{ item.title }}</div>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
            <div class="d-flex justify-start align-center mt-2">
                <img
                  src="/img/booster/earnings/subtract.png"
                  width="16"
                  alt=""
                />
              <div class="view">
                Snapshot Time: Dec 11, 2024, at 00:00 AM UTC.
                <span v-if="taskEnd">
                Snapshot finished. Forget to bind exchange? Please wait for the next round of airdrop.
                </span>
              </div>
            </div>
          </div>
          <div class="select-confirm" v-if="step=='3'">
            <div class="bind-text">Select Exchange</div>
              <v-form
                  ref="formBind"
                  v-model="valid"
                  lazy-validation
              >
              <v-select
                :items="selectList"
                dense
                solo
                background-color="#31313140"
                color="#FFF"
                class="mt-4 exchange-list"
                style="box-shadow: none"
                v-model="form.market"
                @change="(v) => onSelect(v)"
              >
                
                <template v-slot:item="{ item }">
                  <div class="d-flex justify-end align-center" :class="{ 'gray_select': item.disabled}">
                    <img :src="item.logo" width="24" alt="" />
                    <div class="step-text ml-2" style="color:#FFF;">{{ item.title }}</div>
                  </div>
                </template>
                <template v-slot:selection="{ item }">
                  <div class="d-flex justify-end align-center">
                    <img :src="item.logo" width="24" alt="" />
                    <div class="step-text ml-2" style="color:#FFF;">{{ item.title }}</div>
                  </div>
                </template>
              </v-select>
              <div class="step-subtitle">
                Submit Exchange Info
              </div>
              <div class="bind_lablel_item">
                <div class="step-text">UID</div>
                <div>
                  <v-text-field
                    :label="uidlabel"
                    :rules="rules"
                    background-color="#31313140"
                    outlined
                    solo-inverted
                    hide-details="auto"
                    color="#039cff"
                    v-model="form.uid"
                    dense
                  ></v-text-field>
                </div>
              </div>
              <div class="mt-4 bind_lablel_item">
                <div class="step-text">ETH Deposit Address</div>
                <div>
                  <v-text-field
                    label="Enter an ETH deposit address"
                    :rules="rulesAddress"
                    background-color="#31313140"
                    outlined
                    solo-inverted
                    hide-details="auto"
                    color="#039cff"
                    v-model="form.address"
                    dense
                  ></v-text-field>
                </div>
              </div>
              <div class="bind-tips mt-4">
                <div><a :href="docUrl" target="_blank">How to obtain UID & deposit address</a></div>
                <div class="mt-3"><a :href="inviteUrl" target="_blank">No exchange account? Create one </a></div>
              </div>
              <v-btn class="bind-btn mt-4" @click="showNextBind" :loading="loading">
                <span class="bind-text" >Bind</span>
              </v-btn>
            </v-form>
          </div>
          <div class="rebind-exchange" v-show="rebindExchange == true">
            <ul>
              <li>
                Your $4EVER will be deposited there during the TGE once bind
                your exchange account.
              </li>
              <li>No Gas fees will be consumed when receiving your $4EVER.</li>
            </ul>
            <div class="bind-address mt-4">
              <div class="d-flex justify-space-between align-center">
                <div class="rebind-text">Exchange</div>
                <div class="d-flex justify-end align-center">
                  <img
                    :src="bindInfoImage.logo"
                    width="24"
                    alt=""
                  />
                  <div class="step-text ml-2">{{bindInfoImage.title}}</div>
                </div>
              </div>
              <div class="d-flex justify-space-between align-center mt-3">
                <div class="rebind-text">UID</div>
                <div style="font-size: 14px; font-weight: 400">{{ bindInfo?.exchangeUid }}</div>
              </div>
              <div class="d-flex justify-space-between align-center mt-3">
                <div class="rebind-text">Deposit Address</div>
                <div style="font-size: 14px; font-weight: 400">{{ bindInfo?.exchangeAddress?.cutStr(6, 4) }}</div>
              </div>
            </div>
            <v-btn class="rebind-btn mt-6" v-if="!taskEnd" @click="handleRebind">
              <img
                src="/img/booster/earnings/rebind.svg"
                width="16"
                alt=""
              />
              <span class="bind-text ml-1">Rebind</span>
            </v-btn>
            <v-btn class="submit-btn mt-6" v-if="taskEnd">
              <img
                src="/img/booster/earnings/bind-check.svg"
                width="16"
                alt=""
              />
              <span class="bind-text ml-1">Snapshot Finished</span>
            </v-btn>
            <div class="d-flex justify-start align-center mt-4">
              <img
                src="/img/booster/earnings/subtract.png"
                width="16"
                alt=""
              />
              <div class="view">
                Snapshot Time: Dec 11, 2024, at 00:00 AM UTC.
                <span v-if="taskEnd">
                Snapshot finished. Forget to bind exchange? Please wait for the next round of airdrop.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
    
<script>
import { bus } from "@/utils/bus";
import { handleBindExchange, fetchBindInfo } from "@/api/booster";
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      showSelectExchange: true,
      showBind: false,
      rebindExchange: false,
      radioGroup: null,
      valid: false,
      form: {
        uid: '',
        address: '',
        market:''
      },
      selectList: [
        {
          title: "Gate.io",
          logo: require("/public/img/booster/earnings/gate-logo.png"),
          inviteUrl: "https://www.gateio24.com/signup/VLMVUL8MBA?ref_type=103",
          docUrl: "https://4everland.medium.com/how-to-locate-your-gate-io-uid-and-participate-in-the-4everland-airdrop-campaign-2af8eaaa4f6b",
          value: "Gate",
          disabled: false
        },
        {
          title: "BingX",
          logo: require("/public/img/booster/earnings/bingx-logo.png"),
          inviteUrl: "https://bingx.com/invite/HZCVIG/",
          docUrl: "https://4everland.medium.com/how-to-locate-your-bingx-uid-and-participate-in-the-4everland-airdrop-campaign-c76825913f6d",
          value: "BingX",
          disabled: false
        },
        {
          title: "MEXC",
          logo: require("/public/img/booster/earnings/mexc-logo.png"),
          inviteUrl: "https://www.mexc.com/register?inviteCode=mexc-2fy7c",
          docUrl: "https://4everland.medium.com/how-to-find-your-mexc-uid-and-participate-in-the-4everland-airdrop-4adff0e95eea",
          value: "Mexc",
          disabled: true
        },
      ],
      selectedItem: null,
      step: null,
      bindInfo: {

      },
      bindInfoImage: {

      },
      loading: false,
      rules: [
        (v) =>!!v || "UID is required",
        (v) => (v.trim().length >= 3 ) || "The input format is incorrect.",
      ],
      rulesAddress: [
        (v) =>!!v || "Address is required",
      ],
      endTime: 1733875200000
    }
  },
  watch: {
    selectedItem(newVal, oldVal) {
      if (!newVal) {
        this.selectedItem = this.selectList[0];
      }
    },
    radioGroup(newVal, oldVal) {
      if (newVal!= null) {
        this.form.market = newVal;
        this.form.address = '';
        this.form.uid = '';
        this.showNext('3');
      }
    },
  },
  computed: {
    uidlabel() {
      const market = this.selectList.find(item => item.value === this.form.market);
      return "Enter your "+ market.title +" UID"
    },
    addresslabel() {
      return "Enter your "+this.form.market+" Address"
    },
    docUrl() {
      const market = this.selectList.find(item => item.value === this.form.market);
      return market.docUrl;
    },
    inviteUrl() {
      const market = this.selectList.find(item => item.value === this.form.market);
      return market.inviteUrl;
    },
    taskEnd() {
      const curTimeStamp = +new Date();
      return curTimeStamp > this.endTime;
    },
    marketlabel() {
      return this.form.market;
    }
  },
  mounted() {
    this.getBindInfo();
    bus.$on("showBindExchangeEvent", async () => {
      
      if(this.bindInfo.exchangeUid){
        this.rebindExchange = true;
        this.step = null;
        this.getBindInfo();
      } else {
        this.step = '1';
        this.radioGroup = null;
        this.rebindExchange = false;
      }
    });
  },
  methods: {
    async getBindInfo() {
      try {
        const { data } = await fetchBindInfo();
        if(data){
          if(this.step == null){
            this.rebindExchange = true;
            this.step = null
          }
          this.bindInfo = data;
          this.bindInfoImage = this.selectList.find(item => item.value === this.bindInfo.market);
          
        } else {
          this.step = '1';
          this.radioGroup = null;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async onSelect(type) {
      try {
        this.form.market = type;
        
      } catch (error) {
        console.log(error);
      }
    },
    handleRebind() {
      this.step = '2';
      this.rebindExchange = false;
      this.radioGroup = null;
    },
    handleClick() {
      this.$emit("input", false);
    },
    showNext(step){
      this.step = step;
    },
    async showNextBind() {
      if (this.loading) return;
      
      this.valid = await this.$refs.formBind.validate();
      if (!this.valid) return;
      try {
        this.loading = true;
        const data =  await handleBindExchange({
            "market": this.form.market,
            "exchangeUid": this.form.uid,
            "exchangeAddress": this.form.address,
            "id": this.bindInfo.id
          })
          if (data.code == 200) {
            this.rebindExchange = true;
            this.step = null;
            this.bindInfo.exchangeUid = this.form.uid;
            this.bindInfo.exchangeAddress = this.form.address;
            this.bindInfo.market = this.form.market;
            this.bindInfoImage = this.selectList.find(item => item.value === this.bindInfo.market);
            if(this.taskEnd){
              this.$toast2('Snapshot finished. Stay tuned for the second airdrop batch.', "info");
            }
          } else {
            this.$toast2(
              data.message,
              "error"
            );
          }
          this.loading = false;
        } 
      catch (error) {
       
        console.log(error, "==================");
        this.loading = false;
      }
    }
  },
  components: {},
};
</script>
    
<style lang="scss" scoped>
::v-deep .bind-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}

.bind-dialog {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 36px 16px;
  border-radius: 16px;
  .close-btn {
    position: absolute;
    right: 18px;
    top: 0;
    cursor: pointer;
  }
  .bind-header {
    width: 295px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    .bind-title {
      position: absolute;
      top: 45px;
      left: 12px;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      text-align: left;
      color: #fff;
      text-shadow: 0px 0px 8px #ffffff80;
    }
  }
  .bind-content {
    width: 327px;
    // height: 348px;
    margin: 0 auto;
    top: 72px;
    padding: 16px;
    gap: 24px;
    border-radius: 16px;
    margin-top: -22px;
    background: linear-gradient(179.52deg, #000a10 8.53%, #003e70 99.59%),
      linear-gradient(
        180deg,
        rgba(17, 2, 252, 0.15) 28.41%,
        rgba(15, 225, 248, 0) 100%
      );
    border: 1px solid;
    .bind-receive {
      ul {
        list-style-type: disc;
        li {
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          text-align: left;
          color: #0fe1f8;
          margin-top: 8px;
        }
        li::before {
          content: "•";
          color: #0fe1f8;
          position: absolute;
          left: 42px;
        }
      }
      .head-img {
        margin-top: 24px;
        text-align: center;
      }
      .continue-btn {
        width: 100%;
        height: 34px;
        padding: 8px 16px;
        border-radius: 8px;
        background: linear-gradient(99.62deg, #dc33d6 0%, #ff3821 100%);
      }
    }
    .bind-text {
      font-size: 14px;
      font-weight: 700;
      line-height: 16px;
      color: #ffffff;
    }
    .bind-select {
      .select {
        padding: 16px;
        background: linear-gradient(
          135deg,
          rgb(33, 61, 92) 0,
          rgb(33, 61, 92) 10%,
          transparent 10%,
          transparent 50%,
          rgb(33, 61, 92) 50%,
          rgb(33, 61, 92) 60%,
          transparent 60%,
          transparent 100%
        );
        background-size: 8px 8px;
        width: 295px;
      }
      .radioItemRight {
        position: absolute;
        left: 150px;
      }
    }
    .step-text {
      font-size: 14px;
      font-weight: 400;
      margin-left: 0px;
      color: #fff;
    }
    .step-subtitle{
      font-size: 14px;
      color: #FFF;
      font-weight: 700;
      line-height: 16px;
      padding-bottom: 10px;
    }
    .v-item--active {
      border: 1px solid #0fe1f8;
    }
    .view {
      font-size: 12px;
      font-weight: 400;
      line-height: 15px;
      color: #c0c1c2;
      margin-left: 4px;
    }
    .select-confirm {
      .v-text-field {
        padding-top: 0 !important;
      }
      .bind-tips {
        font-size: 12px;
        font-weight: 400;
        line-height: 14.52px;
        text-align: left;
        text-decoration: underline;
        color: #039cff;
      }
      .bind-btn {
        width: 295px;
        height: 44px;
        padding: 12px 24px;
        border-radius: 16px;
        background: linear-gradient(90.97deg, #0fe1f8 0.68%, #1102fc 99.51%);
      }
    }
    .rebind-exchange {
      ul {
        list-style-type: disc;
        li {
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          text-align: left;
          color: #0fe1f8;
          margin-top: 8px;
        }
        li::before {
          content: "•";
          color: #0fe1f8;
          position: absolute;
          left: 42px;
        }
      }
      .bind-address {
        width: 287px;
        height: 120px;
        padding: 16px;
        border-radius: 16px;
        color: #fff;
        border: 1px solid #039cff;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.0375) 0%,
          rgba(255, 255, 255, 0.15) 100%
        );
        .rebind-text {
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          color: #98a2b3;
        }
      }
      .rebind-btn {
        width: 295px;
        height: 44px;
        padding: 12px 24px 12px 24px;
        border-radius: 16px;
        border: 1px solid #ffffff80;
        background: #ffffff0d;
      }
      .submit-btn {
        width: 295px;
        height: 44px;
        padding: 12px 24px 12px 24px;
        border-radius: 16px;
        // border: 1px solid;
        border: 1px solid #039cff;
        background: #00305c80;
      }
    }
  }
}
.exchange-list{
    color: #FFF !important;
}
.v-list.v-select-list.v-sheet.theme--light.v-list--dense.theme--light {
  border-radius: 4px !important;
  background: #000a10 !important;
  margin-top: 40px !important;
}
.bind_lablel_item ::v-deep .v-text-field__slot label {
  font-size: 14px;
}
.gray_select{
  filter: grayscale(1);
}
</style>
    