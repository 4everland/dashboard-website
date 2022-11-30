import { providers } from "ethers"; //, utils
import polygonContract from "../../plugins/pay/contracts/dst-chain-contracts";
import { providerAddr } from "../../plugins/pay/contracts/contracts-addr";
export default {
  data() {
    return {};
  },
  computed: {
    uuid() {
      return this.userInfo.euid;
    },
  },
  watch: {
    uuid() {
      this.registerForNew();
    },
  },
  created() {
    console.log(this.userInfo);
    this.registerForNew();
  },
  methods: {
    async registerForNew() {
      if (!this.uuid) return;
      const provider = new providers.Web3Provider(window.ethereum);
      polygonContract.setProvider(provider);
      console.log(providerAddr);
      console.log(this.uuid);
      const isRegister = await polygonContract.ProviderController.accountExists(
        providerAddr,
        this.uuid
      );
      console.log(isRegister, "====");
    },
  },
};
