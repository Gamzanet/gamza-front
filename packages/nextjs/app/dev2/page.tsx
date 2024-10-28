"use server";

import AnalysisRenewalResponse_gen from "./ExpectResponse";
import HookDeltaDiffScope from "./HookDeltaDiff";
import TokenPriceDiffScope from "./TokenPriceDiff";
import { AnalysisRenewalResponse, Data } from "~~/types/gamza/AnalysisRenewalResult";

type MockResponse = {
  body: AnalysisRenewalResponse;
};

export default async function Page() {
  const response = {
    body: await AnalysisRenewalResponse_gen(),
  } as MockResponse;

  const data: Data = response.body.result.data;
  const [calc_6909, calc_20] = [data.with_6909.swap.calc, data.with_20.swap.calc];
  const [calc_6909_ok, calc_20_ok] = [
    {
      ...calc_6909,
      actual_price: calc_6909.price_expected,
    },
    {
      ...calc_20,
      actual_price: calc_20.price_expected,
    },
  ];

  // TODO: clean-up container structure
  return (
    <div className="flex flex-col bg-base-200 min-h-screen space-y-4 p-8">
      <header className="text-center text-3xl font-bold">TokenPriceDifference</header>
      <TokenPriceDiffScope props={{ calc_20, calc_6909, calc_20_ok, calc_6909_ok }} />

      <header className="text-center text-3xl font-bold">HookDeltaDiff</header>
      <HookDeltaDiffScope props={data} />

      {/* 
        <section className="card bg-base-100 w-full max-w-xl shadow-2xl">
          <TestLogsScope props={data.testLogs} />
        </section> */}
    </div>
  );
}
