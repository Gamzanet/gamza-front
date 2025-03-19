"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/ui/loading";

import ScrollableCode from "@/components/form/CodeHighlighter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const POLLING_INTERVAL = 5000; // 5초 간격으로 상태 확인
const MAX_RETRIES = 10; // 최대 시도 횟수 설정

export default function StaticAnalysisResultPage() {
  const [hookCodeResult, setHookCodeResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchHookCodeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const idsParam = searchParams.get("ids");
        if (!idsParam) {
          throw new Error("No task IDs provided");
        }

        const ids = JSON.parse(decodeURIComponent(idsParam));
        const targetId = ids[0];

        const fetchResult = async () => {
          const response = await fetch(
            `http://localhost:7777/api/result/${targetId}`,
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
          }

          const result = await response.json();
          if (result.status === "Pending") {
            return null; // 아직 결과가 준비되지 않음
          }
          return result;
        };

        let resultData = null;
        let retries = 0;
        while (!resultData && retries < MAX_RETRIES) {
          resultData = await fetchResult();
          if (!resultData) {
            retries++;
            await new Promise((resolve) =>
              setTimeout(resolve, POLLING_INTERVAL),
            );
          }
        }

        if (!resultData) {
          throw new Error("Failed to fetch data within the retry limit.");
        }

        setHookCodeResult(resultData); // 상태에 올바른 값을 설정
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchHookCodeData();
  }, [searchParams]);

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
              {hookCodeResult?.result?.result?.info?.data?.contract_scope?.name
                ? hookCodeResult.result.result.info.data.contract_scope.name
                : "Unverified or Not Found"}
            </h1>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hookCodeResult?.result?.result?.info?.data?.contract_scope?.name ? (
          <>
            <h2 className="text-lg font-bold mb-2">Source Code:</h2>
            <ScrollableCode
              codeString={hookCodeResult?.result?.code || "No Code Available"}
            />
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
