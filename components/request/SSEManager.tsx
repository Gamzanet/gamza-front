"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SSE_URL, RESULT_API_URL } from "@/utils/APIreqeust";

const SSEContext = createContext({
  taskResults: {} as Record<string, any>,
  error: null as string | null,
});

export function SSEProvider({ children }: { children: React.ReactNode }) {
  const [taskResults, setTaskResults] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [receivedIdxSet, setReceivedIdxSet] = useState(new Set<string>());
  const [totalExpected, setTotalExpected] = useState(0); // 총 기대하는 응답 개수
  const [receivedCount, setReceivedCount] = useState(0); // 받은 응답 개수

  useEffect(() => {
    const staticData = sessionStorage.getItem("staticResultData");
    const dynamicData = sessionStorage.getItem("dynamicResultData");

    if (!staticData && !dynamicData) {
      setError("No task data found in session storage.");
      return;
    }

    const sseGroups = [];
    let expectedCount = 0;

    if (staticData) {
      const {
        hooks: staticHooks,
        timeHash: staticTimeHash,
        taskIDs: staticTaskIDs,
      } = JSON.parse(staticData);
      sseGroups.push({
        timeHash: staticTimeHash,
        hooks: staticHooks,
        group: 0,
        taskIDs: staticTaskIDs,
        mode: 4,
        type: "static",
      });
      expectedCount += 1; // static은 항상 하나의 idx(0-0)만 있음
    }

    if (dynamicData) {
      const {
        hooks: dynamicHooks,
        timeHash: dynamicTimeHash,
        taskIDs: dynamicTaskIDs,
      } = JSON.parse(dynamicData);
      sseGroups.push(
        {
          timeHash: dynamicTimeHash,
          hooks: dynamicHooks,
          group: 0,
          taskIDs: dynamicTaskIDs,
          mode: 2,
          type: "dynamic",
        },
        {
          timeHash: dynamicTimeHash,
          hooks: dynamicHooks,
          group: 1,
          taskIDs: dynamicTaskIDs,
          mode: 2,
          type: "dynamic",
        },
        {
          timeHash: dynamicTimeHash,
          hooks: dynamicHooks,
          group: 2,
          taskIDs: dynamicTaskIDs,
          mode: 2,
          type: "dynamic",
        },
      );
      expectedCount += 8 + 1 + 1; // dynamic: 0-0 ~ 0-7 (8개) + 1-0 (1개) + 2-0 (1개)
    }

    setTotalExpected(expectedCount); // ✅ 전체 받아야 할 개수 설정

    const eventSources: EventSource[] = [];

    sseGroups.forEach(({ timeHash, hooks, group, taskIDs, mode, type }) => {
      const eventSource = new EventSource(
        `${SSE_URL}/${timeHash}/${hooks}/${mode}/${group}`,
      );
      eventSources.push(eventSource);

      eventSource.onmessage = async (event) => {
        try {
          console.log(
            `📩 SSE Received (${type}, Group ${group}, Mode ${mode}):`,
            event.data,
          );

          const match = event.data.match(/idx: (\d+), task-id: ([a-z0-9-]+)/);
          if (!match) return;

          const idx = parseInt(match[1]);
          const taskId = match[2];

          if (!taskIDs.includes(taskId)) {
            console.warn(`⚠️ Received unknown taskID (${taskId}), ignoring.`);
            return;
          }

          // ✅ 중복 수신 방지: 이미 받은 idx라면 무시
          const key = `${type}-${group}-${idx}`;
          if (receivedIdxSet.has(key)) {
            console.log(`⚠️ Already received ${key}, ignoring.`);
            return;
          }

          // ✅ 데이터 가져오기
          const response = await fetch(`${RESULT_API_URL}/${taskId}`);
          if (!response.ok)
            throw new Error(`Failed to fetch result for taskID: ${taskId}`);

          const resultData = await response.json();

          // ✅ 상태 업데이트
          setTaskResults((prevResults) => ({
            ...prevResults,
            [key]: resultData,
          }));

          setReceivedIdxSet((prevSet) => {
            const newSet = new Set(prevSet);
            newSet.add(key);

            // ✅ 현재 그룹에서 모든 데이터를 받았다면 연결 종료
            if (
              [...taskIDs].every((id) => newSet.has(`${type}-${group}-${id}`))
            ) {
              console.log(
                `✅ All data received for ${type}-${group}, closing SSE.`,
              );
              eventSource.close();
            }

            return newSet;
          });
        } catch (error) {
          console.error("❌ Error processing SSE data:", error);
        }
      };

      eventSource.onerror = (event) => {
        if (eventSource.readyState === EventSource.CLOSED) {
          return; // 서버가 닫은 경우 재연결하지 않음
        }

        // 수신해야 할 데이터가 남아있는 경우에만 오류 처리
        if (receivedCount < totalExpected) {
          console.warn(
            `⚠️ SSE Connection Error (${type}, Group ${group}, Mode ${mode}):`,
            event,
          );
          setError("Failed to connect to SSE.");
        }

        // 필요 데이터가 다 수신된 경우에는 SSE 종료 (재연결 방지)
        if (receivedCount >= totalExpected) {
          eventSource.close();
        }
      };
    });

    return () => {
      eventSources.forEach((source) => source.close());
    };
  }, []);

  return (
    <SSEContext.Provider value={{ taskResults, error }}>
      {children}
    </SSEContext.Provider>
  );
}

// Custom hook to use SSE data
export function useSSE() {
  return useContext(SSEContext) ?? { taskResults: {}, error: null };
}
