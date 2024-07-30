<template>
  <div class="leaderboard-container">
    <div>
      <h3 class="tit">Leaderboard</h3>
      <div class="desc">Collect, Explore, & invite friends to rank up.</div>
    </div>

    <div class="empty text-center" v-if="!list.length">
      <img src="/img/booster/svg/empty.svg" width="200" alt="" />
      <div>Empty</div>
    </div>
    <div v-else>
      <v-simple-table class="leaderboard-table mt-10">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Address</th>
              <th class="text-center">Points</th>
              <th class="text-center">Invited By</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in list"
              :key="item.address"
              :class="{ trigger: i == 0 }"
            >
              <td class="text-center">{{ item.rank }}</td>
              <td class="text-center">
                {{
                  item.address
                    ? item.address.slice(0, 6) + "..." + item.address.slice(-4)
                    : "-"
                }}
              </td>
              <td class="text-center">{{ item.points }}</td>
              <td class="text-center">
                {{
                  !item.inviter
                    ? item.inviter
                    : item.inviter.slice(0, 6) + "..." + item.inviter.slice(-4)
                }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <booster-pagination
        v-show="list.length != 0"
        :length="totalPages"
        class="mt-5"
        v-model="page"
        @input="getList"
      ></booster-pagination>
    </div>
  </div>
</template>

<script>
import BoosterPagination from "../components/booster-pagination.vue";
import { fetchLeaderboard } from "@/api/booster";
export default {
  data() {
    return {
      page: 1,
      ranks: [],
      myRankInfo: {},
      totalPages: 0,
    };
  },
  created() {
    this.getList();
  },
  computed: {
    list() {
      if (this.ranks.length == 0) return [];

      if (!this.myRankInfo) return this.ranks;
      const ranks = this.ranks.filter(
        (it) => it.address !== this.myRankInfo.address
      );
      return [this.myRankInfo, ...ranks];
    },
  },
  methods: {
    async getList() {
      try {
        const { data } = await fetchLeaderboard(this.page);
        console.log(data);
        this.myRankInfo = data.my;
        this.ranks = data.ranks.content;
        this.totalPages = data.ranks.totalPages;
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    BoosterPagination,
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
}
.leaderboard-container {
  padding: 96px 24px;
  background: #000;
  position: relative;
  width: 100%;
  height: 100%;
  .tit {
    font-size: 24px;
  }
  .desc {
    color: rgba(255, 255, 255, 0.6);
  }
}

.leaderboard-table {
  color: #fff;

  :deep th {
    border-bottom: 1px solid rgba(255, 255, 255, 0.25) !important;
    font-size: 12px !important;
    color: rgba(255, 255, 255, 0.75) !important;
  }
  :deep td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.25) !important;
  }

  :deep tbody tr.trigger {
    font-weight: bold;
    background: linear-gradient(
        113deg,
        rgba(97, 114, 243, 0) 19.38%,
        rgba(97, 114, 243, 0.25) 84.92%
      ),
      #121536 !important;
    td {
      border-bottom: 1px solid rgba(97, 114, 243, 0.5) !important;
    }
  }
  :deep tbody tr:hover {
    // font-weight: bold;
    background: linear-gradient(
        113deg,
        rgba(97, 114, 243, 0) 19.38%,
        rgba(97, 114, 243, 0.25) 84.92%
      ),
      #121536 !important;
  }
  :deep tbody tr:hover td {
    border-bottom: 1px solid rgba(97, 114, 243, 0.5) !important;
  }
}

.empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
