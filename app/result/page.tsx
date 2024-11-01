"use client";

import RecursiveJson, { RecursiveSkeleton } from "@/components/RecursiveJson";
import AnalysisResponseType from "@/types/AnalysisResponse";
import { Response } from "@/types/InitialResponse";
import { useState, useEffect } from "react";

export default function Comp2() {
  // @see https://www.notion.so/entropy1110/56bbf3e1fc6e4e0ab31e222d0cf1e3dd?pvs=4#d33935afa8ab40e78250bf74e83544fa
  const mode = 2;
  const cpnt = 2;
  const idx = [0, 1, 4, 5, 6, 7];

  const parsedStorage: Response = JSON.parse(
    localStorage.getItem("_herbicide_response")!
  );
  const taskId = parsedStorage.info.tasks[0].id;
  const timeHash = parsedStorage.info.timeHash;
  const hooks = parsedStorage.info.hooks;
  const endpoint = `/api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  const [data, setData] = useState<AnalysisResponseType | null>(null);
const [dataList,]
  useEffect(() => {
    console.log(process.env.API_URL + endpoint);
    const eventSource = new EventSource(endpoint, {
      withCredentials: true,
    });
    eventSource.onmessage = async (event) => {
      console.log(eventSource!.readyState);
      console.log(event.data);
      const taskId = event.data.match(/task-id\s+:\s+(\S+)/)![1];
      setData(await fetch(`/api/result/${taskId}`).then((res) => res.json()));
    };
  }, []);

  return (
    <div>

      {data ? <RecursiveJson data={data} depth={0} /> : <RecursiveSkeleton />}
    </div>
  );
}
