import { ApiPromise, WsProvider } from "@polkadot/api";
import { buf2hex } from "./utils";

export interface IEventData {
  blockno: any;
  hash: string;
  timestamp: Date;
  phase: string;
  module: string;
  event: string;
  meta: string;
  attrs: any;
}

let polkaEvents: IEventData[] = [];

export const fetchEvents = async () => {
  try {
    console.log("Fetching events from polkadot...");
    const provider = new WsProvider("wss://rpc.polkadot.io");
    const api = await ApiPromise.create({ provider });

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

        let resArr: any = [];
        if (
          method === "Transfer" ||
          method === "Deposit" ||
          method === "Endowed" ||
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

        let eventData: IEventData = {
          blockno: null,
          hash: "",
          timestamp: new Date(),
          phase: "",
          module: "",
          event: "",
          meta: "",
          attrs: {}
        };

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
          polkaEvents.push(eventData);
        });
      });
    });
    return polkaEvents.reverse();
  } catch (err) {
    console.log(err);
  }
};
