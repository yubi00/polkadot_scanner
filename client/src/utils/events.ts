import { ApiPromise, WsProvider } from "@polkadot/api";
import { toHexString } from "./utils";

export const fetchEvents = async () => {
  console.log("Fetching events from polkadot...");
  const provider = new WsProvider("wss://rpc.polkadot.io");
  const api = await ApiPromise.create({ provider });

  const polkaEvents: any = [];
  //subscribe to the new events
  api.query.system.events(async (events) => {
    //get the latest block
    let polkaEvent = {};
    let header = await api.rpc.chain.getHeader();
    let blockno = header.toJSON().number;
    let hash = header.hash;

    //traverse through all the events
    events.forEach((record) => {
      const { event, phase } = record;
      const types = event.typeDef;
      const { data, method, section } = event;

      let eventData: any = {};
      data.forEach((data, index) => {
        eventData = {
          ...eventData,
          blockno,
          hash: toHexString(hash),
          phase: phase.toString(),
          section,
          method,
          meta: event.meta.documentation.toString(),
          attrs: {
            ...eventData.attrs,
            [types[index].type]: data.toString()
          }
        };

        let eventsCollections: any = [];
        polkaEvent = {
          ...polkaEvent,
          events: [...eventsCollections, eventData]
        };
      });

      polkaEvents.push(polkaEvent);
      console.log(polkaEvent);
    });
  });
};
