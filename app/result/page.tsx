"use client";

import { RecursiveSkeleton } from "@/components/RecursiveJson";
import dynamic from "next/dynamic";
import { useEffect } from "react";

export default function DashBoard() {
  // @see https://www.notion.so/entropy1110/56bbf3e1fc6e4e0ab31e222d0cf1e3dd?pvs=4#d33935afa8ab40e78250bf74e83544fa
  const mode = 2;
  const cpnt = 0;
  // const idx = 3;

  const parsedStorage = JSON.parse(
    localStorage.getItem("_herbicide_response")!
  );
  // const taskId = parsedStorage.info.tasks[idx].id;
  const timeHash = parsedStorage.info.timeHash;
  const hooks = parsedStorage.info.hooks;
  const endpoint = `/api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  useEffect(() => {
    console.log(process.env.API_URL + endpoint);
    const eventSource = new EventSource(endpoint, {
      withCredentials: true,
    });
    eventSource.onmessage = (event: MessageEvent) => {
      // const idx: string = event.data.match(/idx\s+:\s+(\S+)/)!;
      // const taskId: string = event.data.match(/task-id\s+:\s+(\S+)/)!;
      // ;
      console.log(event.data);
    };
  }, [endpoint]);

  return <div className='grid grid-cols-2 gap-4'>{}</div>;
}
