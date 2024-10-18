import ExpectResponse from "./ExpectResponse";
import HookGasConsumptionScope from "./HookGasConsumption";
import TestLogsScope from "./TestLogs";
import TokenPriceDifferenceScope from "./TokenPriceDifference";
import type { NextPage } from "next";

const Page: NextPage = async () => {
  const title = "Analysis Result";
  const response: MockResponse = { body: ExpectResponse };
  const data = response.body.data;

  return (
    <>
      <div className="text-center mx-2">
        <h1 className="text-5xl font-bold">{title}</h1>
      </div>
      <main className="hero bg-base-200 min-h-screen">
        <div className="hero-content lg:flex-col">
          <div className="flex">
            <HookGasConsumptionScope props={data.hookGasConsumption} />
            <TokenPriceDifferenceScope props={data.tokenPriceDifference} />
          </div>
          <div className="card bg-base-100 w-full max-w-lg shrink-0 shadow-2xl">
            <TestLogsScope props={data.testLogs} />
          </div>
        </div>
      </main>
    </>
  );
};
export default Page;

type MockResponse = {
  body: typeof ExpectResponse;
};
