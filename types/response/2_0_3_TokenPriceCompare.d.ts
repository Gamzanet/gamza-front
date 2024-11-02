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
  msg: string[];
  name: string;
  data: Daum[];
  price: number;
}

export interface Daum {
  name: string;
  value: string;
}
