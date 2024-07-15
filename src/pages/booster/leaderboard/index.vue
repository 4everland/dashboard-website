<template>
  <div class="leaderboard-container">
    <div>
      <h3 class="tit">Leaderboard</h3>
      <div class="desc">Collect, Explore, & invite friends to rank up.</div>
    </div>

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
            :key="item.name"
            :class="{ trigger: i == 0 }"
          >
            <td class="text-center">{{ item.id }}</td>
            <td class="text-center">
              {{ item.address.slice(0, 6) + "..." + item.address.slice(-4) }}
            </td>
            <td class="text-center">{{ item.points }}</td>
            <td class="text-center">
              {{ item.inviter.slice(0, 6) + "..." + item.inviter.slice(-4) }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <booster-pagination
      :length="15"
      class="mt-5"
      v-model="page"
    ></booster-pagination>
  </div>
</template>

<script>
import BoosterPagination from "../components/booster-pagination.vue";
export default {
  data() {
    return {
      page: 1,
      list: [
        {
          id: 1,
          address: "0x88434234324c34fd5mdsx000008333324223434",
          points: "1111",
          inviter: "0x88434234324c34fd5mdsx000008333324223434",
        },
        {
          id: 2,
          address: "0x88434234324c34fd5mdsx000008333324223434",
          points: "1111",
          inviter: "0x88434234324c34fd5mdsx000008333324223434",
        },
        {
          id: 3,
          address: "0x88434234324c34fd5mdsx000008333324223434",
          points: "1111",
          inviter: "0x88434234324c34fd5mdsx000008333324223434",
        },
        {
          id: 4,
          address: "0x88434234324c34fd5mdsx000008333324223434",
          points: "1111",
          inviter: "0x88434234324c34fd5mdsx000008333324223434",
        },
        {
          id: 5,
          address: "0x88434234324c34fd5mdsx000008333324223434",
          points: "1111",
          inviter: "0x88434234324c34fd5mdsx000008333324223434",
        },
        {
          id: 6,
          address: "0x88434234324c34fd5mdsx000008333324223434",
          points: "1111",
          inviter: "0x88434234324c34fd5mdsx000008333324223434",
        },
        {
          id: 7,
          address: "0x88434234324c34fd5mdsx000008333324223434",
          points: "1111",
          inviter: "0x88434234324c34fd5mdsx000008333324223434",
        },
        {
          id: 8,
          address: "0x88434234324c34fd5mdsx000008333324223434",
          points: "1111",
          inviter: "0x88434234324c34fd5mdsx000008333324223434",
        },
        {
          id: 9,
          address: "0x88434234324c34fd5mdsx000008333324223434",
          points: "1111",
          inviter: "0x88434234324c34fd5mdsx000008333324223434",
        },
        {
          id: 10,
          address: "0x88434234324c34fd5mdsx000008333324223434",
          points: "1111",
          inviter: "0x88434234324c34fd5mdsx000008333324223434",
        },
      ],
    };
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
    font-weight: bold;
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
</style>
