import { IEventData } from "../utils/events";
import React from "react";

interface Props {
  event: IEventData;
}

export const Event = ({ event }: Props) => {
  return (
    <div>
      <p>Block No: #{event.blockno}</p>
      <p>Tx: {event.hash} </p>
      <p>
        {event.module}.{event.event}
      </p>
      <p>Attrs: </p>
      {Object.keys(event.attrs).map((attr, i) => (
        <p key={i}>
          {attr} : {event.attrs[attr]}{" "}
        </p>
      ))}
    </div>
  );
};
