"use client";

import { Response } from "@/types/InitialResponse";
import { useEffect } from "react";

export default function Page() {
  const response: Response = JSON.parse(
    localStorage.getItem("_herbicide_response") || "{}"
  );

  useEffect(() => {
    const response: Response = JSON.parse(
      localStorage.getItem("_herbicide_response") || "{}"
    );

    



    // create event stream for the endpoint
    const eventSource = new EventSource(
      endpoint_noti(response.info.timeHash, response.info.hooks, 2, 3),
      {
        withCredentials: true,
      }
    );
    eventSource.onmessage = (event) => {
      console.log(event);
    };
  }, []);

  const endpoint_noti = (
    timeHash: string,
    hooks: string,
    mode: number,
    cpnt: number
  ) => `/api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  const endpoint_tasks = (taskId: string) => `api/result/${taskId}`;

  return (
    <div>
      <div>
        <h1>Results</h1>
        <p>{response.info.timeHash}</p>
        <p>{response.info.hooks}</p>
      </div>
    </div>
  );
}

// const Comp0 = dynamic(() => import("./TestCard0"), {
//   ssr: false,
//   loading: () => <Skeleton className='w-[100px] h-[20px] rounded-full' />,
// });
// const Comp1 = dynamic(() => import("./TestCard1"), {
//   ssr: false,
//   loading: () => <Skeleton className='w-[100px] h-[20px] rounded-full' />,
// });
// // const Comp2 = dynamic(() => import("./TestCard2"), {
// //   ssr: true,
// //   loading: () => <Skeleton className='w-[100px] h-[20px] rounded-full' />,
// // });
