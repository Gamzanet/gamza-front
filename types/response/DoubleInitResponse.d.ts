// response/double_init.json

export interface Root {
  task_id: string;
  status: string;
  result: RootResult;
}

export interface RootResult {
  timeHash: string;
  poolKey: PoolKey;
  mode: number;
  result: TestResult;
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

export interface TestResult {
  name: string;
  PASS: number;
  FAIL: number;
  status: number;
  data: any[];
}
