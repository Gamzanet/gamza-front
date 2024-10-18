import ExpectResponse from "./ExpectResponse";
import type { NextPage } from "next";

const Page: NextPage = async () => {
  const title = "Analysis Result";
  const response: MockResponse = { body: ExpectResponse };
  const data = JSON.stringify(response);

  return (
    <main className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left mx-2">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="py-6">{data}</p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl"></div>
      </div>
    </main>
  );
};

export default Page;

type MockResponse = {
  body: typeof ExpectResponse;
};
