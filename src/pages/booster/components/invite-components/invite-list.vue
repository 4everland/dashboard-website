<template>
  <div class="leaderboard-container">
    <div class="empty text-center" v-if="!list.length">
      <img src="/img/booster/svg/empty.svg" width="200" alt="" />
      <div>Empty</div>
    </div>
    <div v-else>
      <v-simple-table class="leaderboard-table">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Address</th>
              <th class="text-center">Joined At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in list" :key="item.address">
              <td class="text-center">{{ (page - 1) * size + i + 1 }}</td>
              <td class="text-center">
                {{
                  item.name
                    ? item.name.slice(0, 6) + "..." + item.name.slice(-4)
                    : "-"
                }}
              </td>
              <td class="text-center">
                {{ new Date(item.createdAt * 1000).format() }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <booster-pagination
        v-show="list.length != 0"
        :total-visible="7"
        :length="totalPages"
        class="mt-5"
        v-model="page"
        @input="getList"
      ></booster-pagination>
    </div>
  </div>
</template>

<script>
import BoosterPagination from "../booster-pagination.vue";
import { fetchInviteLog } from "@/api/booster";
export default {
  data() {
    return {
      page: 1,
      size: 10,
      totalPages: 0,
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        const { data } = await fetchInviteLog(this.page, this.size);
        console.log(data, "======");
        if (data) {
          this.list = data.content;
          this.totalPages = data.totalPages;
        }
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
        rgba(97, 114, 243, 0) 19.38%,
        rgba(97, 114, 243, 0.25) 84.92%
      ),
      #121536 !important;
    td {
      border-bottom: 1px solid rgba(97, 114, 243, 0.5) !important;
    }
  }
  :deep tbody tr:hover {
    background: linear-gradient(
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
