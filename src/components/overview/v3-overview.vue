<template>
  <div class="mt-5">
    <v-row>
      <v-col>
        <v-card>
          <div class="ov-wrap-1">
            <div class="al-c">
              <img src="img/svg/overview/uv.svg" width="16" />
              <b class="ml-2 fz-16">Hosting UV</b>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <div class="ov-wrap-1">
            <div class="al-c">
              <img src="img/svg/overview/pie.svg" width="16" />
              <b class="ml-2 fz-16">Bucket Storage</b>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-5">
      <div class="ov-wrap-1">
        <div class="al-c">
          <img src="img/svg/overview/earth.svg" width="16" />
          <b class="ml-2 fz-16">Requests by country</b>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>