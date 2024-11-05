import { component2IntegratedResponse } from "@/utils/Constants";

export default function StaticAnalysisResultPage() {
  const code = component2IntegratedResponse[0].result.result.failList[0].trace;

  return <nav>{JSON.stringify(code)}</nav>;
}
// @remind LeftSide - hook contract code
