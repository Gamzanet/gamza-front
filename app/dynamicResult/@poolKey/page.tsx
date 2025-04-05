"use client";

import { useEffect, useState } from "react";
import { DynamicPoolKeyResult } from "@/components/result/dynamic";

export default function PoolKeyInformationResultPage() {
  const [poolKeyData, setPoolKeyData] = useState({
    currency0: "",
    currency1: "",
    fee: 0,
    tickSpacing: 0,
    hooks: "",
    deployer: "",
  });

  useEffect(() => {
    // 입력 데이터 가져오기
    const savedPoolKeyData = localStorage.getItem("poolKeyData");
    if (savedPoolKeyData) {
      setPoolKeyData(JSON.parse(savedPoolKeyData));
    }
  }, []);

  return (
    <DynamicPoolKeyResult
      chain={poolKeyData.chain || "Not provided"}
      currency0={poolKeyData.currency0 || "Not provided"}
      currency1={poolKeyData.currency1 || "Not provided"}
      fee={
        Number(poolKeyData.fee) === 0x800000
          ? "dynamicFee"
          : poolKeyData.fee || "Not provided"
      }
      tickSpacing={poolKeyData.tickSpacing || "Not provided"}
      hooks={poolKeyData.hooks || "Not provided"}
      deployer={poolKeyData.deployer || "Not provided"}
    />
  );
}
