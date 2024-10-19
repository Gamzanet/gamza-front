export interface AnalysisResult {
  hookGasConsumption: HookGasConsumption;
  tokenPriceDifference: TokenPriceDifference;
  testLogs: TestLog[];
  // advancedAnalysis: AdvancedAnalysis | undefined;
}

export interface HookGasConsumption {
  swap: number;
  addLiquidity: number;
  removeLiquidity: number;
  donate: number;
}

export interface TokenPriceDifference {
  expect: number;
  actual: number;
}

export interface TestLog {
  type: string;
  title: string;
  pass: boolean;
  summary: string;
  description: string;
  trace: string;
}

// TODO: Implement AdvancedAnalysis
// export interface AdvancedAnalysis {}
