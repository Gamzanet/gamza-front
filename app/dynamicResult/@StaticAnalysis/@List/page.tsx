"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ScrollableWindow from "@/components/ScorllableWindow";
import Loading from "@/components/ui/loading";
import { threatDetails } from "@/utils/ThreatDetails";
import { useSSE } from "@/components/request/SSEManager";

export default function StaticAnalysisResultPage() {
  const { taskResults, error } = useSSE();
  const [query, setQuery] = useState("");
  const [receivedFirstResult, setReceivedFirstResult] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [expectedCount, setExpectedCount] = useState(0);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // ✅ taskIDs 수 기준 기대 개수 추정
  useEffect(() => {
    const staticData = sessionStorage.getItem("staticResultData");
    const dynamicData = sessionStorage.getItem("dynamicResultData");

    let total = 0;
    if (staticData) total += 1; // static은 항상 1개
    if (dynamicData) total += 8 + 1 + 1; // dynamic은 10개

    setExpectedCount(total);
  }, []);

  // ✅ 수신 결과에서 위협 목록 파싱
  const threats = Object.entries(taskResults).flatMap(([key, data]) => {
    const [type, group, idx] = key.split("-").map((x) => x.trim());
    const mode = group === "0" ? 2 : 4;

    const resultThreats =
      data?.result?.result?.threats?.map((threat: any) => ({
        name: threat.detector,
        description: threat.data.description,
        severity:
          threat.data.impact.charAt(0).toUpperCase() +
          threat.data.impact.slice(1).toLowerCase(),
        type: mode === 2 ? "Dynamic" : "Static",
      })) || [];

    // ✅ 추가 사용자 정의 위협 (기본 함수 실패 기반)
    const failCount = data?.result?.result?.FAIL;
    const extraThreats = [];

    if (failCount >= 1) {
      switch (idx) {
        case "0":
          extraThreats.push({
            name: "AddLiquidity",
            description: "Unexpected behavior detected when adding liquidity.",
            severity: "Info",
            type: "custom",
          });
          break;
        case "1":
          extraThreats.push({
            name: "RemoveLiquidity",
            description:
              "Unexpected behavior detected when removing liquidity.",
            severity: "Info",
            type: "custom",
          });
          break;
        case "2":
          extraThreats.push({
            name: "Swap",
            description: "Unexpected behavior detected during token swaps.",
            severity: "Info",
            type: "custom",
          });
          break;
        case "3":
          extraThreats.push({
            name: "Donate",
            description:
              "Unexpected behavior detected in the donation process.",
            severity: "Info",
            type: "custom",
          });
          break;
        case "4":
          extraThreats.push({
            name: "TimeLock",
            description: "This pool key may not be usable at any time.",
            severity: "Medium",
            type: "custom",
          });
          break;
        case "5":
          extraThreats.push({
            name: "OnlyPoolManager",
            description:
              "Hook contract can call functions besides PoolManager.",
            severity: "Medium",
            type: "custom",
          });
          break;
        case "6":
          extraThreats.push({
            name: "ReInitialize",
            description:
              "No limitation on initialize, potential storage issues.",
            severity: "Medium",
            type: "custom",
          });
          break;
        case "7":
          extraThreats.push({
            name: "Upgradeability",
            description: "Identified as a proxy contract.",
            severity: "Critical",
            type: "custom",
          });
          break;
        case "8":
          extraThreats.push({
            name: "Gas Grief",
            description: "Could not estimate gas for basic function.",
            severity: "Low",
            type: "custom",
          });
          break;
      }
    }

    return [...resultThreats, ...extraThreats];
  });

  // ✅ 필터 적용
  const filteredThreats = threats.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(query.toLowerCase()),
  );

  // ✅ 수신 카운트 업데이트
  useEffect(() => {
    const keys = Object.keys(taskResults);
    setCompletedCount(keys.length);
    if (!receivedFirstResult && keys.length > 0) {
      setReceivedFirstResult(true);
    }
  }, [taskResults]);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col my-4 max-h-[800px] ml-2 gap-y-2">
      {/* 검색 */}
      <div className="relative w-[96%]">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          🔍
        </span>
        <Input
          defaultValue={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`pl-10 transition-colors duration-200 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
        />
      </div>

      {/* 최초 결과 수신 전: 스켈레톤 */}
      {!receivedFirstResult ? (
        <div className="flex flex-col gap-2 mt-4 w-full px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <ScrollableWindow className="space-y-2 h-full">
            {[...filteredThreats]
              .sort(
                (a, b) =>
                  getSeverityLevel(b.severity) - getSeverityLevel(a.severity),
              )
              .map((item, index) => (
                <AnalysisResultLog
                  key={index}
                  title={item.name}
                  description={item.description}
                  severity={item.severity}
                  detail={threatDetails[item.name]}
                />
              ))}
          </ScrollableWindow>

          {/* 아직 수신 완료되지 않았으면 하단에 로딩 추가 */}
          {completedCount < expectedCount && (
            <div className="flex flex-col gap-2 mt-4 w-full px-4">
              <SkeletonCard />
            </div>
          )}
        </>
      )}
    </div>
  );
}
// @remind RightSide - potential issues

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  getCardStyles,
  getSeverityLevel,
  getBadgeStyles,
} from "@/utils/SeverityStyles";
import { useTheme } from "next-themes"; // ✅ 다크모드 감지
export function AnalysisResultLog({
  title,
  description,
  markdown,
  severity,
  detail,
}: {
  title: string;
  description: string;
  markdown?: string;
  severity: string;
  check?: string;
  type: string;
  query?: string;
  detail?: {
    title: string;
    description: string;
    impact: string;
    recommendation: string;
  };
}) {
  const { theme } = useTheme(); // ✅ 현재 테마 가져오기
  const isDarkMode = theme === "dark";

  const titleMatch = markdown
    ? markdown.match(/\s([\s\w]+?)\W+\[/)
    : description.match(/\s([\s\w]+?)\w+\[/);
  const extractedTitle = titleMatch ? titleMatch[1].trim() : title;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Alert
          className={`relative w-[96%] ${getCardStyles(severity, isDarkMode)} mb-4`}
        >
          <AlertTitle className="flex gap-3 items-start">
            {/* Badge */}
            <Badge
              className={`mt-1 text-xs select-none cursor-default font-bold py-0 ${getBadgeStyles(
                severity,
              )}`}
            >
              {severity}
            </Badge>

            {/* Text Stack */}
            <div className="flex flex-col">
              <span
                className={`text-[15px] font-bold break-words ${isDarkMode ? "text-white" : "text-black"}`}
              >
                {extractedTitle.charAt(0).toUpperCase() +
                  extractedTitle.slice(1)}
              </span>
              <span
                className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-400"}`}
              >
                {description.slice(0, 60)}...
              </span>
            </div>
          </AlertTitle>
        </Alert>
      </DialogTrigger>

      <DialogContent
        className={`fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-[15px] max-w-[80vw]
        ${isDarkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-300"}`}
      >
        <DialogTitle
          className={`text-2xl font-semibold p-4 transition ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <div className="flex items-center gap-2">
            <Badge
              className={`${getBadgeStyles(severity)} hover:bg-yellow-300 mr-2 leading-none`}
            >
              {severity}
            </Badge>
            {titleMatch ? titleMatch : title}
          </div>
        </DialogTitle>

        <div
          className={`divide-y rounded-lg border overflow-hidden ${
            isDarkMode
              ? "divide-gray-700 border-gray-700 bg-gray-900"
              : "divide-gray-300 border-gray-300 bg-gray-100"
          }`}
        >
          {/* Description Row */}
          <div
            className={`grid grid-cols-[200px,1fr] divide-x ${
              isDarkMode ? "divide-gray-700" : "divide-gray-300"
            }`}
          >
            <div
              className={`p-4 flex items-center justify-center ${
                isDarkMode
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <h3 className="font-semibold">Description</h3>
            </div>
            <div
              className={`p-4 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {description}
            </div>
          </div>

          {/* Impact Row */}
          <div
            className={`grid grid-cols-[200px,1fr] divide-x ${
              isDarkMode ? "divide-gray-700" : "divide-gray-300"
            }`}
          >
            <div
              className={`p-4 flex items-center justify-center ${
                isDarkMode
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <h3 className="font-semibold">Impact</h3>
            </div>
            <div
              className={`p-4 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {detail?.impact &&
                detail.impact.split("\n").map((line, index) =>
                  line.trim().startsWith("-") ? (
                    <li key={index} className="ml-4 list-disc">
                      {line.replace("-", "").trim()}
                    </li>
                  ) : (
                    <p key={index}>{line}</p>
                  ),
                )}
            </div>
          </div>

          {/* Recommendation Row */}
          <div
            className={`grid grid-cols-[200px,1fr] divide-x ${
              isDarkMode ? "divide-gray-700" : "divide-gray-300"
            }`}
          >
            <div
              className={`p-4 flex items-center justify-center ${
                isDarkMode
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <h3 className="font-semibold">Recommendation</h3>
            </div>
            <div
              className={`p-4 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {detail?.recommendation &&
                detail.recommendation.split("\n").map((line, index) =>
                  line.trim().startsWith("-") ? (
                    <li key={index} className="ml-4 list-disc">
                      {line.replace("-", "").trim()}
                    </li>
                  ) : (
                    <p key={index}>{line}</p>
                  ),
                )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
export function SkeletonCard() {
  return (
    <div className="flex items-center rounded-xl px-4 py-3 gap-4 w-[460px] max-w-full">
      {/* Info badge */}
      <Skeleton className="h-[24px] w-[50px] rounded-full" />

      {/* Text block */}
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-[16px] w-3/4 rounded-md" />
        <Skeleton className="h-[12px] w-5/6 rounded-md" />
      </div>
    </div>
  );
}
