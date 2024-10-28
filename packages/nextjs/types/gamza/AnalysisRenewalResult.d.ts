interface AnalysisRenewalResponse {
  task_id: string;
  status: string;
  result: RenewalResult;
}

interface RenewalResult {
  timeHash: string;
  poolKey: PoolKey;
  mode: number;
  idx: number;
  time: number;

  name: string;
  data: Data;
  price: number;
}

interface PoolKey {
  hooks: Address;
  currency0: Address;
  currency1: Address;
  fee: number;
  tickSpacing: number;
}

type Address = string;

//

interface Data {
  with_6909: baz_result;
  with_20: baz_result;
}

export interface baz_result {
  [key: string]: any;

  swap: Swap;
  addLiquidity: ModifyLiquidity;
  removeLiquidity: ModifyLiquidity;
  donate?: Donate;
}

interface Swap extends boo_20, foo_6909 {
  is_burn: boolean;
  is_exactIn: boolean;
  calc: Calc;
}

interface Calc {
  price_expected: number;
  sqrtP_expected: number;
  amount_in: number;
  amount_out: number;
  actual_price: number;
}

interface ModifyLiquidity extends boo_20, foo_6909 {}

type Donate = boo_20;

//

interface foo_6909 {
  hook6909Amount0delta: number;
  hook6909Amount1delta: number;
  user6909Amount0delta: number;
  user6909Amount1delta: number;
}

interface boo_20 {
  amount0delta: number;
  amount1delta: number;
  mangerAmount0delta: number;
  mangerAmount1delta: number;
  hookAmount0delta: number;
  hookAmount1delta: number;
  userAmount0delta: number;
  userAmount1delta: number;
}

export {
  AnalysisRenewalResponse,
  RenewalResult,
  PoolKey,
  Address,
  Data,
  baz_result,
  Swap,
  ModifyLiquidity,
  Donate,
  Calc,
  foo_6909,
  boo_20,
};
