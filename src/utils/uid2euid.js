export default function (input) {
  let b = false;
  if (input.startsWith("0x")) {
    input = input.substring(2);
    b = true;
  }
  if (input.length >= 64) {
    throw new Error("illegal input string");
  }
  let bytes = hexStringToByteArray(input);
  let padding = new Array(32);
  padding.fill(0);
  padding.splice(0, bytes.length, ...bytes);
  padding[31] = b ? bytes.length + 32 : bytes.length;
  return "0x" + bytesToHex(padding);
}

function hexStringToByteArray(input) {
  let bytes = [];
  for (let i = 0; i < input.length; i += 2) {
    bytes.push(parseInt(input.substring(i, i + 2), 16));
  }
  return bytes;
}

function bytesToHex(input) {
  let hex = "";
  for (let i = 0; i < input.length; i++) {
    let byte = input[i];
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}
