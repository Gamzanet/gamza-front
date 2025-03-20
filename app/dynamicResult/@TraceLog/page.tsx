"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodeHighlighter from "@/components/form/CodeHighlighter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSSE } from "@/components/request/SSEManager";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme(); // ✅ 현재 테마 가져오기
  const isDarkMode = theme === "dark";

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

  // ✅ 왼쪽 화살표 클릭
  const handlePrev = () => {
    const failList = traceLogData[testNumber]?.result?.result?.failList || [];
    if (failList.length === 0) return;
    setIndexNumber((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : failList.length - 1,
    );
  };

  // ✅ 오른쪽 화살표 클릭
  const handleNext = () => {
    const failList = traceLogData[testNumber]?.result?.result?.failList || [];
    if (failList.length === 0) return;
    setIndexNumber((prevIndex) =>
      prevIndex < failList.length - 1 ? prevIndex + 1 : 0,
    );
  };

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
              <div
                className={`mb-4 p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-800 text-white border-gray-600"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                <h2
                  className={`text-lg font-bold transition-colors duration-200 ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  Impact:{" "}
                  {taskResults[testNumber]?.result?.result?.failList?.[
                    indexNumber
                  ]?.impact || "No impact available"}
                </h2>
                <p
                  className={`text-base transition-colors duration-200 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {taskResults[testNumber]?.result?.result?.failList?.[
                    indexNumber
                  ]?.description || "No description available"}
                </p>
              </div>

              {/* 🔽 Left Arrow Button */}
              <button
                onClick={handlePrev}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md transition ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                <ChevronLeft size={30} />
              </button>

              <CodeHighlighter codeString={sampleTraceLog} />

              {/* 🔼 Right Arrow Button */}
              <button
                onClick={handleNext}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md transition ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                <ChevronRight size={30} />
              </button>
            </CardContent>

            {/* 🔵 Pagination Dots */}
            <div className="flex justify-center gap-4 mb-4">
              {traceLogData[testNumber]?.result?.result?.failList?.map(
                (_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setIndexNumber(idx)}
                    className={`w-3 h-3 rounded-full transition-transform ${
                      idx === indexNumber
                        ? "bg-primary-500 scale-110"
                        : isDarkMode
                          ? "bg-gray-500 hover:bg-gray-400"
                          : "bg-gray-300 hover:bg-gray-400"
                    }`}
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
