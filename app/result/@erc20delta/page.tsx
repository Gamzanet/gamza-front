import { DynamicTokenPriceResult } from "@/components/result/dynamic";

export default function ERC6909DeltaBurnResultPage() {
  return (
    <DynamicTokenPriceResult
      realPrice={1.4}
      expectedPrice={1.4}
      oraclePrice={2.1}
    />
  );
}
