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
    try {
      // ✅ `localStorage`에서 poolKeyData 가져오기
      const savedPoolKeyData = localStorage.getItem("poolKeyData");
      if (savedPoolKeyData) {
        const { hooks, chain } = JSON.parse(savedPoolKeyData);
        setHookAddress(hooks); // hooks 주소 설정
        setChain(chain || "eth");
      }

      // ✅ `hookCodeData` 가져오기
      const hookCodeData = localStorage.getItem("hookCodeData");
      if (hookCodeData) {
        const parsedCodeData = JSON.parse(hookCodeData);

        if (parsedCodeData && Object.keys(parsedCodeData).length > 0) {
          setVerificationResult(parsedCodeData);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  }, []);

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
            <ScrollableCode
              codeString={verificationResult.source_code}
              className={`h-[60vh]`}
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
