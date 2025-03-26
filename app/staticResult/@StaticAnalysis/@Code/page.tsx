"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/ui/loading";
import ScrollableCode from "@/components/form/CodeHighlighter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaticAnalysisResultPage() {
  const [hookCodeResult, setHookCodeResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      // ✅ 로컬 스토리지에서 저장된 코드 가져오기
      const storedData = localStorage.getItem("hookCodeData");

      if (!storedData) {
        throw new Error("No saved hook code found in local storage.");
      }

      const parsedData = JSON.parse(storedData);
      if (!parsedData?.code) {
        throw new Error("Invalid data in local storage.");
      }

      setHookCodeResult(parsedData.code);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
              Hook Code Preview
            </h1>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-lg font-bold mb-2">Hook Source Code:</h2>
        <ScrollableCode codeString={hookCodeResult || "No Code Available"} className={`h-[60vh]`}/>
      </CardContent>
    </Card>
  );
}
