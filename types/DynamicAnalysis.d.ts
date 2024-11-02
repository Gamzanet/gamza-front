interface TokenPriceProps {
  realPrice: number;
  expectedPrice: number;
  oraclePrice: number;
}

interface TransactionPriceProps {
  [key: string]: { withHook: number; withoutHook: number };

  swap: { withHook: number; withoutHook: number };
  removeLiquidity: { withHook: number; withoutHook: number };
  addLiquidity: { withHook: number; withoutHook: number };
  donate: { withHook: number; withoutHook: number };
}

interface DeltaDifferenceType {
  [key: string]: { amount0: number; amount1: number };

  user: { amount0: number; amount1: number };
  hook: { amount0: number; amount1: number };
  manager?: { amount0: number; amount1: number };
}

interface ERCDeltaDifferenceProps {
  [key: string]: DeltaDifferenceType;

  addLiquidity: DeltaDifferenceType;
  removeLiquidity: DeltaDifferenceType;
  swap: DeltaDifferenceType;
  donate?: DeltaDifferenceType;
}
