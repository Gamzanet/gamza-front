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

  useEffect(() => {
    // `localStorage`에서 poolKeyData 가져오기
    const savedPoolKeyData = localStorage.getItem("poolKeyData");
    if (savedPoolKeyData) {
      const { hooks } = JSON.parse(savedPoolKeyData);
      setHookAddress(hooks); // hooks 주소 설정
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

        const response = await fetch(
          `https://unichain-sepolia.blockscout.com/api/v2/smart-contracts/${hookAddress}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch contract data: ${response.status}`);
        }

        const data = await response.json();
        setVerificationResult(data);
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
                {hookAddress && (
                  <a
                    className="text-info-500 hover:underline cursor-pointer max-w-[100px] truncate"
                    target="_blank"
                    href={`https://unichain-sepolia.blockscout.com/address/${hookAddress}?tab=contract`}
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
