"use client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

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

const POLLING_INTERVAL = 5000; // 5초 간격으로 상태 확인

export default function StaticAnalysisResultPage() {
  const searchParams = useSearchParams();
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true); // ✅ 최초 1회 로딩 추가

  useEffect(() => {
    const fetchAnalysisResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ URL에서 `taskIDs` 가져오기
        const idsParam = searchParams.get("ids");
        const urlTaskIDs = idsParam
          ? JSON.parse(decodeURIComponent(idsParam))
          : [];

        // ✅ 로컬 스토리지에서 `taskIDs` 가져오기
        const storedTaskIDs = JSON.parse(
          localStorage.getItem("taskIDs") || "[]",
        );
        console.log(storedTaskIDs);

        // ✅ URL `taskIDs` + 로컬 스토리지 `taskIDs` 병합 (중복 제거)
        const allTaskIDs = [...new Set([...urlTaskIDs, ...storedTaskIDs])];
        let completedIds = new Set<string>(); // 완료된 Task ID 저장

        // ✅ 개별 `taskId` 별로 폴링하며, 성공한 데이터는 즉시 업데이트
        const fetchResult = async (taskId: string, index: number) => {
          while (!completedIds.has(taskId)) {
            const response = await fetch(
              `http://localhost:7777/api/result/${taskId}`,
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch data for taskID: ${taskId}`);
            }

            const result = await response.json();

            if (result.status === "Success") {
              completedIds.add(taskId); // 완료된 taskId 저장
              return { result, index }; // 인덱스를 함께 반환
            }

            await new Promise((resolve) =>
              setTimeout(resolve, POLLING_INTERVAL),
            );
          }
          setIsFirstLoad(false);
        };

        // ✅ 비동기 폴링으로 개별 데이터 업데이트
        allTaskIDs.forEach(async (taskId, index) => {
          try {
            const response = await fetchResult(taskId, index);
            if (response) {
              const { result, index } = response;
              setThreats((prevThreats) => {
                // `threats` 데이터 변환 및 threat 위협 추가
                let threatsList =
                  result.result?.result?.threats?.map((threat: any) => ({
                    name: threat.detector,
                    description: threat.data.description,
                    severity:
                      threat.data.impact.charAt(0).toUpperCase() +
                      threat.data.impact.slice(1).toLowerCase(),
                    type: "custom",
                  })) || [];

                // ✅ addLP(0번 인덱스)에서 `FAIL >= 1` 이면 `AddLiquidity` 위협 추가
                if (index === 0 && result.result?.result?.FAIL >= 1) {
                  threatsList.push({
                    name: "AddLiquidity",
                    description:
                      "Unexpected behavior detected when adding liquidity. Hook function may not be properly handling liquidity additions, leading to potential discrepancies.",
                    severity: "Info",
                    type: "custom",
                  });
                }

                // ✅ removeLP(1번 인덱스)에서 `FAIL >= 1` 이면 `RemoveLiquidity` 위협 추가
                if (index === 1 && result.result?.result?.FAIL >= 1) {
                  threatsList.push({
                    name: "RemoveLiquidity",
                    description:
                      "Unexpected behavior detected when removing liquidity. Hook function may not be correctly adjusting the pool’s liquidity balance, which could impact future transactions.",
                    severity: "Info",
                    type: "custom",
                  });
                }

                // ✅ swap(2번 인덱스)에서 `FAIL >= 1` 이면 `Swap` 위협 추가
                if (index === 2 && result.result?.result?.FAIL >= 1) {
                  threatsList.push({
                    name: "Swap",
                    description:
                      "Unexpected behavior detected during token swaps. Hook function might not be correctly processing input/output amounts, possibly affecting price calculations.",
                    severity: "Info",
                    type: "custom",
                  });
                }

                // ✅ donate(3번 인덱스)에서 `FAIL >= 1` 이면 `Donate` 위협 추가
                if (index === 3 && result.result?.result?.FAIL >= 1) {
                  threatsList.push({
                    name: "Donate",
                    description:
                      "Unexpected behavior detected in the donation process. Hook function may not be properly recording or handling donations, potentially leading to accounting mismatches.",
                    severity: "Info",
                    type: "custom",
                  });
                }

                // ✅ TimeLock(4번 인덱스)에서 `FAIL >= 1` 이면 `TimeLock` 위협 추가
                if (index === 4 && result.result?.result?.FAIL >= 1) {
                  threatsList.push({
                    name: "TimeLock",
                    description:
                      "This pool key does not appear to be a pool key that can be used at any time.",
                    severity: "Medium",
                    type: "custom",
                  });
                }

                // ✅ OnlyByPoolManager-Chk(5번 인덱스)에서 `FAIL >= 1` 이면 `OnlyPoolManager` 위협 추가
                if (index === 5 && result.result?.result?.FAIL >= 1) {
                  threatsList.push({
                    name: "OnlyPoolManager",
                    description:
                      "In addition to the PoolManager, the hook contract can call hook function, which requires attention.",
                    severity: "Medium",
                    type: "custom",
                  });
                }

                // ✅ double-Initialize-Test(6번 인덱스)에서 `FAIL >= 1` 이면 `ReInitialize` 위협 추가
                if (index === 6 && result.result?.result?.FAIL >= 1) {
                  threatsList.push({
                    name: "ReInitialize",
                    description:
                      "This pool key has no limitation on initialize, and storage management is found to be inadequate.",
                    severity: "Medium",
                    type: "custom",
                  });
                }

                // ✅ Proxy-Test(7번 인덱스)에서 `FAIL >= 1` 이면 `Upgradeability` 위협 추가
                if (index === 7 && result.result?.result?.FAIL >= 1) {
                  threatsList.push({
                    name: "Upgradeability",
                    description:
                      "The hook contract for that pool key has been identified as a proxy contract.",
                    severity: "Critical",
                    type: "custom",
                  });
                }

                // ✅ Gas Grief(8번 인덱스)에서 `FAIL >= 1` 이면 `Gas Grief` 위협 추가
                if (index === 8 && result.result?.result?.FAIL >= 1) {
                  threatsList.push({
                    name: "Gas Grief",
                    description:
                      "Running the basic function of the pool key could not estimate gas.",
                    severity: "Low",
                    type: "custom",
                  });
                }

                // ✅ 기존 데이터와 합쳐서 업데이트 (중복 방지)
                const uniqueThreats = [
                  ...prevThreats,
                  ...threatsList.filter(
                    (newThreat) =>
                      !prevThreats.some(
                        (existingThreat) =>
                          existingThreat.name === newThreat.name,
                      ),
                  ),
                ];

                if (uniqueThreats.length > 0) {
                  setIsFirstLoad(false);
                }

                return uniqueThreats;
              });
            }
          } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
          }
        });
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisResults();
  }, [searchParams]);

  // ✅ 최초 1회만 로딩 UI 표시
  if (isFirstLoad) {
    return (
      <div className="w-full h-full">
        <Loading containerClassName="h-full" />
      </div>
    );
  }

  // if (loading) {
  //   return <Loading />;
  // }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const filteredThreats = threats.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col my-4 max-h-[800px] ml-2 gap-y-2">
      <div className="relative w-[96%] ">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          🔍
        </span>
        <Input
          defaultValue={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white text-black pl-10"
        />
      </div>
      <ScrollableWindow className="space-y-2 h-full">
        {filteredThreats.length > 0 ? (
          // ✅ 1️⃣ 심각도 기준으로 정렬하여 표시
          [...filteredThreats]
            .sort(
              (a, b) =>
                getSeverityLevel(b.severity) - getSeverityLevel(a.severity),
            ) // 내림차순 정렬 (Critical → High → Medium → Low → Info)
            .map((item, index) => (
              <AnalysisResultLog
                key={index}
                title={item.name}
                description={item.description}
                severity={item.severity}
                detail={threatDetails[item.name]}
              />
            ))
        ) : (
          <p className="text-gray-500 text-center">No threats detected.</p>
        )}
      </ScrollableWindow>
    </div>
  );
}
// @remind RightSide - potential issues

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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
  // const regex = new RegExp(
  //   `\\-? \\[([\\s\\S]+?)\\]\\(\\S+${contractName}\\.sol#L(\\d+)\\)`,
  //   "g",
  // );

  // const matches = markdown ? [...markdown.matchAll(regex)] : [];
  // const results = matches.map((match) => ({
  //   text: match[1],
  //   lineNumber: match[2],
  // }));
  // const badgeStyles = severity && getBadgeStyles(severity);
  const titleMatch = markdown
    ? markdown.match(/\s([\s\w]+?)\W+\[/)
    : description.match(/\s([\s\w]+?)\w+\[/);
  const extractedTitle = titleMatch ? titleMatch[1].trim() : title;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Alert className={`max-w-[35vw] ${getCardStyles(severity)} mx-2 mb-4 `}>
          <AlertTitle className="flex ">
            <ExclamationTriangleIcon className="h-8 w-8 mx-2 opacity-100 text-yellow-700 " />

            <span className="text-[15px] text-black font-bold flex flex-col break-words">
              <div className="flex items-end gap-x-2 ">
                {extractedTitle.charAt(0).toUpperCase() +
                  extractedTitle.slice(1)}
                <Badge
                  className={` hover:bg-yellow-300 mr-2 text-xs select-none cursor-default font-fira-code py-0  ${getBadgeStyles(severity)} `}
                >
                  {severity}
                </Badge>
              </div>

              <span className="text-xs text-gray-400 ">
                {description.slice(0, 60)}...
              </span>
            </span>
          </AlertTitle>
        </Alert>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-[15px]",
          "max-w-[80vw]",
        )}
      >
        <DialogTitle className="text-slate-200 text-2xl font-semibold p-4">
          {titleMatch ? titleMatch : title}
          <Badge
            className={` hover:bg-yellow-300 mr-2 text-xs select-none cursor-default font-fira-code py-0 ml-2  ${getBadgeStyles(severity)}`}
          >
            {severity}
          </Badge>
        </DialogTitle>

        <div className="divide-y divide-slate-700 rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
          {/* Description Row */}
          <div className="grid grid-cols-[200px,1fr] divide-x divide-slate-700">
            <div className="bg-slate-800 p-4 flex items-center justify-center">
              <h3 className="text-slate-200 font-semibold">Description</h3>
            </div>
            <div className="p-4 text-slate-300 leading-relaxed">
              {description}
            </div>
          </div>

          {/* Impact Row */}
          <div className="grid grid-cols-[200px,1fr] divide-x divide-slate-700">
            <div className="bg-slate-800 p-4 flex items-center justify-center">
              <h3 className="text-slate-200 font-semibold">Impact</h3>
            </div>
            <div className="p-4 text-slate-300 leading-relaxed">
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
          <div className="grid grid-cols-[200px,1fr] divide-x divide-slate-700">
            <div className="bg-slate-800 p-4 flex items-center justify-center">
              <h3 className="text-slate-200 font-semibold">Recommendation</h3>
            </div>
            <div className="p-4 text-slate-300 leading-relaxed">
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

// Critical: DB0004, High: EA6336, Medium: EA9C36, Low: EAE436, Info: 36A2EA
const getCardStyles = (severity: string) => {
  const baseStyles = `text-xs border box-border h-[64px] min-h-[64px] max-h-[70px] bg-white rounded-lg select-none`;

  switch (severity) {
    case "Critical":
      return `${baseStyles} border-[#DB0004] text-[#DB0004]`;
    case "High":
      return `${baseStyles} border-[#EA6336] text-[#EA6336]`;
    case "Medium":
      return `${baseStyles} border-[#EA9C36] text-[#EA9C36]`;
    case "Low":
      return `${baseStyles} border-[#EAE436] text-[#EAE436]`;
    case "Info":
      return `${baseStyles} border-[#36A2EA] text-[#36A2EA]`;
    default:
      return `${baseStyles} border-gray-500 text-gray-500`;
  }
};

const getSeverityLevel = (severity: string) => {
  switch (severity) {
    case "Critical":
      return 5;
    case "High":
      return 4;
    case "Medium":
      return 3;
    case "Low":
      return 2;
    case "Info":
      return 1;
    default:
      return 0; // 알 수 없는 심각도일 경우
  }
};

const getBadgeStyles = (severity: string) => {
  const baseStyles = `text-[11px] border rounded-md select-none px-2 py-[2px] font-medium`;

  switch (severity) {
    case "Critical":
      return `${baseStyles} border-[#DB0004] text-[#DB0004] bg-[#DB0004]/10`;
    case "High":
      return `${baseStyles} border-[#EA6336] text-[#EA6336] bg-[#EA6336]/10`;
    case "Medium":
      return `${baseStyles} border-[#EA9C36] text-[#EA9C36] bg-[#EA9C36]/10`;
    case "Low":
      return `${baseStyles} border-[#EAE436] text-[#EAE436] bg-[#EAE436]/10`;
    case "Info":
      return `${baseStyles} border-[#36A2EA] text-[#36A2EA] bg-[#36A2EA]/10`;
    default:
      return `${baseStyles} border-gray-500 text-gray-500 bg-gray-500/10`;
  }
};
