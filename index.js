const { ApiPromise, WsProvider } = require("@polkadot/api");

(async () => {
  console.log("Fetching events from polkadot...");
  const provider = new WsProvider("wss://rpc.polkadot.io");
  const api = await ApiPromise.create({ provider });

  const polkaEvents = [];
  //subscribe to the new events
  api.query.system.events(async (events) => {
    //get the latest block
    let header = await api.rpc.chain.getHeader();
    let blockno = header.toJSON().number;
    let hash = "0x" + buf2hex(header.hash.buffer);

    //traverse through all the events
    events.forEach((record) => {
      const { event, phase } = record;
      const types = event.typeDef;
      const { data, method, section } = event;

      let resArr = [];
      if (
        method === "Transfer" ||
        method == "Deposit" ||
        method == "Endowed" ||
        method === "Reward" ||
        method === "Unbonded"
      ) {
        const res = [...types].map((val) => val.type);
        resArr = res.map((attr, i) => {
          if (attr === "AccountId" && res.indexOf(attr) === i) {
            return "from";
          } else if (attr === "AccountId" && res.indexOf(attr) !== i) {
            return "to";
          } else {
            return attr.charAt(0).toLowerCase() + attr.slice(1);
          }
        });
      }

      let eventData = {};
      data.forEach((data, index) => {
        eventData = {
          ...eventData,
          blockno,
          hash,
          timestamp: new Date(),
          phase: phase.toString(),
          module: section,
          event: method,
          meta: event.meta.documentation.toString(),
          attrs:
            method === "Transfer" ||
            method === "Deposit" ||
            method === "Endowed" ||
            method === "Reward" ||
            method === "Unbonded"
              ? {
                  ...eventData.attrs,
                  [resArr[index]]: data.toString()
                }
              : {
                  ...eventData.attrs,
                  [types[index].type]: data.toString()
                }
        };
      });

      polkaEvents.push(eventData);
      console.log(eventData);
    });
  });
})().catch((error) => {
  //catch error if any and output to the console
  console.log(error);
  process.exit(-1);
});

//This function is used to convert Uint8array buffer to hex string
function buf2hex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}
