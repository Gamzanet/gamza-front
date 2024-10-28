"use client";

import { useEffect, useState } from "react";
import { Calc } from "~~/types/gamza/AnalysisRenewalResult";

export default function TokenPriceDiffScope({
  props,
}: {
  props: {
    calc_20: Calc;
    calc_6909: Calc;
    calc_20_ok: Calc;
    calc_6909_ok: Calc;
  };
}) {
  const [assumePriceSame, setAssumePriceSame] = useState(false);
  return (
    <>
      <button onClick={() => setAssumePriceSame(!assumePriceSame)}>Assume Price Same </button>

      <header className="text-center text-3xl font-bold">TokenPriceDifference with ERC20</header>
      <TokenPriceDifference props={assumePriceSame ? props.calc_20_ok : props.calc_20} />

      <header className="text-center text-3xl font-bold">TokenPriceDifference with ERC6909</header>
      <TokenPriceDifference props={props.calc_6909} />
    </>
  );
}

const TokenPriceDifference: React.FC<{ props: Calc }> = ({ props }) => {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const currentDate = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    setNow(currentDate);
  }, []);

  const actual = props.actual_price;
  const expect = props.price_expected;

  const diff = actual - expect;
  const diffEmoji = diff > 0 ? "↗︎" : "↘︎";
  const diffPercent = ((actual - expect) / expect) * 100;
  const is5percent = Math.abs(diffPercent) > 5;

  return (
    <div className="flex flex-col w-full">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">by Oracle</div>
          <div className="stat-value">{expect}</div>
          <div className="stat-desc">{now}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">by Pool</div>
          <div className={`stat-value ${is5percent ? "text-red-500" : ""}`}>{actual}</div>
          <div className="stat-desc">{`${diffEmoji} ${diff} (${diffPercent}%)`}</div>
        </div>
      </div>
    </div>
  );
};
