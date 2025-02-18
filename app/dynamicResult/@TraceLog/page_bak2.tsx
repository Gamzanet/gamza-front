"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodeHighlighter from "@/components/form/CodeHighlighter";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const POLLING_INTERVAL = 5000; // 5초 간격으로 상태 확인

export default function Page() {
  const [testNumber, setTestNumber] = useState(0);
  const [indexNumber, setIndexNumber] = useState(0);
  const [componentData, setComponentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [isCode, setIsCode] = useState<boolean>(false);

  useEffect(() => {
    const fetchSelectedTaskStatuses = async (taskIds: string[]) => {
      try {
        const updatedData = { ...componentData };
        let allTasksCompleted = true;

        for (const id of taskIds) {
          if (updatedData[id]?.status === "Success") continue; // 이미 성공한 경우 건너뜀

          const response = await fetch(
            `http://localhost:7777/api/result/${id}`,
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch result for ID: ${id}`);
          }

          const result = await response.json();
          updatedData[id] = result;

          if (result["status"] !== "Success") {
            allTasksCompleted = false;
          }
        }

        setComponentData(updatedData);
        if (allTasksCompleted) {
          clearInterval(interval);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      }
    };

    const idsParam = searchParams.get("ids");
    if (!idsParam) {
      setError("No task IDs provided in the URL.");
      setLoading(false);
      return;
    }

    const allIds = JSON.parse(decodeURIComponent(idsParam)); // URL 파라미터 디코딩 및 JSON 파싱
    const selectedIds = [0, 1, 4, 5, 6].map((index) => allIds[index]); // 필요한 ID만 선택

    const interval = setInterval(
      () => fetchSelectedTaskStatuses(selectedIds),
      POLLING_INTERVAL,
    );

    fetchSelectedTaskStatuses(selectedIds).finally(() => setLoading(false)); // 초기 호출

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 폴링 중지
  }, [searchParams]);

  const taskIds = useMemo(() => Object.keys(componentData), [componentData]);

  const testNames = useMemo(() => {
    return taskIds.map((id, index) => ({
      name: componentData[id]?.result?.result?.name || `Test ${index + 1}`,
      index,
    }));
  }, [componentData, taskIds]);

  const sampleTraceLog = useMemo(() => {
    if (taskIds.length === 0) return "Loading or No Data Available";
    const selectedTask = componentData[taskIds[testNumber]];
    return (
      selectedTask?.result?.result?.failList[indexNumber]?.trace ||
      "No Trace Data Available"
    );
  }, [componentData, taskIds, testNumber, indexNumber]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }
  return (
    <>
      {!isCode && (
        <div className="relative">
          <Card className="relative">
            <CardHeader>
              <CardTitle>
                <div className="flex">
                  <h1 className="text-3xl my-2 mx-4">Trace Log</h1>
                  <div className="py-2 flex items-end gap-3">
                    {testNames.map((test) => (
                      <Button
                        key={test.index}
                        onClick={() => {
                          setTestNumber(test.index);
                          setIndexNumber(0);
                        }}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "0px",
                          width: "158px",
                          height: "20px",
                          backdropFilter: "blur(2px)",
                          borderRadius: "23px",
                          fontFamily: "'SF Pro Display'",
                          fontStyle: "italic",
                          fontWeight: 600,
                          fontSize: "13px",
                          lineHeight: "16px",
                          letterSpacing: "0.03em",
                          color: "#EF7BF9",
                          margin: "0px",
                        }}
                        className={`${
                          test.index === testNumber
                            ? "bg-primary-100"
                            : "bg-[#rgba(239, 124, 249, 0.1)]"
                        } opacity-80 hover:bg-primary-100 select-none border dark:border-white`}
                      >
                        {test.name === "Minimum_Test"
                          ? "Minimum"
                          : test.name === "Time-Based-Minimum_Test"
                            ? "TimeLock"
                            : test.name === "OnlyByPoolManager-Chk"
                              ? "OnlyByPoolManager"
                              : test.name === "double-Initialize-Test"
                                ? "Reinitialize"
                                : test.name === "Proxy-Test"
                                  ? "HookFuncCall"
                                  : "Loading..."}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="relative px-16">
              {/* 🔽 Left Arrow Button */}
              <button
                onClick={() =>
                  setIndexNumber(
                    (indexNumber -
                      1 +
                      componentData[taskIds[testNumber]]?.result?.result
                        ?.failList?.length) %
                      componentData[taskIds[testNumber]]?.result?.result
                        ?.failList?.length,
                  )
                }
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 shadow-md"
              >
                <ChevronLeft size={30} />
              </button>

              <CodeHighlighter codeString={sampleTraceLog} />

              {/* 🔼 Right Arrow Button */}
              <button
                onClick={() =>
                  setIndexNumber(
                    (indexNumber + 1) %
                      componentData[taskIds[testNumber]]?.result?.result
                        ?.failList?.length,
                  )
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 shadow-md"
              >
                <ChevronRight size={30} />
              </button>
            </CardContent>
            {/* 🔵 Pagination Dots */}
            <div className="flex justify-center gap-4 mb-4">
              {componentData[
                taskIds[testNumber]
              ]?.result?.result?.failList?.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setIndexNumber(idx)}
                  className={`w-3 h-3 rounded-full ${
                    idx === indexNumber
                      ? "bg-primary-500 scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  } transition-transform`}
                ></button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
