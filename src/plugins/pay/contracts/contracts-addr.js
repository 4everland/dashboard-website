let abiData;
if (/xyz$/.test(process.env.VUE_APP_BASE_URL)) {
  abiData = require("./addr-dev");
} else {
  abiData = require("./addr-prod");
}

module.exports = abiData;
