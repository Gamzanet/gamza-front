"use client";

import { useEffect, useState } from "react";

import { DynamicTokenPriceResult } from "@/components/result/dynamic";

export async function getStaticParams() {
  const res = await fetch(
    "https://hermes.pyth.network/api/latest_price_feeds?ids[]=0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  );
  const data = await res.json();

  return {
    props: {
      priceData: data,
    },
    revalidate: 60, // 60초마다 재생성
  };
}

export default function ERC6909DeltaBurnResultPage() {
  const [isCode, setIsCode] = useState<boolean>(false);

  useEffect(() => {
    const source = localStorage.getItem("source");
    setIsCode(source === "code");
  }, []);

  return (
    <>
      {!isCode && (
        <DynamicTokenPriceResult
          swappedPrice={100/97}
          fee={3000}
          oraclePrice={1}
        />
      )}
    </>
  );
}

// 3번째 인덱스 가져와서 어쩌구 저쩌구 ~~