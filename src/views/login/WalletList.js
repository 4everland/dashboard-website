const WalletList = [
  {
    name: "MetaMask",
    icon: require("@/assets/imgs/metamask.svg"),
    provider: null,
    walletType: "METAMASK",
    isEvm: true,
    type: 2,
  },
  {
    name: "OKX Wallet",
    icon: require("@/assets/imgs/okx.png"),
    provider: null,
    walletType: "OKX",
    isEvm: true,
    type: 7,
  },
  {
    name: "Binance Wallet",
    icon: require("@/assets/imgs/bn.png"),
    provider: null,
    walletType: "BN",
    isEvm: false,
    type: 103,
  },
  {
    name: "Bitget Wallet",
    icon: require("@/assets/imgs/Bitget.svg"),
    provider: null,
    walletType: "Bitget",
    isEvm: true,
    type: 100,
  },
  {
    name: "TokenPocket",
    icon: require("@/assets/imgs/TokenPocket.svg"),
    provider: null,
    walletType: "TokenPocket",
    isEvm: true,
    type: 102,
  },
  {
    name: "imToken",
    icon: require("@/assets/imgs/imToken.svg"),
    provider: null,
    walletType: "IMTOKEN",
    isEvm: true,
    type: 101,
  },
  {
    name: "Coinbase Wallet",
    icon: require("@/assets/imgs/coinbase.png"),
    provider: null,
    walletType: "COINBASE",
    isEvm: true,
    type: 9,
  },

  {
    name: "WalletConnect",
    icon: require("@/assets/imgs/walletConnect.svg"),
    provider: null,
    walletType: "Walletconnect",
    isEvm: false,
    type: 99,
  },
  {
    name: "Phantom",
    icon: require("@/assets/imgs/phantom.png"),
    provider: null,
    walletType: "PHANTOM",
    isEvm: false,
    type: 4,
  },
  {
    name: "Petra",
    icon: require("@/assets/imgs/petra.svg"),
    provider: null,
    walletType: "PETRA",
    isEvm: false,
    type: 8,
  },
  {
    name: "Flow",
    icon: require("@/assets/imgs/flow.svg"),
    provider: null,
    walletType: "ONFLOW",
    isEvm: false,
    type: 5,
  },
];

export default WalletList;
