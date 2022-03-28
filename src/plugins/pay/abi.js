let abiData;
if (/xyz$/.test(process.env.VUE_APP_BASE_URL)) {
  abiData = require("./abi-dev.json");
} else {
  abiData = require("./abi-prod.json");
}

export default abiData;
