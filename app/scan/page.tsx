"use client";

import { post } from "@/app/actions/v1/tasks/page";
import CodeHighlighter from "@/components/form/CodeHighlighter";
import { AddressInput, NumberInput } from "@/components/form/PoolKeyForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import TaskCreationRequest from "@/types/request/api/tasks/TaskCreationRequest";
import { sampleCodeTakeProfitHook } from "@/utils/Constants";
import { Tabs } from "@radix-ui/react-tabs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

import { useState } from "react";

// const baseRequestBody = {
//   data: {
//     Poolkey: {
//       currency0,
//       currency1,
//       fee: Number(fee),
//       tickSpacing: Number(tickSpacing),
//       hooks,
//     },
//     mode: 2,
//   },
// };

export default function Page(): React.ReactNode {
  return (
    <Tabs defaultValue="PoolKey">
      <TabsList>
        <TabsTrigger value="PoolKey">PoolKey</TabsTrigger>
        <TabsTrigger value="HookCode">HookCode</TabsTrigger>
      </TabsList>
      <TabsContent value="PoolKey">
        <PoolKeyForm />
      </TabsContent>
      <TabsContent value="HookCode">
        <HookCodeForm />
      </TabsContent>
    </Tabs>
  );
}

async function doRequest(
  router: AppRouterInstance,
  data: TaskCreationRequest,
): Promise<void> {
  // TODO: revalidate cache based on user TTL settings
  if (localStorage.getItem("_herbicide_request") === JSON.stringify(data)) {
    console.log(
      "same input already sent: try with different data currently purge cache",
    );
    router.push("/result");
    return;
  }

  try {
    localStorage.setItem("_herbicide_request", JSON.stringify(data));
    const response = await post(data);
    localStorage.setItem("_herbicide_response", JSON.stringify(response));
    router.push("/result");
  } catch (error) {
    console.error("Server error: ", error);
    alert("A server error occurred. Please try again later.");
  }
}

function PoolKeyForm() {
  // TODO: send request to server based on the input
  const router = useRouter();

  const [currency0, setCurrency0] = useState<string>("");
  const [currency1, setCurrency1] = useState<string>("");
  const [fee, setFee] = useState<string>("");
  const [tickSpacing, setTickSpacing] = useState<string>("");
  const [hooks, setHooks] = useState("");

  const onClickSamplePoolKeyHandler = (
    event: React.MouseEvent<HTMLParagraphElement>,
  ) => {
    event.preventDefault();
    setCurrency0("0x0197481B0F5237eF312a78528e79667D8b33Dcff");
    setCurrency1("0xA56569Bd93dc4b9afCc871e251017dB0543920d4");
    setFee("3000");
    setTickSpacing("60");
    setHooks("0x6caC2dcc5eCf5caac0382F1B4A77EABac0F6C0Cc");
  };

  function makeRequestBody() {
    return {
      data: {
        Poolkey: {
          currency0,
          currency1,
          fee: Number(fee),
          tickSpacing: Number(tickSpacing),
          hooks,
        },
        mode: 2, // TODO: support other modes
      },
    };
  }

  return (
    <div>
      <h1>PoolKeyForm</h1>

      <AddressInput
        name="currency0"
        label="Currency currency0"
        state={currency0}
        onChange={setCurrency0}
      />
      <AddressInput
        name="currency1"
        label="Currency currency1"
        state={currency1}
        onChange={setCurrency1}
      />
      <NumberInput
        name="fee"
        label="uint24 fee"
        state={fee}
        onChange={setFee}
      />
      <NumberInput
        name="tickSpacing"
        label="int24 tickSpacing"
        state={tickSpacing}
        onChange={setTickSpacing}
      />
      <AddressInput
        name="hook"
        label="Hook"
        state={hooks}
        onChange={setHooks}
      />

      <p
        onClick={onClickSamplePoolKeyHandler}
        className="text-xs cursor-pointer hover:underline"
      >
        need a sample?
      </p>

      <Button
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={(e) => {
          e.preventDefault();
          doRequest(router, makeRequestBody());
        }}
      >
        Scan
      </Button>
    </div>
  );
}

function HookCodeForm() {
  // TODO: send request to server based on the input
  const [code, setCode] = useState<string>("");

  const onClickSamplePoolKeyHandler = (
    event: React.MouseEvent<HTMLParagraphElement>,
  ) => {
    event.preventDefault();
    setCode(sampleCodeTakeProfitHook);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> HookCodeForm </CardTitle>
        <CardDescription> desc </CardDescription>
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
            />
            <p
              onClick={onClickSamplePoolKeyHandler}
              className="text-xs cursor-pointer hover:underline"
            >
              need a sample?
            </p>
          </TabsContent>
          <TabsContent value="Preview">
            <CodeHighlighter codeString={code} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import React, { useState, useCallback, useMemo } from "react";
// import { Label } from "@/components/ui/label";
// import { AddressInput, NumberInput } from "@/components/form/PoolKeyForm";
// import { sampleCodeTakeProfitHook } from "@/utils/Constants";
// import { useRouter } from "next/navigation";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function Page() {
//   const router = useRouter();

//   const [type, setType] = useState<"code" | "poolKey">("poolKey");
//   const [responseMessage, setResponseMessage] = useState<string>("");
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
