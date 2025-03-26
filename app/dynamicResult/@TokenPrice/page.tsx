"use client";

import { useSSE } from "@/components/request/SSEManager";
import { DynamicTokenPriceResult } from "@/components/result/dynamic";
import Loading from "@/components/ui/loading";

export default function TokenPrice() {
  const { taskResults, error } = useSSE();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const data = taskResults["dynamic-2-9"];
  if (!data) {
    return (
      <div className="min-w-[500px] min-h-[330px]">
        <Loading containerClassName="h-full" />
      </div>
    );
  }

  const resultData = data?.result?.data?.with_20?.swap?.find(
    (item: any) => !item.is_burn && item.is_exactIn,
  );

  if (!resultData) {
    return <div className="text-red-500">No matching swap data found</div>;
  }

  const price = Number(data.result?.price);
  const formattedPrice =
    !isNaN(price) && price > 0 ? price.toFixed(18) : "No Data";

  const swappedValue = Math.abs(
    resultData.userAmount0delta / resultData.userAmount1delta,
  );
  const formattedSwappedPrice =
    !isNaN(swappedValue) && swappedValue > 0
      ? swappedValue.toFixed(18)
      : "No Data";

  return (
    <DynamicTokenPriceResult
      swappedPrice={formattedSwappedPrice}
      fee={resultData["for-expected-current-fee"] || 0}
      oraclePrice={formattedPrice}
    />
  );
}
