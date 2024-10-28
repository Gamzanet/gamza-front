import BugAnt from "./BugAnt";
import type { NextPage } from "next";
import UserInputForm from "~~/components/gamza/legacy/UserInputForm";

const Home: NextPage = () => {
  const title = "Gamza Analyzer";
  const description =
    "Enter the PoolKey, validate its authenticity, and identify potential risks such as insufficient liquidity, unexpected behavior, or known vulnerabilities before proceeding.";
  return (
    <main className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left mx-2">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="py-6">{description}</p>
          <BugAnt />
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <UserInputForm />
        </div>
      </div>
    </main>
  );
};

export default Home;
