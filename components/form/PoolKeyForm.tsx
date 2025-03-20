"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TaskCreationRequest from "@/types/request/api/tasks/TaskCreationRequest";

import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_API_URL } from "@/utils/APIreqeust";

export { AddressInput, NumberInput };

function AddressInput({
  name,
  label,
  state,
  onChange,
}: {
  name: string;
  label: string;
  state: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [error, setError] = useState("");

  const regex = /^0x[a-fA-F0-9]{40}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (!regex.test(inputValue)) {
      setError(
        'The input must start with "0x" followed by 20 hexadecimal characters.',
      );
    } else {
      setError("");
    }
    onChange(inputValue);
  };

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type="text"
        id={name}
        placeholder={`address 0x...`}
        value={state}
        onChange={handleChange}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function NumberInput({
  name,
  label,
  state,
  onChange,
}: {
  name: string;
  label: string;
  state: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [error, setError] = useState("");

  const regex = /^-?[0-9]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (!regex.test(inputValue)) {
      setError("The input must contain only numbers.");
    } else {
      setError("");
    }
    onChange(inputValue);
  };

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type="number"
        id={name}
        placeholder={`number ${name}`}
        value={state}
        onChange={handleChange}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

// ✅ 체인별 Blockscout API URL 매핑
const blockscoutUrls: Record<string, string> = {
  eth: "https://eth.blockscout.com",
  uni: "https://unichain.blockscout.com",
  base: "https://base.blockscout.com",
  arb: "https://arbitrum.blockscout.com",
};

export default function PoolKeyForm({
  router,
}: Readonly<{ router: AppRouterInstance }>) {
  const [currency0, setCurrency0] = useState<string>("");
  const [currency1, setCurrency1] = useState<string>("");
  const [fee, setFee] = useState<string>("");
  const [tickSpacing, setTickSpacing] = useState<string>("");
  const [hooks, setHooks] = useState<string>("");
  const [deployer, setDeployer] = useState<string>("");
  const [chain, setChain] = useState<string>("eth");

  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 메시지 추가

  const blockscoutBaseUrl = blockscoutUrls[chain] || "";

  const onClickSamplePoolKeyHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setCurrency0("0x4200000000000000000000000000000000000006");
    setCurrency1("0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2");
    setFee("8388608");
    setTickSpacing("200");
    setHooks("0x8dd4c756F183513850e874F7d1ffd0d7Cb498080");
    setDeployer("0x4e59b44847b379578588920cA78FbF26c0B4956C");
    setChain("base");
  };

  function makePoolKeyRequestBody(): TaskCreationRequest {
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
        deployer: deployer || "0x4e59b44847b379578588920cA78FbF26c0B4956C", // 기본값 적용
        chain: chain, // 선택한 체인 추가
      },
    };
  }

  const savePoolKeyToLocalStorage = () => {
    localStorage.removeItem("poolKeyData"); // 기존 데이터 삭제
    const poolKeyData = {
      chain,
      currency0,
      currency1,
      fee,
      tickSpacing,
      hooks,
      deployer,
    };
    localStorage.setItem("poolKeyData", JSON.stringify(poolKeyData));
  };

  // ✅ Hook 검증 함수 (결과를 로컬 스토리지에 전체 저장)
  const verifyContract = async () => {
    try {
      if (!hooks || !blockscoutBaseUrl) {
        setError("Invalid hooks address or chain selection.");
        return;
      }
      localStorage.removeItem("hookCodeData"); // 기존 데이터 삭제

      setLoading(true);
      setError(null);

      const response = await fetch(
        `${blockscoutBaseUrl}/api/v2/smart-contracts/${hooks}`,
      );
      if (!response.ok)
        throw new Error(`Failed to fetch contract data: ${response.status}`);

      const data = await response.json();
      const verified = !!data.source_code;

      if (verified) {
        localStorage.setItem("hookCodeData", JSON.stringify(data)); // ✅ 전체 데이터 저장
      } else {
        localStorage.removeItem("hookCodeData"); // ✅ 검증되지 않은 경우 삭제
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // API 요청 함수
  const sendApiRequest = async () => {
    setLoading(true);
    setError(null); // 에러 초기화
    try {
      sessionStorage.removeItem("staticResultData");
      sessionStorage.removeItem("dynamicResultData");
      savePoolKeyToLocalStorage(); // 입력 데이터를 localStorage에 저장

      const isHookVerified = await verifyContract();

      const dynamicRequestBody = makePoolKeyRequestBody();
      const dynamicResponse = await fetch(`${TASK_API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dynamicRequestBody),
      });
      if (!dynamicResponse.ok) {
        throw new Error(`Request failed with status ${dynamicResponse.status}`);
      }

      const dynamicResult = await dynamicResponse.json();
      if (
        !dynamicResult.info ||
        !dynamicResult.info.tasks ||
        dynamicResult.info.tasks.length === 0
      ) {
        throw new Error("No tasks found in response.");
      }

      const {
        hooks: dynamicHooks,
        timeHash: dynamicTimeHash,
        tasks: dynamicTasks,
      } = dynamicResult.info;
      const dynamicTaskIDs = dynamicTasks.map((task: any) => task.id);

      // ✅ 데이터를 Session Storage에 저장
      sessionStorage.setItem(
        "dynamicResultData",
        JSON.stringify({
          hooks: dynamicHooks,
          timeHash: dynamicTimeHash,
          mode: 2,
          taskIDs: dynamicTaskIDs,
        }),
      );

      const verifiedHookData = localStorage.getItem("hookCodeData");
      if (verifiedHookData) {
        const parsedHookData = JSON.parse(verifiedHookData);
        const staticRequestBody = {
          data: {
            source: parsedHookData.source_code,
            mode: 4,
          },
        };
        const staticResponse = await fetch(`${TASK_API_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(staticRequestBody),
        });
        if (!staticResponse.ok) {
          throw new Error(
            `Request failed with status ${staticResponse.status}`,
          );
        }

        const staticResult = await staticResponse.json();
        if (
          !staticResult.info ||
          !staticResult.info.tasks ||
          staticResult.info.tasks.length === 0
        ) {
          throw new Error("No tasks found in response.");
        }

        const {
          hooks: staticHooks,
          timeHash: staticTimeHash,
          tasks: staticTasks,
        } = staticResult.info;
        const staticTaskIDs = staticTasks.map((task: any) => task.id);

        // ✅ 데이터를 Session Storage에 저장
        sessionStorage.setItem(
          "staticResultData",
          JSON.stringify({
            hooks: staticHooks,
            timeHash: staticTimeHash,
            mode: 4,
            taskIDs: staticTaskIDs,
          }),
        );
      }

      router.push(`/dynamicResult`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-4 border-solid w-[500px]">
      <CardHeader className="flex space-y-8">
        <CardTitle>PoolKeyForm</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
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
          label="IHook hooks"
          state={hooks}
          onChange={setHooks}
        />
        <AddressInput
          name="deployer"
          label="address deployer"
          state={deployer}
          onChange={setDeployer}
        />
        {/* 🔽 Chain 선택 (Dropdown) */}
        <Label>Chain</Label>
        <Select value={chain} onValueChange={setChain}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eth">Ethereum</SelectItem>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="arb">Arbitrum</SelectItem>
            <SelectItem value="uni">Unichain</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={onClickSamplePoolKeyHandler}
          className="text-xs cursor-pointer hover:underline"
        >
          need a sample?
        </button>
      </CardContent>
      <CardFooter>
        <Button
          className="bg-primary text-white"
          onClick={(e) => {
            e.preventDefault();
            sendApiRequest();
          }}
          disabled={loading} // 로딩 중 버튼 비활성화
        >
          {loading ? "Sending..." : "Scan"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
        {/* {"fail to send request"} */}
      </CardFooter>
    </Card>
  );
}
