import ExpectResponse from "./ExpectResponse";
import HookGasConsumptionScope from "./HookGasConsumption";
import TestLogsScope from "./TestLogs";
import TokenPriceDifferenceScope from "./TokenPriceDifference";
import type { NextPage } from "next";

const Page: NextPage = async () => {
  const title = "Analysis Result";
  const response: MockResponse = { body: ExpectResponse };
  const data = response.body.data;

  // TODO: clean-up container structure
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="flex flex-col">
        <header className="text-center text-5xl font-bold">{title}</header>
        <main className="hero-content lg:flex-col">
          <section className="grid grid-cols-2 justify-items-end">
            <div> </div>
            <TokenPriceDifferenceScope props={data.tokenPriceDifference} />
            <HookGasConsumptionScope props={data.hookGasConsumption} />
            <section className="card bg-base-100 w-full max-w-xl shadow-2xl">
              <TestLogsScope props={data.testLogs} />
            </section>
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
