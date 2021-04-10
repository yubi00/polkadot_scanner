import { useQuery } from "react-query";
import { fetchEvents } from "../utils/events";
import { Event } from "./Event";

interface Props {}

export const EventList = (props: Props) => {
  const { data, isLoading } = useQuery("events", fetchEvents);

  if (isLoading || data?.length === 0) return <div>Loading...</div>;
  return (
    <div>
      {data && data?.map((event, i) => <Event key={i} event={event} />)}
    </div>
  );
};
