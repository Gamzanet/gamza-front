// response/token_price_compare.json

export interface Root {
  task_id: string;
  status: string;
  result: Result;
}

export interface Result {
  name: string;
  mode: number;
  idx: number;
  time: number;
  poolKey: PoolKey;
  data: Data;
  price: number;
}

export interface PoolKey {
  hooks: string;
  currency0: string;
  currency1: string;
  fee: number;
  tickSpacing: number;
}

export interface Data {
  with_6909: With6909;
  with_20: With20;
}

export interface With6909 {
  swap: Swap[];
  addLiquidity: AddLiquidity;
  removeLiquidity: RemoveLiquidity;
}

export interface Swap {
  "for-expected-current-price": string;
  "for-expected-current-liquidity": string;
  "for-expected-amount0-specified": string;
  "for-expected-current-fee": string;
  amount0delta: string;
  amount1delta: string;
  managerAmount0delta: string;
  managerAmount1delta: string;
  hookAmount0delta: string;
  hookAmount1delta: string;
  userAmount0delta: string;
  userAmount1delta: string;
  hook6909Amount0delta: string;
  hook6909Amount1delta: string;
  user6909Amount0delta: string;
  user6909Amount1delta: string;
  calc: Calc;
  is_burn: boolean;
  is_exactIn: boolean;
}

export interface Calc {
  price_expected: number;
  sqrtP_expected: number;
  amount_in: number;
  amount_out: number;
}

export interface AddLiquidity {
  amount0delta: string;
  amount1delta: string;
  managerAmount0delta: string;
  managerAmount1delta: string;
  hookAmount0delta: string;
  hookAmount1delta: string;
  userAmount0delta: string;
  userAmount1delta: string;
  hook6909Amount0delta: string;
  hook6909Amount1delta: string;
  user6909Amount0delta: string;
  user6909Amount1delta: string;
}

export interface RemoveLiquidity {
  amount0delta: string;
  amount1delta: string;
  managerAmount0delta: string;
  managerAmount1delta: string;
  hookAmount0delta: string;
  hookAmount1delta: string;
  userAmount0delta: string;
  userAmount1delta: string;
  hook6909Amount0delta: string;
  hook6909Amount1delta: string;
  user6909Amount0delta: string;
  user6909Amount1delta: string;
}

export interface With20 {
  swap: Swap2[];
  addLiquidity: AddLiquidity2;
  donate: Donate;
  removeLiquidity: RemoveLiquidity2;
}

export interface Swap2 {
  "for-expected-current-price": string;
  "for-expected-current-liquidity": string;
  "for-expected-amount0-specified": string;
  "for-expected-current-fee": string;
  amount0delta: string;
  amount1delta: string;
  managerAmount0delta: string;
  managerAmount1delta: string;
  hookAmount0delta: string;
  hookAmount1delta: string;
  userAmount0delta: string;
  userAmount1delta: string;
  hook6909Amount0delta: string;
  hook6909Amount1delta: string;
  user6909Amount0delta: string;
  user6909Amount1delta: string;
  calc: Calc2;
  is_burn: boolean;
  is_exactIn: boolean;
}

export interface Calc2 {
  price_expected: number;
  sqrtP_expected: number;
  amount_in: number;
  amount_out: number;
}

export interface AddLiquidity2 {
  amount0delta: string;
  amount1delta: string;
  managerAmount0delta: string;
  managerAmount1delta: string;
  hookAmount0delta: string;
  hookAmount1delta: string;
  userAmount0delta: string;
  userAmount1delta: string;
  hook6909Amount0delta: string;
  hook6909Amount1delta: string;
  user6909Amount0delta: string;
  user6909Amount1delta: string;
}

export interface Donate {
  amount0delta: string;
  amount1delta: string;
  managerAmount0delta: string;
  managerAmount1delta: string;
  hookAmount0delta: string;
  hookAmount1delta: string;
  userAmount0delta: string;
  userAmount1delta: string;
  hook6909Amount0delta: string;
  hook6909Amount1delta: string;
  user6909Amount0delta: string;
  user6909Amount1delta: string;
}

export interface RemoveLiquidity2 {
  amount0delta: string;
  amount1delta: string;
  managerAmount0delta: string;
  managerAmount1delta: string;
  hookAmount0delta: string;
  hookAmount1delta: string;
  userAmount0delta: string;
  userAmount1delta: string;
  hook6909Amount0delta: string;
  hook6909Amount1delta: string;
  user6909Amount0delta: string;
  user6909Amount1delta: string;
}
