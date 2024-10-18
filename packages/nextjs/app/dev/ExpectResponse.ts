import { AnalysisResult } from "~~/types/gamza/AnalysisResult";

const ExpectResponse: { data: AnalysisResult } = {
  data: {
    hookGasConsumption: {
      swap: 1,
      addLiquidity: 2,
      removeLiquidity: 3,
      donate: 4,
    },
    TokenPriceDifference: {
      expect: 1,
      actual: 2,
    },
    testLogs: [
      {
        type: "warning",
        title: "test_addLiquidity_secondAdditionSameRange",
        pass: false,
        summary: "Fail to add liquidity twice within same range",
        description: "description",
        trace: "trace",
      },
    ],
  },
};

export default ExpectResponse;
