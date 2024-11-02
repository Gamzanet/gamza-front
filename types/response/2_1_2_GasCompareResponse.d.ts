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
  currency0: string;
  currency1: string;
  fee: number;
  tickSpacing: number;
  hooks: string;
}

export interface Result2 {
  name: string;
  msg: string[];
  "hook-add-gas": string;
  "no-hook-add-gas": string;
  "hook-doante-gas": string;
  "no-hook-donate-gas": string;
  "hook-remove-gas": string;
  "no-hook-remove-gas": string;
  "hook-Swap-protocolFee": string;
  "hook-Swap-lpFee": string;
  "hook-Swap-balance-amount0": string;
  "hook-Swap-balance-amount1": string;
  "hook-swap-gas": string;
  "no-hook-Swap-protocolFee": string;
  "no-hook-Swap-lpFee": string;
  "no-hook-Swap-balance-amount0": string;
  "no-hook-Swap-balance-amount1": string;
  "no-hook-swap-gas": string;
}