import React from "react";
import { useQuery } from "react-query";
import { fetchEvents } from "../utils/events";

interface Props {}

export const EventList = (props: Props) => {
  const { data, isLoading } = useQuery("events", fetchEvents);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h2>Event List</h2>
    </div>
  );
};
