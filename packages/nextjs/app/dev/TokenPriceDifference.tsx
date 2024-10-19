import { FC } from "react";
import { TokenPriceDifference } from "~~/types/gamza/AnalysisResult";

const TokenPriceDifferenceScope: FC<{ props: TokenPriceDifference }> = ({ props }) => {
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  const diff = props.actual - props.expect;
  const diffEmoji = diff > 0 ? "↗︎" : "↘︎";
  const diffPercent = ((props.actual - props.expect) / props.expect) * 100;

  return (
    <div className="flex flex-col w-full">
      <header className="text-center text-3xl font-bold">TokenPriceDifference</header>
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
          <div className="stat-value">{props.expect}</div>
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
          <div className="stat-value">{props.actual}</div>
          <div className="stat-desc">{`${diffEmoji} ${diff} (${diffPercent}%)`}</div>
        </div>
      </div>
    </div>
  );
};

export default TokenPriceDifferenceScope;
