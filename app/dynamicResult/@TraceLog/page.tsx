"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodeHighlighter from "@/components/form/CodeHighlighter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSSE } from "@/components/request/SSEManager";
import { useTheme } from "next-themes";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getBadgeStyles } from "@/utils/SeverityStyles";

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
  const { taskResults, error } = useSSE();
  const { theme, resolvedTheme } = useTheme(); // ✅ 현재 테마 가져오기
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const isDarkMode = mounted && (theme === "dark" || resolvedTheme === "dark");

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  const traceLogData = useMemo(() => {
    const map = new Map<number, any>();
    Object.entries(taskResults).forEach(([key, value]) => {
      const match = key.match(/dynamic-0-(\d+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        map.set(index, value);
      }
    });

    return Array.from({ length: 8 }, (_, idx) => map.get(idx));
  }, [taskResults]);

  // ✅ `testNames` 리스트 생성 (0~7번 `idx` 데이터 기반)
  const testNames = useMemo(() => {
    return Array(8).fill(null).map((_, idx) => {
      const name = traceLogData[idx]?.result?.result?.name;
      return {
        name: testNameMapping[name] || "Loading...",
        raw: name || "",
        index: idx,
      };
    });
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
    <div className="relative border-dotted border-2">
      <Card className="relative m-4">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl my-2 mx-4">Trace Log</h1>

              <Select
                value={testNumber.toString()}
                onValueChange={(val) => {
                  if (val !== null && !isNaN(Number(val))) {
                    setTestNumber(Number(val));
                    setIndexNumber(0);
                  }
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Test" />
                </SelectTrigger>
                <SelectContent>
                  {testNames.map((test) => (
                    <SelectItem
                      key={test.index}
                      value={test.index.toString()}
                    >
                      {test.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative px-16">
          {/* 🔹 Impact & Description 추가 */}
          <div
            className={`mb-4 p-4 rounded-lg border transition-colors duration-200 ${isDarkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
          >
            <h2
              className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? "text-white" : "text-gray-700"
                }`}
            >
              Impact:{" "}
              {traceLogData[testNumber]?.result?.result?.failList?.[indexNumber]?.impact ? (
                <Badge
                  className={`${getBadgeStyles(
                    traceLogData[testNumber]?.result?.result?.failList?.[indexNumber]?.impact
                  )} text-[14px] py-[0px] ml-1`}
                >
                  {traceLogData[testNumber]?.result?.result?.failList?.[indexNumber]?.impact}
                </Badge>
              ) : (
                <span className="ml-1 text-sm text-gray-400">No impact available</span>
              )}
            </h2>
            <p
              className={`mt-1 text-base transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              {traceLogData[testNumber]?.result?.result?.failList?.[
                indexNumber
              ]?.description || "No description available"}
            </p>
          </div>

          {/* 🔽 Left Arrow Button */}
          <button
            onClick={handlePrev}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md transition ${isDarkMode
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
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md transition ${isDarkMode
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
                className={`w-3 h-3 rounded-full transition-transform ${idx === indexNumber
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
  );
}
