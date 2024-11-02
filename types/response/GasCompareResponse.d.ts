// response/gas_compare.json

export interface Root {
  task_id: string;
  status: string;
  result: Result;
}

export interface Result {
  timeHash: string;
  poolkey: Poolkey;
  mode: number;
  result: Result2;
  idx: number;
  time: number;
}

export interface Poolkey {
  hooks: string;
  currency0: string;
  currency1: string;
  fee: string;
  tickSpacing: string;
}

export interface Result2 {
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
