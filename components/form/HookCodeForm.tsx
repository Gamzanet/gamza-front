"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TaskCreationSourceOnlyRequest } from "@/types/request/api/tasks/TaskCreationRequest";
import { sampleCodeTakeProfitHook } from "@/utils/Constants";

import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ScrollableCode from "./CodeHighlighter";
import { TASK_API_URL } from "@/utils/APIreqeust";

export default function HookCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClickSamplePoolKeyHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setCode(sampleCodeTakeProfitHook);
  };

  function makeHookCodeRequestBody(): TaskCreationSourceOnlyRequest {
    return {
      data: {
        source: code,
        mode: 4, // ✅ mode는 직접 설정
      },
    };
  }

  const saveDataToLocalStorage = () => {
    const hookCodeData = { code };
    localStorage.setItem("hookCodeData", JSON.stringify(hookCodeData));
  };

  const sendApiRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      sessionStorage.removeItem("staticResultData");
      sessionStorage.removeItem("dynamicResultData");
      saveDataToLocalStorage(); // 기존 데이터 저장

      const requestBody = makeHookCodeRequestBody();
      const response = await fetch(`${TASK_API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      if (
        !result.info ||
        !result.info.tasks ||
        result.info.tasks.length === 0
      ) {
        throw new Error("No tasks found in response.");
      }

      const { hooks, timeHash, tasks } = result.info;
      const taskIDs = tasks.map((task: any) => task.id);
      const mode = 4; // ✅ mode 추가

      // ✅ 데이터를 Session Storage에 저장
      sessionStorage.setItem(
        "staticResultData",
        JSON.stringify({ hooks, timeHash, mode, taskIDs }),
      );

      await router.push(`/staticResult`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[500px] border-4">
      <CardHeader>
        <CardTitle>HookCodeForm</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <Tabs defaultValue="Input">
          <TabsList>
            <TabsTrigger value="Input">Input</TabsTrigger>
            <TabsTrigger value="Preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="Input">
            <Textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-72"
            />
            <button
              onClick={onClickSamplePoolKeyHandler}
              className="text-xs cursor-pointer hover:underline"
            >
              need a sample?
            </button>
          </TabsContent>
          <TabsContent value="Preview">
            <ScrollableCode codeString={code} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          className="bg-primary text-white"
          onClick={(e) => {
            e.preventDefault();
            if (!loading) sendApiRequest();
          }}
          disabled={loading}
        >
          {loading ? "Processing..." : "Scan"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardFooter>
    </Card>
  );
}
