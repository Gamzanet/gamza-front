import { PoolKeyType } from "@/types/Property";

// @see https://www.notion.so/entropy1110/LPFeeTakingHook-12fec224c993805cb204d89989b22371?pvs=4#b489466a35f847c994c433d4798419d4

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
  revertAt: any;
  name: string;
  result: string;
  trace: string;
}
