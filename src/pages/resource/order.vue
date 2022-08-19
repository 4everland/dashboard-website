<template>
  <div>
    <div class="al-end d-flex fz-14 gray">
      <span class="gray-6 fz-16">Pending order</span>
      <span class="ml-auto">Total:</span>
      <span class="fz-16 color-1 ml-2 mr-1">10</span>
      <span class="gray">USD</span>
    </div>
    <div class="ov-a">
      <table class="w100p e-table-1 mt-5 fz-14">
        <thead class="bg-f7 gray-6">
          <tr>
            <td>#</td>
            <td>Type</td>
            <td>Resource</td>
            <td>Specification</td>
            <td>Created At</td>
            <td>Amount</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
    </div>

    <e-kv2 class="mt-6" label="Network">
      <pay-network />
    </e-kv2>

    <div class="mt-8 gray fz-14">
      To complete the transaction with ETH and BSC payments, the platform will
      automatically cross-chain to Polygon. To prevent insufficient gas fees,
      maintaining a minimum payment amount of 20U is required.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSubscribe: true,
    };
  },
};
</script>