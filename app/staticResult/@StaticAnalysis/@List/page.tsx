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

  useEffect(() => {
    const fetchAnalysisResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // URL에서 IDs 가져오기
        const idsParam = searchParams.get("ids");
        if (!idsParam) {
          throw new Error("No task IDs provided");
        }

        const ids = JSON.parse(decodeURIComponent(idsParam));
        let completedIds = new Set<string>(); // 이미 완료된 Task ID 저장

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
        };

        // ✅ 비동기 폴링으로 개별 데이터 업데이트
        ids.forEach(async (taskId, index) => {
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

  if (loading) {
    return <Loading />;
  }

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
