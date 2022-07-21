<template>
  <div class="ov-wrap-1">
    <div class="al-c">
      <img src="img/svg/overview/pie.svg" width="16" />
      <b class="ml-2 fz-16">Bucket Storage</b>
      <e-radio-btn class="ml-auto" :options="['IPFS', 'AR']"></e-radio-btn>
    </div>

    <v-skeleton-loader class="mt-15 mb-15" type="article"></v-skeleton-loader>
  </div>
</template>