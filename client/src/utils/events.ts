import { ApiPromise, WsProvider } from "@polkadot/api";

export const fetchEvents = async () => {
  console.log("Fetching events from polkadot...");
  const provider = new WsProvider("wss://rpc.polkadot.io");
  const api = await ApiPromise.create({ provider });

  //subscribe to the new events
  api.query.system.events(async (events) => {
    //get the latest block
    let header = await api.rpc.chain.getHeader();
    let blockNumber = header.toJSON().number;
    let hash = header.hash;
    console.log(`\n\nBlock No: ${blockNumber}`);
    console.log(`Tx: ${hash}`);

    //Number of events for that particular block
    console.log(`Number of events: ${events.length}`);

    //traverse through all the events
    events.forEach((record) => {
      const { event, phase } = record;
      const types = event.typeDef;
      const { data, method, section } = event;

      //output event type , event method, event arguments to the console
      console.log(
        `\nPhase: ${phase.toString()}\nEvent: ${section}.${method}::${event.meta.documentation.toString()}`
      );

      // output data type such as account id or balance with their data respectively
      data.forEach((data, index) => {
        console.log(`\t\t${types[index].type}: ${data.toString()}`);
      });
    });
  });
};
