"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DynamicTokenPriceResult } from "@/components/result/dynamic";
import Loading from "@/components/ui/loading";

const POLLING_INTERVAL = 5000; // 5초마다 상태 확인

export default function ERC6909DeltaBurnResultPage() {
  const [swappedPrice, setSwappedPrice] = useState<string | null>(null);
  const [oraclePrice, setOraclePrice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fee, setFee] = useState<number | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchDeltaData = async () => {
      try {
        const idsParam = searchParams.get("ids");
        if (!idsParam) {
          throw new Error("No task IDs provided in the URL.");
        }

        const ids = JSON.parse(decodeURIComponent(idsParam));
        const targetId = ids[9]; // 아홉 번째 인덱스의 ID 가져오기

        const fetchResult = async () => {
          const response = await fetch(
            `http://localhost:7777/api/result/${targetId}`,
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
          }
          return response.json();
        };

        let resultData = null;
        while (!resultData) {
          const data = await fetchResult();
          if (data.status === "Pending") {
            await new Promise((resolve) =>
              setTimeout(resolve, POLLING_INTERVAL),
            );
            continue;
          }
          resultData = data;
        }

        // ✅ 데이터 필터링 (is_burn이 false이고 is_exactIn이 true인 데이터만 선택)
        const validSwapData = resultData?.result?.data?.with_20?.swap?.find(
          (item: any) => !item.is_burn && item.is_exactIn,
        );

        if (!validSwapData) {
          throw new Error("No matching swap data found");
        }

        // ✅ Oracle Price 값 검증 후 변환 (wei → ether 단위)
        const price = Number(resultData?.result?.price);
        const formattedPrice =
          !isNaN(price) && price > 0 ? price.toFixed(18) : "No Data";

        // ✅ Swapped Price 검증 후 변환 (wei → ether 단위)
        const swappedValue = Math.abs(validSwapData.userAmount0delta / validSwapData.userAmount1delta);
        const formattedSwappedPrice =
          !isNaN(swappedValue) && swappedValue > 0
            ? swappedValue.toFixed(18) : "No Data";

        // ✅ 필요한 값 설정
        setSwappedPrice(formattedSwappedPrice);
        setOraclePrice(formattedPrice);
        setFee(validSwapData["for-expected-current-fee"]);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeltaData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="w-full h-full">
        <Loading containerClassName="h-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      {swappedPrice !== null && oraclePrice !== null && (
        <DynamicTokenPriceResult
          swappedPrice={swappedPrice}
          fee={fee || 0}
          oraclePrice={oraclePrice}
        />
      )}
    </>
  );
}
