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
