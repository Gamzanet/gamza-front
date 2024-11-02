import {
  DynamicERC20DeltaDifferenceResult,
  DynamicTransactionGasResult,
  DynamicPoolKeyResult,
  DynamicTokenPriceResult,
} from "@/components/result/dynamic";

import { rawResponse } from "./response";
import {
  toERC20DeltaDifferenceProps,
  toTransactionGasProps,
  toTokenPriceProps,
} from "@/utils/ResponseMapper";

// toTokenPriceProps,
// toTransactionPriceProps,
// toERC20DeltaDifferenceProps,
// toERC6909DeltaDifferenceProps,

export default function Page() {
  return (
    <div className='flex flex-col'>
      <DynamicERC20DeltaDifferenceResult
        props={toERC20DeltaDifferenceProps(rawResponse)}
      />
      <DynamicTransactionGasResult
        data={toTransactionGasProps(rawResponse)}
      />
      <DynamicPoolKeyResult data={rawResponse.result.poolKey} />
      <DynamicTokenPriceResult data={toTokenPriceProps(rawResponse)} />
    </div>
  );
}
