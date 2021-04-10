export const toHexString = (byteArray: any) => {
  let s = "0x";
  byteArray.forEach(function (byte: any) {
    s += ("0" + (byte & 0xff).toString(16)).slice(-2);
  });
  return s;
};

//This function is used to convert Uint8array buffer to hex string
export function buf2hex(buffer: any) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}
