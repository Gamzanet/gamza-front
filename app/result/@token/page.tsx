"use client";

import RecursiveJson, { RecursiveSkeleton } from "@/components/RecursiveJson";
import AnalysisResponseType from "@/types/AnalysisResponse";
import { useState, useEffect } from "react";

export default function Comp1() {
  // @see https://www.notion.so/entropy1110/56bbf3e1fc6e4e0ab31e222d0cf1e3dd?pvs=4#d33935afa8ab40e78250bf74e83544fa
  const mode = 2;
  const cpnt = 1;
  // const idx = 3;

  const parsedStorage = JSON.parse(
    localStorage.getItem("_herbicide_response")!
  );
  // const taskId = parsedStorage.info.tasks[idx].id;
  const timeHash = parsedStorage.info.timeHash;
  const hooks = parsedStorage.info.hooks;
  const endpoint = `/api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  const [data, setData] = useState<AnalysisResponseType | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/event-stream",
        },
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      if (reader) {
        const stream = new ReadableStream({
          start(controller) {
            function push() {
              reader?.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                result += decoder.decode(value, { stream: true });
                push();
              });
            }
            push();
          },
        });

        await new Response(stream).text();
      }
      console.log(result);
      const taskId = result.match(/task-id\s+:\s+(\S+)/)![1];
      setData(await fetch(`/api/result/${taskId}`).then((res) => res.json()));
    }

    fetchData();
  }, []);

  return (
    <div>
      {data ? <RecursiveJson data={data} depth={0} /> : <RecursiveSkeleton />}
    </div>
  );
}

// server style needs getter of an entrypoints by single id
// "use server";

// import RecursiveJson from "@/components/RecursiveJson";

// export async function generateStaticParams() {

//  const response = await fetch(endpoint, {
//    headers: {
//      "Content-Type": "application/event-stream",
//    },
//  });

//  const reader = response.body?.getReader();
//  const decoder = new TextDecoder();
//  let result = "";
//  if (reader) {
//    const stream = new ReadableStream({
//      start(controller) {
//        function push() {
//          reader?.read().then(({ done, value }) => {
//            if (done) {
//              controller.close();
//              return;
//            }
//            result += decoder.decode(value, { stream: true });
//            push();
//          });
//        }
//        push();
//      },
//    });
//    result = await new Response(stream).text();
//    const taskId = result.match(/task-id\s+:\s+(\S+)/)![1];
//    return JSON.parse(
//      await fetch(`/api/result/${taskId}`).then((res) => res.json())
//    );
//  }

//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }

// export default async function Comp0(taskId: string) {
//   async function fetchData() {
//     const endpoint = `/api/result/${taskId}`;
//     return JSON.parse(await fetch(endpoint).then((res) => res.json()));
//   }

//   return <RecursiveJson data={fetchData()} depth={0} />;
// }
