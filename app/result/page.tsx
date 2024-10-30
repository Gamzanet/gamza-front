"use client";

import { Response } from "@/types/InitialResponse";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import Comp2 from "./TestCard2";
const Comp0 = dynamic(() => import("./TestCard0"), {
  ssr: true,
  loading: () => <Skeleton className='w-[100px] h-[20px] rounded-full' />,
});
const Comp1 = dynamic(() => import("./TestCard1"), {
  ssr: true,
  loading: () => <Skeleton className='w-[100px] h-[20px] rounded-full' />,
});
// const Comp2 = dynamic(() => import("./TestCard2"), {
//   ssr: true,
//   loading: () => <Skeleton className='w-[100px] h-[20px] rounded-full' />,
// });

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
        <Comp1
          taskId={response.info.tasks[2].id}
          timeHash={response.info.timeHash}
          hooks={response.info.hooks}
        />
        <Suspense>
          {[0, 1, 4, 5, 6, 7].map((idx) => (
            <Comp2
              key={idx}
              taskId={response.info.tasks[idx].id}
              timeHash={response.info.timeHash}
              hooks={response.info.hooks}
            />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
