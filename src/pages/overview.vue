<style lang="scss">
.ov-wrap-1 {
  padding: 30px 20px;
}
</style>

<template>
  <div>
    <router-link to="/reward-hub">
      <div class="pos-r mb-3 bdrs-10 ov-h">
        <img
          src="/img/bg/user/reward-hub-bg.png"
          class="w100p img-cover d-b"
          style="max-height: 210px"
        />
        <div
          class="pos-center link-2 fz-25 fw-b ta-c w100p"
          style="max-width: 500px"
        >
          Explore, Earn, and Enjoy Free Resources in 4EVERLAND Reward Hub
        </div>
      </div>
    </router-link>
    <div class="pos-r mb-5">
      <div>
        <h2>{{ uname }}</h2>
        <div class="gray-8 fz-14 mt-1">Welcome back to 4EVERLAND dashboard</div>
      </div>
      <e-right-opt-wrap>
        <v-btn color="primary" to="/bucket/storage/?new=bucket">
          <span class="fz-18">+</span>
          <span class="ml-1"> New Bucket </span>
        </v-btn>
        <v-btn color="primary" class="ml-5" to="/hosting/new">
          <span class="fz-18">+</span>
          <span class="ml-1"> New Project </span>
        </v-btn>
      </e-right-opt-wrap>
    </div>

    <v3-usage />

    <div class="mt-3">
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v3-uv />
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v3-stor />
          </v-card>
        </v-col>
      </v-row>

      <v-card class="mt-5">
        <v3-req />
      </v-card>
    </div>
    <new-user-tips />
  </div>
</template>
