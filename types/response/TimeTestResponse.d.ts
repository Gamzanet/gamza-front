// response/time_test.json

export interface Root {
  task_id: string;
  status: string;
  result: Result;
}

export interface Result {
  timeHash: string;
  poolKey: PoolKey;
  mode: number;
  result: Result2;
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
  failList: FailList[];
  PASS: number;
  FAIL: number;
  name: string;
}

export interface TestList {
  name: string;
  msg: string;
  status: string;
  statusCode: number;
  trace?: string;
  impact?: string;
  description?: string;
}

export interface FailList {
  name: string;
  msg: string;
  status: string;
  statusCode: number;
  trace: string;
  impact: string;
  description: string;
}
