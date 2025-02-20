"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";

import { TaskCreationSourceOnlyRequest } from "@/types/request/api/tasks/TaskCreationRequest";
import { sampleCodeTakeProfitHook } from "@/utils/Constants";
import { doRequest } from "@/utils/SimpleRequest";

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

export default function HookCodeForm({
  router,
}: Readonly<{ router: AppRouterInstance }>) {
  // TODO: send request to server based on the input
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 메시지 추가

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
        mode: 4,
      },
    };
  }

  const saveDataToLocalStorage = () => {
    const hookCodeData = { code };
    localStorage.setItem("hookCodeData", JSON.stringify(hookCodeData));
  };

  // API 요청 함수
  const sendApiRequest = async () => {
    setLoading(true);
    setError(null); // 에러 초기화
    try {
      saveDataToLocalStorage(); // 입력 데이터를 localStorage에 저장

      const requestBody = makeHookCodeRequestBody();
      const response = await fetch("http://localhost:7777/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      const taskIds = result.info.tasks.map((task: any) => task.id); // id 추출

      const query = new URLSearchParams({
        ids: JSON.stringify(taskIds),
      }).toString();
      router.push(`/staticResult?${query}`);
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
            sendApiRequest();
          }}
        >
          Scan
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
      </CardFooter>
    </Card>
  );
}
