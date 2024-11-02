import { PoolKeyType } from "@/types/Property";

// @see https://www.notion.so/entropy1110/for-loop-hook-271dcc1c8a994536bd8bcf6213e9c98c?pvs=4#ef3b17c9d392458b97fbba1e044d37fd

export interface Root {
  task_id: string;
  status: string;
  result: Result;
}

export interface Result {
  timeHash: string;
  poolKey: PoolKeyType;
  mode: number;
  result: Result2;
  idx: number;
  time: number;
}

export interface Result2 {
  name: string;
  PASS: number;
  FAIL: number;
  msg: string[];
  gasPrice: string;
  hook: Hook;
  noHook: NoHook;
  len: number;
}

export interface Hook {
  add: Add;
  remove: Remove;
  donate: Donate;
  swap: Swap;
}

export interface Add {
  gas: string;
  totalGas: string;
}

export interface Remove {
  gas: string;
  totalGas: string;
}

export interface Donate {
  gas: string;
  totalGas: string;
}

export interface Swap {
  gas: string;
  totalGas: string;
  priceData: PriceData;
}

export interface PriceData {
  lpFee: string;
  protocolFee: string;
  tokenPrice: string;
}

export interface NoHook {
  add: Add2;
  remove: Remove2;
  donate: Donate2;
  swap: Swap2;
}

export interface Add2 {
  gas: string;
  totalGas: string;
}

export interface Remove2 {
  gas: string;
  totalGas: string;
}

export interface Donate2 {
  gas: string;
  totalGas: string;
}

export interface Swap2 {
  gas: string;
  totalGas: string;
  priceData: PriceData2;
}

export interface PriceData2 {
  lpFee: string;
  protocolFee: string;
  tokenPrice: string;
}
