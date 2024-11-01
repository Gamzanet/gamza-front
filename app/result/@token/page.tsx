"use server";

import RecursiveJson, { RecursiveSkeleton } from "@/components/RecursiveJson";
import AnalysisResponseType from "@/types/AnalysisResponse";

export default async function Comp0(
  timeHash: string,
  hooks: string,
  mode: number, // const mode = 2;
  cpnt: number // const cpnt = 1;
  // const idx = 2;
) {
  const endpoint = `/api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

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
      result = await new Response(stream).text();
      const taskId = result.match(/task-id\s+:\s+(\S+)/)![1];
      return JSON.parse(
        await fetch(`/api/result/${taskId}`).then((res) => res.json())
      );
    }
  }

  return <RecursiveJson data={fetchData()} depth={0} />;
}
