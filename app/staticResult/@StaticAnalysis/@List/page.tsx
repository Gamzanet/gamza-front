"use client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
import { SSE_URL, RESULT_API_URL } from "@/utils/APIreqeust";

export default function StaticAnalysisResultPage() {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { theme } = useTheme(); // ✅ 현재 테마 가져오기
  const isDarkMode = theme === "dark";
  useEffect(() => {
    // ✅ sessionStorage에서 저장된 Task 정보 가져오기
    const storedData = sessionStorage.getItem("staticResultData");
    if (!storedData) {
      setError("No task data found in session storage.");
      setLoading(false);
      return;
    }

    const { hooks, timeHash, taskIDs } = JSON.parse(storedData);
    const mode = 4; // ✅ 정적 분석 (Static Analysis) 모드

    if (!hooks || !timeHash || !taskIDs || taskIDs.length === 0) {
      setError("Missing required parameters.");
      setLoading(false);
      return;
    }

    // ✅ SSE 연결 설정
    const eventSource = new EventSource(
      `${SSE_URL}/${timeHash}/${hooks}/${mode}/0`,
    );

    eventSource.onmessage = async (event) => {
      try {
        console.log("SSE Received:", event.data);

        // ✅ "complete idx: X, task-id: Y" 형태의 데이터를 파싱
        const match = event.data.match(/idx: (\d+), task-id: ([a-z0-9-]+)/);
        if (match) {
          const idx = parseInt(match[1]);
          const taskId = match[2];

          if (!taskIDs.includes(taskId)) {
            console.warn(`Received taskID (${taskId}) not in stored session.`);
            return;
          }

          // ✅ 해당 taskId의 결과 요청
          const response = await fetch(`${RESULT_API_URL}/${taskId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch result for taskID: ${taskId}`);
          }

          const resultData = await response.json();

          // ✅ 새로운 위협 데이터 파싱
          const newThreats =
            resultData.result?.result?.threats?.map((threat: any) => ({
              name: threat.detector,
              description: threat.data.description,
              severity:
                threat.data.impact.charAt(0).toUpperCase() +
                threat.data.impact.slice(1).toLowerCase(),
              type: "custom",
            })) || [];

          setThreats((prevThreats) => {
            return [
              ...prevThreats,
              ...newThreats.filter(
                (newThreat) =>
                  !prevThreats.some(
                    (existingThreat) => existingThreat.name === newThreat.name,
                  ),
              ),
            ];
          });

          setLoading(false); // ✅ 첫 번째 데이터 수신 시 로딩 해제
        }
      } catch (error) {
        console.error("Error processing SSE data:", error);
        setError("Error receiving or processing data from server.");
      } finally {
        eventSource.close();
      }
    };

    eventSource.onerror = (event) => {
      // ✅ SSE 연결이 닫혔을 때 (정상 종료인 경우 무시)
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log("SSE connection closed normally.");
        return;
      }

      console.error("SSE Connection Error:", event);
      setError("Failed to connect to SSE.");
      eventSource.close();
    };

    return () => {
      eventSource.close(); // ✅ 컴포넌트 언마운트 시 SSE 연결 해제
    };
  }, []);

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
          className={`pl-10 transition-colors duration-200 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
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

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
          className={`max-w-[35vw] ${getCardStyles(severity, isDarkMode)} mx-2 mb-4`}
        >
          <AlertTitle className="flex">
            <ExclamationTriangleIcon className="h-8 w-8 mx-2 opacity-100 text-yellow-700" />
            <span
              className={`text-[15px] font-bold flex flex-col break-words ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              <div className="flex items-end gap-x-2">
                {extractedTitle.charAt(0).toUpperCase() +
                  extractedTitle.slice(1)}
                <Badge
                  className={`hover:bg-yellow-300 mr-2 text-xs select-none cursor-default font-bold py-0 ${getBadgeStyles(
                    severity,
                  )}`}
                >
                  {severity}
                </Badge>
              </div>
              <span
                className={`text-xs ${
                  isDarkMode ? "text-gray-300" : "text-gray-400"
                }`}
              >
                {description.slice(0, 60)}...
              </span>
            </span>
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
          {titleMatch ? titleMatch : title}
          <Badge
            className={`hover:bg-yellow-300 mr-2 text-xs select-none cursor-default font-bold py-0 ml-2 ${getBadgeStyles(
              severity,
            )}`}
          >
            {severity}
          </Badge>
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

// Critical: DB0004, High: EA6336, Medium: EA9C36, Low: EAE436, Info: 36A2EA
const getCardStyles = (severity: string, isDarkMode: boolean) => {
  const baseStyles = `text-xs border-2 box-border h-[64px] min-h-[64px] max-h-[70px] rounded-lg select-none transition duration-200`;

  const lightModeStyles = `bg-white text-black`;
  const darkModeStyles = `bg-black text-white`;

  const themeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  switch (severity) {
    case "Critical":
      return `${baseStyles} ${themeStyles} border-[#DB0004]`;
    case "High":
      return `${baseStyles} ${themeStyles} border-[#EA6336]`;
    case "Medium":
      return `${baseStyles} ${themeStyles} border-[#EA9C36]`;
    case "Low":
      return `${baseStyles} ${themeStyles} border-[#EAE436]`;
    case "Info":
      return `${baseStyles} ${themeStyles} border-[#36A2EA]`;
    default:
      return `${baseStyles} ${themeStyles} border-gray-500`;
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
  const baseStyles = `text-[11px] border rounded-md select-none px-2 py-[2px] font-bold`;

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
