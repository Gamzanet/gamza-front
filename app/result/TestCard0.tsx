"use client";

import AnalysisResponseType, { Data } from "@/types/AnalysisResponse";
import { useState, useEffect } from "react";

export default function Comp0({
  taskId,
  timeHash,
  hooks,
}: {
  taskId: string;
  timeHash: string;
  hooks: string;
}) {
  const cpnt = 0;
  const mode = 2;
  const idx = 3;
  const cacheEndPoint = `/api/result/${taskId}`;
  const endpoint = `/api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  const [data, setData] = useState<Data>();

  useEffect(() => {
    async function fetchData() {
      const response: AnalysisResponseType = await fetch(cacheEndPoint).then(
        (res) => res.json()
      );
      if (response.status === "pending") {
        const eventSource = new EventSource(endpoint);
        console.log(eventSource.withCredentials);

        eventSource.onmessage = (event) => {
          console.log("eventSource.onmessage:", event);
          const parsedData = JSON.parse(event.data);
          setData(parsedData);
        };

        eventSource.onerror = (error) => {
          console.error("EventSource failed:", error);
          eventSource.close();
        };

        return () => {
          eventSource.close();
        };
      } else if (response.status === "success") {
        setData(response.result.data);
      } else {
        console.error("fetchData error:", response);
      }
    }

    fetchData();
  }, [cacheEndPoint, endpoint, data]);

  return (
    <div>
      <p>comp0</p>
      <p>idx: {idx}</p>
      <p>cpnt: {cpnt}</p>
      <p>data: {JSON.stringify(data)}</p>
      <p>endpoint: {endpoint}</p>
      {/* <RecursiveJson data={data} depth={0} /> */}
    </div>
  );
}
