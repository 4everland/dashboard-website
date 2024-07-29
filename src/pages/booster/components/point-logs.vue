<template>
  <div>
    <v-menu
      offset-y
      content-class="logs-menu"
      :attach="id"
      :close-on-content-click="false"
      @input="handleInput"
    >
      <template v-slot:activator="{ on, attrs }">
        <img
          style="display: block"
          v-on="on"
          v-bind="attrs"
          srcset="/img/booster/svg/log.svg"
          width="16"
          src=""
          alt=""
        />
      </template>
      <div class="logs">
        <div class="empty text-center" v-if="!list.length">
          <img src="/img/booster/svg/empty.svg" width="200" alt="" />
          <div>Empty</div>
        </div>
        <div class="logs-content" v-else>
          <div class="log-list">
            <div
              class="log d-flex align-center justify-space-between mb-4 fz-14"
              v-for="it in list"
              :key="it.createdAt"
            >
              <span> {{ it.log }} </span>
              <span>{{ new Date(it.createdAt * 1000).format() }}</span>
            </div>
          </div>
          <booster-pagination
            v-show="list.length != 0"
            :length="totalPages"
            class="mt-5"
            v-model="page"
            @input="onPage"
          ></booster-pagination>
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script>
import { fetchPointsHistory } from "@/api/booster";
import BoosterPagination from "./booster-pagination.vue";
export default {
  data() {
    return {
      id: null,
      page: 1,
      totalPages: 0,
      list: [],
      showLog: false,
    };
  },
  mounted() {
    this.id = document.querySelector(".booster-overview-content");
  },
  methods: {
    async getList() {
      try {
        const { data } = await fetchPointsHistory(this.page);
        if (data) {
          const list = data.content.map((it) => {
            switch (it.valueType) {
              case "initial":
                it.log = `I gained ${it.value} initial points.`;
                break;
              case "claim":
                it.log = `I collect ${it.value} points.`;
                break;
              case "activity":
                it.log = `I won ${it.value} points in the raffle.`;
                break;
              case "explorer":
                it.log = `I helped ${it.explorerAddress} collect points and received a ${it.explorerValue}-point commission.`;
                break;
              case "explored":
                it.log = `${it.explorerAddress} collected ${it.value} points and received a ${it.explorerValue}-point commission.`;
                break;
              default:
                break;
            }
            return it;
          });
          console.log(list);

          this.list = list;

          this.totalPages = data.totalPages;
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleInput(val) {
      if (val) {
        this.getList();
      }
    },
    onPage() {
      this.getList();
    },
  },
  components: {
    BoosterPagination,
  },
};
</script>

<style lang="scss" scoped>
::v-deep.logs-menu {
  height: 100%;
  border-radius: 0;
  right: 24px;
  top: 89px !important;
  left: initial !important;
}
.logs {
  position: relative;
  color: #fff;
  padding: 32px 20px;
  width: 518px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(54, 59, 64, 0.9);
  height: calc(100% - 72px - 64px - 32px) !important;
  .logs-content {
    height: 100%;
    .log-list {
      height: calc(100% - 70px);
      overflow: auto;
    }
  }
  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
