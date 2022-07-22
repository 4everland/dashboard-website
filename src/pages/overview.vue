<style lang="scss">
.ov-wrap-1 {
  padding: 30px 20px;
}
</style>

<template>
  <div class="pos-r">
    <div :class="asMobile ? 'ta-r mb-5' : 'pos-a right-0'" style="top: -50px">
      <v-btn color="primary" class="bdrs-10" to="/bucket/storage/?new=bucket">
        <span class="fz-18">+</span>
        <span class="ml-1"> New Bucket </span>
      </v-btn>
      <v-btn color="primary" class="bdrs-10 ml-5" to="/hosting/new">
        <span class="fz-18">+</span>
        <span class="ml-1"> New Project </span>
      </v-btn>
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
