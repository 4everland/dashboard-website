<template>
  <div class="mt-5">
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v3-uv />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <div class="ov-wrap-1">
            <div class="al-c">
              <img src="img/svg/overview/pie.svg" width="16" />
              <b class="ml-2 fz-16">Bucket Storage</b>
              <e-radio-btn
                class="ml-auto"
                :options="['IPFS', 'AR']"
              ></e-radio-btn>
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
          <e-radio-btn
            class="ml-auto"
            :options="['Hosting', 'Bucket']"
          ></e-radio-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>
