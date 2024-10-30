"use client";

import AnalysisResponseType, { PoolKeyType } from "@/types/AnalysisResponse";
import { rawResponse } from "./response";

import DeltaResults from "./DeltaResults";
import { useState, useEffect } from "react";
import { Root } from "@/types/InitialResponse";

// load taskIds from localStorage
// { 0: "task_id", 1: "task_id", ... }
// and create new EventSource for each task_id
// and listen for messages
// and update the UI with the new data
// and close the EventSource when the component is unmounted
// and handle errors
// and handle cleanup

export default function Page() {
  const response: Root = JSON.parse(localStorage.getItem("_herbicide") || "{}");

  const endpoint = (
    timeHash: string,
    hooks: string,
    mode: number,
    cpnt: number
  ) => `api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  // const [state0, setState0] = useState("");
  // const [state1, setState1] = useState("");
  // const [state2, setState2] = useState("");
  // const [state3, setState3] = useState("");
  // const [state4, setState4] = useState("");
  // const [state5, setState5] = useState("");
  // const [state6, setState6] = useState("");
  // const [state7, setState7] = useState("");

  // const getStateSetterByIndex = (index: string) => {
  //   switch (index) {
  //     case "0":
  //       return setState0;
  //     case "1":
  //       return setState1;
  //     case "2":
  //       return setState2;
  //     case "3":
  //       return setState3;
  //     case "4":
  //       return setState4;
  //     case "5":
  //       return setState5;
  //     case "6":
  //       return setState6;
  //     case "7":
  //       return setState7;
  //     default:
  //       return () => {};
  //   }
  // };

  // // // fetch task data and update state
  // // useEffect(() => {
  // //   Object.entries(response).forEach(([index]) => {
  // //     const eventSource = new EventSource(
  // //       endpoint(response.info.timeHash, response.info.hooks, 2, 0),
  // //       {
  // //         withCredentials: true,
  // //       }
  // //     );

  // //     eventSource.onmessage = (event) => {
  // //       const result = JSON.parse(event.data);
  // //       console.log(result);
  // //       getStateSetterByIndex(index)(result.info.tasks[0].stat);
  // //     };

  // //     eventSource.onerror = (error) => {
  // //       console.error("EventSource failed:", error);
  // //       eventSource.close();
  // //     };

  // //     return () => {
  // //       eventSource.close();
  // //     };
  // //   });
  // // }, []);

  return (
    <div>
      <div>
        <h1>Results</h1>
        {/* <p>{JSON.stringify(response)}</p> */}
        <p>{response.info.timeHash}</p>
        <p>{response.info.hooks}</p>
        {response.info.tasks.map((task) => (
          <p key={task.id}>{task.id}</p>
        ))}
      </div>
    </div>
  );
}
// export default function Page() {

//     const [responseMessage, setResponseMessage] = useState("");

//     useEffect(() => {
//       const eventSource = new EventSource(
//         "http://localhost:7777/api/tasks/"
//       );

//       eventSource.onmessage = (event) => {
//         const result = JSON.parse(event.data);
//         console.log(result);
//         result.info.tasks.forEach((task: { id: string; stat: string }) => {
//           console.log(task.id);
//         });
//       };

//       eventSource.onerror = (error) => {
//         setResponseMessage("이벤트 스트림 오류");
//         console.error("EventSource failed:", error);
//         eventSource.close();
//       };

//       return () => {
//         eventSource.close();
//       };
//     }, []);

//   const cleanUpResponse: AnalysisResponseType = rawResponse;

//   return (
//     <div>

//       <MetaData data={cleanUpResponse} />
//       <Results data={cleanUpResponse} />
//     </div>
//   );
// }

function MetaData({ data }: { data: AnalysisResponseType }) {
  return (
    <div className='border'>
      <h1>MetaData</h1>
      <p>{data.task_id}</p>
      <p>{data.status}</p>
    </div>
  );
}

function Results({ data }: { data: AnalysisResponseType }) {
  return (
    <div className='border'>
      <h1>Results</h1>
      <p>{data.result.name}</p>
      <p>{data.result.mode}</p>
      <p>{data.result.idx}</p>
      <p>{data.result.time}</p>
      <p>{data.result.price}</p>
      <PoolKey poolKey={data.result.poolKey} />
      <DeltaResults data={data.result.data} />
    </div>
  );
}

function PoolKey({ poolKey }: { poolKey: PoolKeyType }) {
  return (
    <div className='border'>
      <h1>Pool Key</h1>
      <p>{poolKey.hooks}</p>
      <p>{poolKey.currency0}</p>
      <p>{poolKey.currency1}</p>
      <p>{poolKey.fee}</p>
      <p>{poolKey.tickSpacing}</p>
    </div>
  );
}
