"use client";

import RecursiveJson from "@/components/RecursiveJson";
import { Response } from "@/types/InitialResponse";
import { Suspense } from "react";
import Comp0, { Comp1, Comp2 } from "./TestCard0";
import dynamic from "next/dynamic";
// const Component0 = dynamic(() => import("./TestCard0"), { ssr: false });
// const Component1 = dynamic(() => import("./TestCard1"), { ssr: false });
// const Component2 = dynamic(() => import("./TestCard2"), { ssr: false });

export default function Page() {
  const response: Response = JSON.parse(
    localStorage.getItem("_herbicide") || "{}"
  );

  const endpoint_noti = (
    timeHash: string,
    hooks: string,
    mode: number,
    cpnt: number
  ) => `api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  const endpoint_tasks = (taskId: string) => `api/result/${taskId}`;

  return (
    <div>
      <div>
        <h1>Results</h1>
        {/* <p>{JSON.stringify(response)}</p> */}
        <p>{response.info.timeHash}</p>
        <p>{response.info.hooks}</p>
        {/* {response.info.tasks.map(async (task) => (
          <RecursiveJson
            key={task.id}
            data={await fetch(endpoint_tasks(task.id)).then((res) =>
              res.json()
            )}
            depth={0}
          />
        ))} */}
        {/* <Component0 /> */}
        <Comp0
          taskId={response.info.tasks[3].id}
          timeHash={response.info.timeHash}
          hooks={response.info.hooks}
        />
        {/* 
        <Component1 />
        <Component2 /> */}
      </div>
    </div>
  );
}
