<template>
  <div class="points-rules-dialog">
    <v-dialog
      :value="value"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="ruleDialog">
        <v-toolbar dark class="ruleDialog-toolbar">
          <v-btn icon dark @click="$emit('input', false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Rules</v-toolbar-title>
        </v-toolbar>
        <v-list class="rulelist">
          <div
            v-for="(item, index) in concepts"
            :key="index"
            class="concepts"
          >
            <div class="fw-b fz-14" style="opacity: 0.75">{{ item.title }}</div>
            <ul>
              <li v-for="(it, idx) in item.list" :key="idx" v-html="it"></li>
            </ul>
          </div>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      dialog: false,
      concepts: [
        {
          title: "$4EVER Points",
          list: [
            "$4EVER Points are the crucial proof for snagging 4EVERLAND <b style='color:#fff'>airdrops</b>.",
          ],
        },
        {
          title: "Earning Rate",
          list: [
            "Earning Rate = (Base Rate + Boost Rate) * (1 + Staking Yield).",
            "Points generation at the earning rate but must be collected manually.",
            "Collect $4EVER points on time! <b style='color:#fff'>If not, generation stops and you could lose 50% to others</b>.",
          ],
        },
        {
          title: "Base Rate",
          list: [
            "Permanently valid.",
            "Miniapp: <b style='color:#fff'>10 pts/h</b>.",
            "Webpage: <b style='color:#fff'>30 pts/h</b>.",
            "Unlock Storage, Network, or Computing nodes to earn <b style='color:#fff'>100 pts/h</b> and get <b style='color:#fff'>2,500</b> capacity.",
          ],
        },
        {
          title: "Boost Rate",
          list: [
            "Valid for 24 hours.",
            "Earn through tasks, raffles, or referral codes <b style='color:#fff'>(+10pts/h)</b>.",
          ],
        },
        {
          title: "Staking Yield",
          list: [
            "Increase your earning rate by staking <b style='color:#fff'>T4EVER/NFTs</b>.",
            "Invalid if NFT is transferred.",
          ],
        },
        {
          title: "Capacity Limit",
          list: [
            "Miniapp: <b style='color:#fff'>100 points</b>.",
            "Webpage: <b style='color:#fff'>300 points</b>.",
            "Increase capacity with unlocked 3 nodes, capacity cards, or raffles.",
          ],
        },
      ],
    };
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    saveRule() {
      // Add your save logic here
      this.dialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.ruleDialog {
  background: linear-gradient(
      180deg,
      rgba(57, 59, 62, 0.9) 25.52%,
      rgba(36, 39, 42, 0.9) 100%
    ),
    #4c5277;
  background-blend-mode: overlay;
  color: #ffffff;
  .ruleDialog-toolbar {
    color: #fff;
    background: transparent;
    box-shadow: none;
    .v-toolbar__title {
      width: 80%;
      text-align: center;
    }
  }
  .swap-rule-title {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    color: #ffffff;
    font-weight: 700;
    position: relative;
    padding-left: 12px;
    line-height: 20px;
  }
  .swap-rule-title::before {
    content: "•";
    position: absolute;
    width: 20px;
    left: 0;
  }
  .swap-rule-content {
    font-family: "Inter", sans-serif;
    font-size: 12px;
    line-height: 16px;
    color: #ffffffbf;
  }
  .rulelist {
    background: transparent;
    color: #fff;
    padding: 0 16px;
    .v-list-item {
      color: #fff;
    }
  }
  .concepts {
    color: #d0d5dd;

    ul,
    li {
      list-style: disc;
      font-size: 12px;
    }
  }
}
</style>
