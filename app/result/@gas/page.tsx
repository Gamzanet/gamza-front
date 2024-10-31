"use client";

import RecursiveJson from "@/components/RecursiveJson";
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

  const cacheEndPoint = `/api/result/${taskId}`;
  const endpoint = `/api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  const [data, setData] = useState(null);
  useEffect(() => {
    async function fetchEventSource() {
      console.log(endpoint);
      const eventSource = new EventSource(endpoint, {
        withCredentials: true,
      });
      eventSource.onmessage = (event) => {
        setData(JSON.parse(event.data));
      };
    }
    async function fetchData() {
      const response = await fetch(cacheEndPoint);
      const result = await response.json();
      setData(result);
    }
    fetchData();
    fetchEventSource();
  }, [data, cacheEndPoint, endpoint]);

  return (
    <div>
      <p>comp0</p>
      {data ? <RecursiveJson data={data} depth={0} /> : <p>Loading...</p>}
    </div>
  );
}
