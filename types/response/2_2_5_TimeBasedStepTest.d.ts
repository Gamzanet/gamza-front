import { PoolKeyType } from "@/types/Property";
export interface TimeBasedStepTestRoot {
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
  revertAt: string;
  name: string;
  trace: string;
  result: string;
}
