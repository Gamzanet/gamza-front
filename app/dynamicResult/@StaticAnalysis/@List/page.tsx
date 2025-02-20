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

const POLLING_INTERVAL = 5000; // 5초 간격으로 상태 확인

// 특정 위협의 상세 정보 매핑
const threatDetails: Record<string, any> = {
  Minimum: {
    title: "Minimum",
    description:
      "The 'Minimum' function in the Hook contract has been flagged for potential operational issues. If not properly configured, it may lead to restrictions in liquidity management, affecting user accessibility and overall pool efficiency.",
    impact:
      "If the Minimum function is not optimized, liquidity providers may experience unexpected limitations in depositing or withdrawing assets. This can reduce the usability of the liquidity pool and may lead to inefficient capital utilization. In extreme cases, liquidity could become inaccessible, causing trust issues among users and harming the DEX's reputation.",
    recommendation:
      "To ensure seamless liquidity management, it is crucial to verify that the Minimum function is correctly implemented. Developers should conduct rigorous testing to prevent unintended asset locks and ensure that users can freely interact with the liquidity pool under all expected conditions. Additionally, continuous monitoring and updates should be applied to mitigate any operational risks.",
  },
  TimeLock: {
    title: "TimeLock",
    description:
      "In some DEX scam cases, liquidity providers are prevented from reclaiming all their assets in the Liquidity Pool, or liquidity can only be added or removed at certain times or under certain conditions, leading to user inconvenience and potential loss. If Uniswap V4 Liquidity Pools become unusable after a certain time period, this can result in significant accessibility issues for users.",
    impact:
      "If liquidity becomes inaccessible after a certain time or point, users will face limitations in retrieving or managing their assets in the pool. This could lead to liquidity being 'locked' or unavailable, compromising users' ability to interact with the pool as needed. Such restrictions undermine the availability and reliability of the DEX, harming user trust and potentially resulting in financial loss for those affected.",
    recommendation:
      "To prevent scenarios where a Liquidity Pool becomes unusable after a set period, developers using hooks must carefully design and test to ensure continuous availability. Hook developers should monitor when and under what conditions the Liquidity Pool becomes inaccessible and address any potential access issues to ensure uninterrupted operation. Tracking and modifying problematic hook functions will help maintain liquidity availability and prevent accessibility issues.",
  },
  "Gas Grief": {
    title: "Gas Grief",
    description:
      "The 'Gas Grief' issue arises when transactions on the network require excessive gas fees due to poorly optimized or repetitive function calls. This can happen when functions, like transferring assets or verifying information, are not optimized for gas efficiency or are prone to executing multiple times unnecessarily. In smart contract environments, this inefficiency can create situations where the gas cost far exceeds the value of the transaction itself, making the transaction economically unfeasible for users.",
    impact:
      "When gas grief issues occur, they increase the transaction costs for end users, which can lead to users avoiding interactions with certain smart contracts or dApps. For an attacker, it could mean a potential vector to 'grief' or disrupt others by forcing them to spend disproportionately high gas fees on specific transactions. Over time, this can reduce trust in the platform or lead to increased abandonment of affected services.",
    recommendation:
      "Consider reviewing and optimizing the functions where gas grief may be occurring, particularly by reducing loops or heavy operations within commonly called functions. Additionally, consider implementing batching mechanisms or using layer-2 scaling solutions that can mitigate high gas fees by executing transactions off-chain, reducing the overall gas burden for users.",
  },
  OnlyPoolManager: {
    title: "OnlyPoolManager",
    description:
      "In the context of access control, OnlyPoolManager acts as a critical safeguard, ensuring that only authorized entities (specifically, those with the Pool Manager role) can perform specific actions within a contract. When callback functions are involved, this restriction becomes even more essential. Callback functions allow one contract to call another function as part of a transaction flow, often executing actions based on external conditions or events. If these callbacks are not adequately restricted, they can be exploited by unauthorized parties, leading to unexpected or malicious behavior. The OnlyPoolManager modifier can prevent unauthorized callbacks by enforcing strict access checks.",
    impact:
      "Allowing unrestricted access to callback functions poses several security risks:\n\n" +
      "- Unauthorized Invocation: If callback functions can be triggered by any address or contract, malicious actors could exploit these functions to manipulate the contract’s behavior. They could call functions in unintended ways, potentially draining funds, altering important parameters, or causing state inconsistencies.\n" +
      "- Unexpected Reentrancy: Unrestricted callbacks can open up reentrancy risks, where an attacker repeatedly calls a callback to execute the same function multiple times before it finishes. This can lead to unexpected changes in contract state or even asset theft if the contract is handling funds.\n" +
      "- Loss of Control: Callback functions are typically designed to be invoked only by specific contracts or addresses under particular conditions. If OnlyPoolManager is not applied, there’s a risk that unauthorized contracts might control these functions, reducing the protocol’s security and undermining its intended design\n",
    recommendation:
      "Implement the OnlyPoolManager modifier on any Hook callback functions to ensure they are only callable by authorized entities or under predefined conditions. Additionally, consider adding other safeguards like non-reentrant checks to prevent reentrancy attacks. Conduct regular audits of callback functions, focusing on who can call them and under what circumstances, to ensure there are no vulnerabilities. Using a well-defined ACL system around callbacks can prevent unauthorized access, protect contract integrity, and maintain user trust in the system.",
  },
  ReInitialize: {
    title: "ReInitialize",
    description:
      "The reinitialize keyword is used in smart contract design to allow re-execution of initialization functions under controlled conditions. It is particularly relevant for another `poolKey`, where developers may need to add new initialization logic. the initialize function is typically called only once to set up the contract state.",
    impact:
      "- The ability to reinitialize can be beneficial, but it also introduces potential risks if not handled carefully.\n" +
      "- Unintentional Resetting: Revitalizing can inadvertently reset critical parameters if access controls are not strict, potentially leading to loss of data, funds, or other unwanted changes in contract state.\n" +
      "- Security Risks: If re-initialization functions are poorly secured, an attacker could potentially reinitialize the contract to exploit new or existing vulnerabilities, allowing them to take control or modify the contract’s functionality in unintended ways.\n" +
      "- Compatibility Issues: Improper or excessive use of reinitialize can lead to storage clashes or inconsistencies, especially when upgrading complex contracts, leading to possible malfunctions or unexpected behavior.\n",
    recommendation:
      "Carefully plan each initialize to avoid overlapping storage variables or conflicting logic, and only allow reinitialize functions for setting up newly added state variables rather than altering any previous initialization values. Conduct thorough testing and audits for each re-initialization to avoid any security risks and preserve data integrity.",
  },
  Upgradeability: {
    title: "Upgradeability",
    description:
      "The hook contract for that pool key has been identified as a proxy contract.",
    impact:
      "The upgradeability feature can lead to serious security threats. If the upgrade mechanism is poorly implemented or insufficiently protected, malicious actors could exploit it to introduce unauthorized code, alter contract behavior, or even take control of assets within the contract. Common issues include:\n\n" +
      "- Unauthorized Upgrades: Weak access controls could allow unauthorized parties to perform upgrades, leading to full control over contract functionality and access to sensitive assets.\n" +
      "- Storage Collisions: Upgrades may unintentionally overwrite important storage variables, leading to corruption of contract data or breaking functionality.\n" +
      "- Backdoor Vulnerabilities: Upgradable contracts may unintentionally include hidden functions or weak upgrade permissions, enabling potential attackers to perform arbitrary upgrades at a later date.\n" +
      "- User Trust: Frequent or unauthorized upgrades can erode user confidence, as users may fear losing funds or being subject to unexpected behavior changes.\n",
    recommendation:
      "Special attention needs to be paid to whether the proxy contract can be changed without permission.",
  },
  // 다른 위협 상세 정보 추가 가능
};

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

        // 개별 `taskID`에 대해 API 호출 (폴링 방식)
        const fetchResult = async (taskId: string) => {
          while (true) {
            const response = await fetch(
              `http://localhost:7777/api/result/${taskId}`,
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch data for taskID: ${taskId}`);
            }

            const result = await response.json();

            if (result.status === "Success") {
              return result;
            }

            await new Promise((resolve) =>
              setTimeout(resolve, POLLING_INTERVAL),
            );
          }
        };

        // 모든 `taskID`에 대한 결과 가져오기
        const results = await Promise.all(ids.map(fetchResult));

        // `threats` 데이터 변환 및 threat 위협 추가
        let formattedThreats = results.flatMap((res, index) => {
          let threatsList =
            res.result?.result?.threats?.map((threat: any) => ({
              name: threat.detector,
              description: threat.data.description,
              severity: threat.data.impact,
              type: "custom",
            })) || [];

          // ✅ Minimum(0번 인덱스)에서 `FAIL >= 1` 이면 `Minimum` 위협 추가
          if (index === 0 && res.result?.result?.FAIL >= 1) {
            threatsList.push({
              name: "Minimum",
              description:
                "Unexpected behavior detected in one or more Hook functions (Swap, Donate, AddLiquidity, RemoveLiquidity).",
              severity: "Info",
              type: "custom",
            });
          }

          // ✅ TimeLock(1번 인덱스)에서 `FAIL >= 1` 이면 `TimeLock` 위협 추가
          if (index === 1 && res.result?.result?.FAIL >= 1) {
            threatsList.push({
              name: "TimeLock",
              description:
                "This pool key does not appear to be a pool key that can be used at any time.",
              severity: "Medium",
              type: "custom",
            });
          }

          // ✅ Gas Grief(2번 인덱스)에서 `FAIL >= 1` 이면 `Gas Grief` 위협 추가
          if (index === 2 && res.result?.result?.FAIL >= 1) {
            threatsList.push({
              name: "Gas Grief",
              description:
                "Running the basic function of the pool key could not estimate gas.",
              severity: "Low",
              type: "custom",
            });
          }

          // ✅ OnlyByPoolManager-Chk(4번 인덱스)에서 `FAIL >= 1` 이면 `OnlyPoolManager` 위협 추가
          if (index === 4 && res.result?.result?.FAIL >= 1) {
            threatsList.push({
              name: "OnlyPoolManager",
              description:
                "In addition to the PoolManager, the hook contract can call hook function, which requires attention.",
              severity: "Medium",
              type: "custom",
            });
          }

          // ✅ double-Initialize-Test(5번 인덱스)에서 `FAIL >= 1` 이면 `ReInitialize` 위협 추가
          if (index === 5 && res.result?.result?.FAIL >= 1) {
            threatsList.push({
              name: "ReInitialize",
              description:
                "This pool key has no limitation on initialize, and storage management is found to be inadequate.",
              severity: "Medium",
              type: "custom",
            });
          }

          // ✅ Proxy-Test(6번 인덱스)에서 `FAIL >= 1` 이면 `Upgradeability` 위협 추가
          if (index === 6 && res.result?.result?.FAIL >= 1) {
            threatsList.push({
              name: "Upgradeability",
              description:
                "The hook contract for that pool key has been identified as a proxy contract.",
              severity: "Critical",
              type: "custom",
            });
          }

          return threatsList;
        });

        setThreats(formattedThreats);
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
