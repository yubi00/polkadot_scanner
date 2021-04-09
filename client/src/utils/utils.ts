export const toHexString = (byteArray: any) => {
  let s = "0x";
  byteArray.forEach(function (byte: any) {
    s += ("0" + (byte & 0xff).toString(16)).slice(-2);
  });
  return s;
};
