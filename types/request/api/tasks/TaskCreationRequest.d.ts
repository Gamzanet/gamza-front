// @see https://github.com/Gamzanet/fastAPI/blob/5badeda4aa0226c809ef0cd3a0142f9f96164384/src/run.py#L119

import { Address, PoolKeyType } from "@/types/Property";

export default interface TaskCreationRequest {
  data: {
    Poolkey?: PoolKeyType;
    source?: string;
    mode: number; // 1: all | 2: dynamic | 3: static | 4: source-only
    deployer?: Address;
  };
}

export interface TaskCreationSourceOnlyRequest {
  data: {
    source: string;
    mode: 4;
    deployer?: Address;
  };
}

export interface TaskCreationPoolKeyRequest {
  data: {
    Poolkey: PoolKeyType;
    mode: 1 | 2 | 3;
    deployer?: Address;
  };
}

export interface TaskCreationStaticRequest {
  data: {
    Poolkey: PoolKeyType;
    mode: 3;
    deployer?: Address;
  };
}

export interface TaskCreationDynamicRequest {
  data: {
    Poolkey: PoolKeyType;
    mode: 2;
    deployer?: Address;
  };
}

export interface TaskCreationAllRequest {
  data: {
    Poolkey: PoolKeyType;
    mode: 1;
    deployer?: Address;
  };
}
