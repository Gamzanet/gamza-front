import { PoolKeyType } from "@/types/Property";

export interface TokenPriceCompareRoot {
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
  msg: string[];
  name: string;
  data: Daum[];
  price: number;
}

export interface Daum {
  name: string;
  value: string;
}
