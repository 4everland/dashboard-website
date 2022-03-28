<template>
  <div class="ta-c pt-10 pb-10 st-general">
    <div class="del-wrap d-ib bdrs-8">
      <img src="img/svg/settings/account-del.svg" class="d-b" width="150" />
    </div>
    <div class="mt-3">
      <h3>Delete Personal Account</h3>
      <div class="gray fz-14 mt-3 ta-l">
        Permanently delete your Personal Account and all of its contents from
        the 4everland platform. This action is not reversible, so please
        continue to act with caution.
      </div>
      <div class="mt-8">
        <v-btn outlined rounded small>Delete Account</v-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.st-general {
  max-width: 410px;
  margin: auto;
  .del-wrap {
    background: #e2f2fa;
    padding: 20px 60px;
  }
}
</style>