<template>
  <div class="invite-reward">
    <div class="reward-progress">
      <PointDesc
        class="point-dot"
        v-for="(item, index) in list"
        :key="index"
        :style="{ left: index * 108 + 'px' }"
        v-bind="item"
      ></PointDesc>
    </div>
  </div>
</template>

<script>
import { fetchInvite_Milestone_Tasks } from "@/api/booster";
import PointDesc from "./point-desc.vue";
export default {
  components: { PointDesc },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getTaskList();
  },
  methods: {
    async getTaskList() {
      try {
        const { data } = await fetchInvite_Milestone_Tasks();
        console.log(data);

        if (data) {
          const list = data.items.map((it) => {
            const descArr = it.description.split(":");
            return {
              status: it.actStatus,
              inviteCount: descArr[0],
              pointType: descArr[1],
              rewardValue: descArr[2],
            };
          });

          this.list = list;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-reward {
  height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid #000;
  background: linear-gradient(180deg, #00070c 0%, #074178 113.39%), #121536;
  overflow: auto;
  .reward-progress {
    position: relative;
    margin: 0 12px;
    width: 2000px;
    height: 8px;
    background: #2b364f;
    border-radius: 16px;
    .point-dot {
      position: absolute;
      left: 8px;
      top: -12px;
    }
  }
}
</style>
