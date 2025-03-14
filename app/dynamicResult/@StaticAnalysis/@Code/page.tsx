"use client";

import { useEffect, useState } from "react";

import ScrollableCode from "@/components/form/CodeHighlighter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/loading";

export default function StaticAnalysisResultPage() {
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hookAddress, setHookAddress] = useState<string | null>(null);
  const [chain, setChain] = useState<string | null>(null);

  // ✅ 체인별 Blockscout API URL 매핑
  const blockscoutUrls: Record<string, string> = {
    eth: "https://eth.blockscout.com",
    uni: "https://unichain.blockscout.com",
    base: "https://base.blockscout.com",
    arb: "https://arbitrum.blockscout.com",
  };

  // ✅ 올바른 체인인지 확인 후 base URL 설정
  const blockscoutBaseUrl = blockscoutUrls[chain] || "";

  useEffect(() => {
    // `localStorage`에서 poolKeyData 가져오기
    const savedPoolKeyData = localStorage.getItem("poolKeyData");
    if (savedPoolKeyData) {
      const { hooks, chain } = JSON.parse(savedPoolKeyData);
      setHookAddress(hooks); // hooks 주소 설정
      setChain(chain || "eth");
    } else {
      setError("No pool key data found in local storage.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const verifyContract = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ 유효하지 않은 체인일 경우 에러 표시 후 요청 중단
        if (!blockscoutBaseUrl) {
          setError("Invalid chain selected.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${blockscoutBaseUrl}/api/v2/smart-contracts/${hookAddress}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch contract data: ${response.status}`);
        }

        const data = await response.json();
        setVerificationResult(data);

        // ✅ 검증된 경우 API 요청하여 taskID 받아오기
        if (data.source_code) {
          const taskId = await createTask(data.source_code);
          if (taskId) {
            saveTaskIDToLocalStorage(taskId); // ✅ taskID 로컬 스토리지 저장
          }
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (hookAddress) {
      verifyContract();
    } else {
      setError("No hook address provided.");
      setLoading(false);
    }
  }, [hookAddress]);

  const createTask = async (sourceCode: string) => {
    try {
      const requestBody = {
        data: {
          source: sourceCode,
          mode: 4,
        },
      };

      const response = await fetch("http://localhost:7777/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.status}`);
      }

      const result = await response.json();
      const taskId = result.info.tasks.map((task: any) => task.id); // id 추출

      if (!taskId) {
        throw new Error("Failed to retrieve taskID.");
      }

      return taskId; // 완료된 taskID 반환
    } catch (err: any) {
      setError(err.message || "Failed to create task.");
      return null;
    }
  };

  // ✅ taskID를 로컬 스토리지에 저장하는 함수
  const saveTaskIDToLocalStorage = (taskID: string) => {
    try {
      const existingTaskIDs = localStorage.getItem("taskIDs");
      let taskIDList: string[] = existingTaskIDs
        ? JSON.parse(existingTaskIDs)
        : [];

      // 중복 추가 방지
      if (!taskIDList.includes(taskID)) {
        taskIDList.push(taskID);
        localStorage.setItem("taskIDs", JSON.stringify(taskIDList));
      }
    } catch (err) {
      console.error("Failed to save taskID to localStorage:", err);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        <Loading containerClassName="h-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const isVerified = verificationResult?.source_code;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex">
            <h1
              className="text-4xl m-3"
              style={{
                fontFamily: "sans-serif",
              }}
            >
              {isVerified
                ? verificationResult.name || "Verified Contract"
                : "Unverified or Not Found"}
            </h1>
            <div className="flex items-end">
              <div className="flex flex-col text-xs font-fira-code m-2 ">
                <h2 className="">
                  {isVerified ? verificationResult.evm_version : "N/A"}
                </h2>
                <h2 className="">
                  {isVerified
                    ? "Verified"
                    : verificationResult?.message === "Not found"
                      ? "Contract Not Found"
                      : "Unverified Contract"}
                </h2>
                {hookAddress && blockscoutBaseUrl && (
                  <a
                    className="text-info-500 hover:underline cursor-pointer max-w-[100px] truncate"
                    target="_blank"
                    href={`${blockscoutBaseUrl}/address/${hookAddress}?tab=contract`}
                  >
                    {hookAddress}
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isVerified ? (
          <>
            <h2 className="text-lg font-bold mb-2">Source Code:</h2>
            <ScrollableCode codeString={verificationResult.source_code} />
          </>
        ) : (
          <div>
            <h2 className="text-lg font-bold">Details:</h2>
            <ScrollableCode codeString={"Unverified Contract or Not Found"} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
