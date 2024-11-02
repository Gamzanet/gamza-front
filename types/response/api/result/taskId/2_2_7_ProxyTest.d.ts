import { PoolKeyType } from "@/types/Property";

// Failed case
// @see https://www.notion.so/entropy1110/proxy-hook-c041f4d7934745fe9637ed6ba431167b?pvs=4#c07b768af35e46c491748cfd0755bd92

// Passed case
// @see https://www.notion.so/entropy1110/FeeTakingHook-12fec224c99380edaabef8b685ada29c?pvs=4#746aa5a9ba984456b1fc8ecb465d202c

export interface Root {
  task_id: string;
  status: string;
  result: Result;
}

export interface Result {
  timeHash: string;
  poolKey: PoolKey;
  mode: number;
  result: Result2[];
  idx: number;
  time: number;
}

export interface PoolKey {
  hooks: string;
  currency0: string;
  currency1: string;
  fee: number;
  tickSpacing: number;
}

export interface Result2 {
  testList: TestList[];
  failList?: FailList[];
  PASS: number;
  FAIL: number;
  name: string;
}

export interface TestList {
  name: string;
  msg: string;
  status: string;
  statusCode: number;
  description?: string;
  impact?: string;
  trace?: string;
}

export interface FailList {
  name: string;
  msg: string;
  status: string;
  statusCode: number;
  description: string;
  impact: string;
  trace: string;
}
