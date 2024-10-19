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
    <div className="hero bg-base-200 min-h-screen">
      <div className="flex flex-col">
        <header className="text-center text-5xl font-bold">{title}</header>
        <main className="hero-content lg:flex-col">
          <section className="flex">
            <HookGasConsumptionScope props={data.hookGasConsumption} />
            <TokenPriceDifferenceScope props={data.tokenPriceDifference} />
          </section>
          <section className="card bg-base-100 w-full max-w-lg shrink-0 shadow-2xl">
            <TestLogsScope props={data.testLogs} />
          </section>
        </main>
      </div>
    </div>
  );
};

type MockResponse = {
  body: typeof ExpectResponse;
};

export default Page;
