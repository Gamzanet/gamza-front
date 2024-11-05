import { PoolKeyType } from "@/types/Property";
import {
  FileScope,
  ContractScope,
  Variable,
  Parameter,
  FunctionScope,
} from "./CommonTypes";

export interface Root {
  task_id: string;
  status: string;
  result: Result;
}

export interface Result {
  timeHash: string;
  hooks: string;
  result: Result2;
  slither: Slither;
  mode: number;
  idx: number;
  poolKey: PoolKeyType;
}

export interface Result2 {
  info: Info;
  threats: Threat[];
}

export interface Info {
  chain_name: string;
  evm_version: string;
  data: FileScope;
}

export interface Threat {
  detector: string;
  data: Data2;
}

export interface Data2 {
  description: string;
  impact: string;
}

export interface Slither {
  detector: Detector;
  printer: Printer;
}

export interface Detector {
  success: boolean;
  error: any;
  detector: string;
  data: Daum[];
}

export interface Daum {
  description: string;
  markdown: string;
  check: string;
  impact: string;
  confidence: string;
}

export interface Printer {
  contract: string;
  success: boolean;
  error: any;
  data: Daum2[];
}

export interface Daum2 {
  printer: string;
  fields_names: string[];
  result: Result3[];
}

export interface Result3 {
  Function: string;
  "require or assert"?: string;
  Modifiers?: string[];
  "State variables written"?: string;
  "Conditions on msg.sender"?: string;
}
