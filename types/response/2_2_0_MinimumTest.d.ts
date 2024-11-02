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
  trace?: string;
  OOG?: number;
}
