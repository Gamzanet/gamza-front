"use client";

import React, { useState } from "react";
import { Data, boo_20, foo_6909 } from "~~/types/gamza/AnalysisRenewalResult";

const HookDeltaDiffScope: React.FC<{ props: Data }> = ({ props }) => {
  const { with_20, with_6909 } = props;
  const [method, setMethod] = useState("swap");

  return (
    <div className="flex flex-col text-center w-full">
      <MethodSelector setMethod={setMethod} />
      <header className="text-3xl font-bold">with_20</header>
      <Boo20Delta props={with_20[method] as boo_20} />
      {method !== "donate" && (
        <>
          <header className="text-3xl font-bold">with_6909</header>
          <Foo6909Delta props={with_6909[method] as foo_6909} />
        </>
      )}
    </div>
  );
};

export default HookDeltaDiffScope;

const MethodSelector: React.FC<{ setMethod: (method: string) => void }> = ({ setMethod }) => {
  return (
    <div className="flex justify-center space-x-4">
      <button onClick={() => setMethod("swap")}>swap</button>
      <button onClick={() => setMethod("addLiquidity")}>addLiquidity</button>
      <button onClick={() => setMethod("removeLiquidity")}>removeLiquidity</button>
      <button onClick={() => setMethod("donate")}>donate</button>
    </div>
  );
};

const Boo20Delta: React.FC<{ props: boo_20 }> = ({ props }: { props: boo_20 }) => {
  return (
    <div>
      <p>amount0delta: {props.amount0delta}</p>
      <p>amount1delta: {props.amount1delta}</p>
      <p>mangerAmount0delta: {props.mangerAmount0delta}</p>
      <p>mangerAmount1delta: {props.mangerAmount1delta}</p>
      <p>hookAmount0delta: {props.hookAmount0delta}</p>
      <p>hookAmount1delta: {props.hookAmount1delta}</p>
      <p>userAmount0delta: {props.userAmount0delta}</p>
      <p>userAmount1delta: {props.userAmount1delta}</p>
    </div>
  );
};

const Foo6909Delta: React.FC<{ props: foo_6909 }> = ({ props }: { props: foo_6909 }) => {
  return (
    <div>
      <p>hook6909Amount0delta: {props.hook6909Amount0delta}</p>
      <p>hook6909Amount1delta: {props.hook6909Amount1delta}</p>
      <p>user6909Amount0delta: {props.user6909Amount0delta}</p>
      <p>user6909Amount1delta: {props.user6909Amount1delta}</p>
    </div>
  );
};
