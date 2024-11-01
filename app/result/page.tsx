"use client";

import RecursiveJson from "@/components/RecursiveJson";
import AnalysisResponseType from "@/types/AnalysisResponse";
import React, { useEffect, useRef, useState } from "react";

export default function DashBoard() {
  const mode = 2;
  const cpnt = 2;
  const idx = 3;
  const len = 6;
  const parsedStorage = JSON.parse(
    localStorage.getItem("_herbicide_response")!
  );
  const timeHash = parsedStorage.info.timeHash;
  const hooks = parsedStorage.info.hooks;
  const endpoint = `/api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  const [components, setComponents] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (components.length >= len) {
      eventSource.current?.close();
    }
  }, [components, len]);

  const eventSource = useRef<EventSource | null>(null);
  if (eventSource.current === null) {
    eventSource.current = new EventSource(endpoint, {
      withCredentials: true,
    });
    eventSource.current.onmessage = async (event: MessageEvent) => {
      const idx: string = event.data.match(/idx\s+:\s+(\S+),/)![1];
      const taskId: string = event.data.match(/task-id\s+:\s+(\S+)/)![1];
      console.log(idx);
      console.log(taskId);

      const result: AnalysisResponseType = await fetch(
        `/api/result/${taskId}`
      ).then((res) => res.json());
      const newComponent = (
        <div key={taskId} className='bg-gray-200'>
          <p>Task ID: {taskId}</p>
          <RecursiveJson data={result} depth={0} />
        </div>
      );
      setComponents((prevComponents) => [...prevComponents, newComponent]);
    };
  }

  return <div>{components}</div>;
}
