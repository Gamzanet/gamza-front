"use client";

import RecursiveJson from "@/components/RecursiveJson";
import AnalysisResponseType from "@/types/AnalysisResponse";
import { Response } from "@/types/InitialResponse";
import { useState, useEffect } from "react";

export default function Comp0() {
  // @see https://www.notion.so/entropy1110/56bbf3e1fc6e4e0ab31e222d0cf1e3dd?pvs=4#d33935afa8ab40e78250bf74e83544fa
  const mode = 2;
  const cpnt = 0;
  const idx = 3;

  const parsedStorage: Response = JSON.parse(
    localStorage.getItem("_herbicide_response")!
  );
  const taskId = parsedStorage.info.tasks[idx].id;
  const timeHash = parsedStorage.info.timeHash;
  const hooks = parsedStorage.info.hooks;
  const endpoint = `/api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  const [data, setData] = useState<AnalysisResponseType | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(endpoint, {
      withCredentials: true,
    });
    eventSource.onmessage = (event) => {
      console.log(eventSource!.readyState);
      setData(JSON.parse(event.data));
    };
    setEventSource(eventSource);
  }, []);

  useEffect(() => {
    if (eventSource) {
      switch (eventSource.readyState) {
        case eventSource!.CONNECTING:
          console.log("Comp0 CONNECTING");
          break;
        case eventSource!.OPEN:
          console.log("Comp0 OPEN");
          break;
        case eventSource!.CLOSED:
          console.log("Comp0 CLOSED");
          break;
        default:
          console.log("eventSource is null");
      }
    }
  }, [eventSource]);

  useEffect(() => {
    async function fetchData() {
      const cacheEndPoint = `/api/result/${taskId}`;
      const response = await fetch(cacheEndPoint);
      const result: AnalysisResponseType = await response.json();
      if (result && result.status !== "Pending") setData(result);
    }
    fetchData();
  }, [taskId]);

  return (
    <div>
      <p>comp0</p>
      {data ? <RecursiveJson data={data} depth={0} /> : <p>Loading...</p>}
    </div>
  );
}
