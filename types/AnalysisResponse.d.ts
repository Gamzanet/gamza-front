interface DynamicAnalysisResponseType {
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

interface PoolKeyType {
  hooks: Address;
  currency0: Address;
  currency1: Address;
  fee: number;
  tickSpacing: number;
}

type Address = string;

export interface Data {
  with_6909: With6909; // includes 6909, donate not supported
  with_20: With20; // 20 to 20
}

export interface With20 {
  [key: MethodStringType]: Method | Method[];

  swap: Swap[];
  addLiquidity: AddLiquidity;
  donate: Donate;
  removeLiquidity: RemoveLiquidity;
}

export interface With6909 {
  [key: MethodStringType]: Method | Method[];

  swap: Swap[];
  addLiquidity: AddLiquidity; // 6909 in
  removeLiquidity: RemoveLiquidity; // 6909 out
}

type MethodStringType = "swap" | "addLiquidity" | "removeLiquidity" | "donate";
type Method = AddLiquidity | RemoveLiquidity | Swap | Donate;

interface AddLiquidity extends BaseData, Erc20Data, Erc6909Data {}
interface RemoveLiquidity extends BaseData, Erc20Data, Erc6909Data {}
interface Donate extends BaseData, Erc20Data {}
export interface Swap extends BaseData, Erc20Data, Erc6909Data {
  "for-expected-current-price"?: string;
  "for-expected-current-liquidity"?: string;
  "for-expected-amount0-specified"?: string;
  "for-expected-current-fee"?: string;
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

export interface BaseData {
  amount0delta: string;
  amount1delta: string;
}

export interface Erc20Data {
  managerAmount0delta: string;
  managerAmount1delta: string;
  hookAmount0delta: string;
  hookAmount1delta: string;
  userAmount0delta: string;
  userAmount1delta: string;
}

export interface Erc6909Data {
  hook6909Amount0delta: string;
  hook6909Amount1delta: string;
  user6909Amount0delta: string;
  user6909Amount1delta: string;
}

export interface DynamicAnalysisGasCompareResponseType {
  timeHash: string;
  poolKey: PoolKeyType;
  mode: number;
  result: GasCompareResponse;
  idx: number;
  time: number;
}

export interface GasCompareResponse {
  [key: string]: string;

  name: string;
  "hook-Swap-tokenPrice": string;
  "hook-Swap-protocolFee": string;
  "hook-Swap-lpFee": string;
  "hook-Swap-balance-amount0": string;
  "hook-Swap-balance-amount1": string;
  "hook-swap-gas": string;
  "hook-swap-gasPrice": string;
  "hook-swap-totalGas": string;
  "no-hook-Swap-tokenPrice": string;
  "no-hook-Swap-protocolFee": string;
  "no-hook-Swap-lpFee": string;
  "no-hook-Swap-balance-amount0": string;
  "no-hook-Swap-balance-amount1": string;
  "no-hook-swap-gas": string;
  "no-hook-swap-gasPrice": string;
  "no-hook-swap-totalGas": string;
}
