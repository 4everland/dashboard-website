<style lang="scss">
.price-docs {
  h3 {
    font-size: 16px;
  }
}
</style>

<template>
  <div class="price-docs fz-15 gray-6">
    <h3>Billing Methods</h3>
    <div>
      4EVERLAND's service billing includes network bandwidth, build minutes,
      IPFS storage, IPFS storage duration, and Arweave storage. You will receive
      separate invoices for some services based on your usage. The system
      currently supports two payment methods, one for purchasing resources
      directly and one for depositing wallet balance. The system will give
      priority to using free resources and purchased resources and will debit
      the wallet balance when it is exceeded.
    </div>
    <h3 class="mt-9">Free Resources</h3>
    <div>
      4EVERLAND offers a certain amount of free network bandwidth, build
      minutes, and storage space for each new user until free resources run out.
      Any excess resource consumption will be invoiced according to the price
      details, and you can also customize individual purchases based on resource
      consumption.
    </div>
    <table class="w100p e-table-1 mt-5 fz-14">
      <thead class="bg-f7 gray-6">
        <tr>
          <td>Free bandwidth (Monthly)</td>
          <td>Free build minutes (Monthly)</td>
          <td>Free IPFS storage(New users only)</td>
          <td>Free Arweave storage</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>100GB</td>
          <td>250Min</td>
          <td>5GB</td>
          <td>100MB</td>
        </tr>
      </tbody>
    </table>

    <h3 class="mt-9">Price Details</h3>
    <div>
      The following billing standard applies to both the direct purchase of
      resources (upfront) and wallet balance debit (postpaid) - Global users
    </div>
    <table class="w100p e-table-1 mt-5 fz-14">
      <thead class="bg-f7 gray-6">
        <tr>
          <td>Resource</td>
          <td>Type</td>
          <td>Specification</td>
          <td>Standard Pricing</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowspan="2">Bandwidth</td>
          <td rowspan="2">Bandwidth</td>
          <td>0-100GB</td>
          <td>Free / Month</td>
        </tr>
        <tr>
          <td>100GB+</td>
          <td>8.5U / 100G</td>
        </tr>
        <tr>
          <td rowspan="2">Build Minutes</td>
          <td rowspan="2">Build Minutes</td>
          <td>0-250Min</td>
          <td>Free / Month</td>
        </tr>
        <tr>
          <td>250Min+</td>
          <td>2U / 100Min</td>
        </tr>
        <tr>
          <td rowspan="4">
            IPFS
            <e-menu open-on-hover>
              <v-icon slot="ref" color="#999" size="14" class="ml-2"
                >mdi-alert-circle</v-icon
              >
              <div class="pa-5 fz-14 gray bg-white" style="max-width: 500px">
                <p>IIPFS supports capacity expansion and renewal.</p>
                <p>
                  1. Capacity expansion refers to the "expansion" of purchased
                  storage. The expansion will not change the storage expiration
                  time, and the newly added storage will be superimposed on the
                  old one.
                </p>
                <p>
                  2. Renewal refers to the "renewal" of the purchased storage.
                  The storage will remain the same after renewal, and the
                  storage expiration time will be extended from the original
                  expiration time to the number of years selected in the order.
                </p>
              </div>
            </e-menu>
          </td>
          <td rowspan="2">Storage</td>
          <td>0-5GB</td>
          <td>Free / 1 year</td>
        </tr>
        <tr>
          <td>5GB+</td>
          <td>2U / 100G / Mth</td>
        </tr>
        <tr>
          <td rowspan="2">Storage duration</td>
          <td>0-12 months</td>
          <td>Free / 1 year</td>
        </tr>
        <tr>
          <td>12 months+</td>
          <td>
            Settlement method
            <e-tooltip top>
              <v-icon slot="ref" color="#999" size="14" class="ml-2"
                >mdi-alert-circle</v-icon
              >
              <div>
                Cost of storage duration=Storage*duration*43/10 to the 18th
                power
              </div>
            </e-tooltip>
          </td>
        </tr>
        <tr>
          <td rowspan="2">Arweave</td>
          <td rowspan="2">Storage</td>
          <td>0-100MB</td>
          <td>Free</td>
        </tr>
        <tr>
          <td>100MB+</td>
          <td>0.31U</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>