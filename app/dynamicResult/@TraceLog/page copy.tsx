"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodeHighlighter from "@/components/form/CodeHighlighter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSSE } from "@/components/request/SSEManager";

// ✅ 테스트 이름 매핑 객체 (Dict 활용)
const testNameMapping: Record<string, string> = {
  Minimum_Add: "AddLiquidity",
  Minimum_Remove: "RemoveLiquidity",
  Minimum_Swap: "Swap",
  Minimum_Donate: "Donate",
  "Time-Based-Minimum_Test": "TimeLock",
  "OnlyByPoolManager-Chk": "OnlyByPoolManager",
  "double-Initialize-Test": "Reinitialize",
  "Proxy-Test": "ProxyContract",
};

export default function Page() {
  const [testNumber, setTestNumber] = useState(0);
  const [indexNumber, setIndexNumber] = useState(0);
  const [isCode, setIsCode] = useState<boolean>(false);
  const { taskResults, error } = useSSE();

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  // ✅ `0-1`부터 `0-7`까지의 데이터 필터링
  const traceLogData = useMemo(() => {
    return Object.entries(taskResults)
      .filter(([key]) => key.startsWith("dynamic-0-")) // `0-`으로 시작하는 것만 가져옴
      .map(([_, value]) => value);
  }, [taskResults]);

  // ✅ `testNames` 리스트 생성 (0~7번 `idx` 데이터 기반)
  const testNames = useMemo(() => {
    return Array(8)
      .fill(0)
      .map((_, idx) => ({
        name:
          testNameMapping[traceLogData[idx]?.result?.result?.name] ||
          `Loading...`,
        index: idx,
      }));
  }, [traceLogData]);

  // ✅ 선택한 `TraceLog` 데이터 가져오기
  const sampleTraceLog = useMemo(() => {
    if (!traceLogData[testNumber]) return "Loading...";
    return (
      traceLogData[testNumber]?.result?.result?.failList[indexNumber]?.trace ||
      "No Trace Data Available"
    );
  }, [traceLogData, testNumber, indexNumber]);

  return (
    <>
      {!isCode && (
        <div className="relative">
          <Card className="relative">
            <CardHeader>
              <CardTitle>
                <div className="flex">
                  <h1 className="text-4xl my-2 mx-4">Trace Log</h1>
                  <div className="py-2 flex flex-wrap items-end gap-3">
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
                          width: "228px",
                          height: "25px",
                          backdropFilter: "blur(2px)",
                          borderRadius: "23px",
                          fontFamily: "'SF Pro Display'",
                          fontStyle: "italic",
                          fontWeight: 600,
                          fontSize: "18px",
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
                        {test.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="relative px-16">
              {/* 🔹 Impact & Description 추가 */}
              <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">
                  Impact:{" "}
                  {taskResults[testNumber]?.result?.result?.failList?.[
                    indexNumber
                  ]?.impact || "No impact available"}
                </h2>
                <p className="text-base text-gray-600">
                  {taskResults[testNumber]?.result?.result?.failList?.[
                    indexNumber
                  ]?.description || "No description available"}
                </p>
              </div>

              {/* 🔽 Left Arrow Button */}
              <button
                onClick={() =>
                  setIndexNumber(
                    (indexNumber - 1) %
                      taskResults[testNumber]?.result?.result?.failList?.length,
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
                      taskResults[testNumber]?.result?.result?.failList?.length,
                  )
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 shadow-md"
              >
                <ChevronRight size={30} />
              </button>
            </CardContent>
            {/* 🔵 Pagination Dots */}
            <div className="flex justify-center gap-4 mb-4">
              {taskResults[testNumber]?.result?.result?.failList?.map(
                (_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setIndexNumber(idx)}
                    className={`w-3 h-3 rounded-full ${
                      idx === indexNumber
                        ? "bg-primary-500 scale-110"
                        : "bg-gray-300 hover:bg-gray-400"
                    } transition-transform`}
                  ></button>
                ),
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
