import { PoolKeyType } from "@/types/Property";
export interface PoolManagerTestRoot {
  task_id: string;
  status: string;
  result: Result;
}

export interface Result {
  timeHash: string;
  poolkey: PoolKeyType;
  mode: number;
  result: Result2;
  idx: number;
  time: number;
}

export interface Result2 {
  testList: TestList[];
  PASS: number;
  FAIL: number;
  name: string;
}

export interface TestList {
  status: string;
  statusCode: number;
  name: string;
  msg: string;
  description?: string;
}
