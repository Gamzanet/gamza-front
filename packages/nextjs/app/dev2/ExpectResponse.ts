import {
  Address,
  AnalysisRenewalResponse,
  Calc,
  Data,
  PoolKey,
  RenewalResult,
  baz_result,
  boo_20,
  foo_6909,
} from "~~/types/gamza/AnalysisRenewalResult";

const foo_6900_gen = (): foo_6909 => ({
  hook6909Amount0delta: Math.random(),
  hook6909Amount1delta: Math.random(),
  user6909Amount0delta: Math.random(),
  user6909Amount1delta: Math.random(),
});

const boo_20_gen = (): boo_20 => ({
  amount0delta: Math.random(),
  amount1delta: Math.random(),
  mangerAmount0delta: Math.random(),
  mangerAmount1delta: Math.random(),
  hookAmount0delta: Math.random(),
  hookAmount1delta: Math.random(),
  userAmount0delta: Math.random(),
  userAmount1delta: Math.random(),
});

const Calc_gen = (): Calc => ({
  price_expected: Math.random(),
  sqrtP_expected: Math.random(),
  amount_in: Math.random(),
  amount_out: Math.random(),
  actual_price: Math.random(),
});

const baz_result_gen = (): baz_result => ({
  swap: {
    ...boo_20_gen(),
    ...foo_6900_gen(),
    is_burn: Math.random() > 0.5,
    is_exactIn: Math.random() > 0.5,
    calc: Calc_gen(),
  },
  addLiquidity: { ...boo_20_gen(), ...foo_6900_gen() },
  removeLiquidity: { ...boo_20_gen(), ...foo_6900_gen() },
  donate: { ...boo_20_gen() },
});

// type Address = string; 20 bytes
const Address_gen = (): Address => `0x${Math.random().toString(16).slice(2, 42)}`;

/**
 * @returns interface PoolKey {
  hooks: Address;
  currency0: Address;
  currency1: Address;
  fee: number;
  tickSpacing: number;
}
 */
const PoolKey_gen = (): PoolKey => ({
  hooks: Address_gen(),
  currency0: Address_gen(),
  currency1: Address_gen(),
  fee: Math.random(),
  tickSpacing: Math.random(),
});

/**
 * @returns interface Data {
  with_6909: baz_result;
  with_20: baz_result;
}
 */
const Data_gen = (): Data => ({
  with_6909: baz_result_gen(),
  with_20: baz_result_gen(),
});

/**
 * @returns interface RenewalResult {
  poolKey: PoolKey;
  data: Data;
}
 */
const RenewalResult_gen = (): RenewalResult => ({
  timeHash: Math.random().toString(36),
  poolKey: PoolKey_gen(),
  mode: Math.random(),
  idx: Math.random(),
  time: Math.random(),
  name: Math.random().toString(36),
  data: Data_gen(),
  price: Math.random(),
});

/**
 * @returns interface AnalysisRenewalResponse {
  task_id: string;
  status: string;
  result: RenewalResult;
}
}
 */
const AnalysisRenewalResponse_gen = async (): Promise<AnalysisRenewalResponse> => ({
  task_id: Math.random().toString(36),
  status: Math.random().toString(36),
  result: RenewalResult_gen(),
});

export default AnalysisRenewalResponse_gen;
