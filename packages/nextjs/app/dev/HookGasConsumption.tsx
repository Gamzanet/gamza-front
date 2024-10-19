import { FC } from "react";
import { HookGasConsumption } from "~~/types/gamza/AnalysisResult";

const HookGasConsumptionScope: FC<{ props: HookGasConsumption }> = ({ props }) => {
  return (
    <div className="stats stats-vertical shadow w-min">
      <div className="stat">
        <div className="stat-title">swap</div>
        <div className="stat-value">{props.swap}</div>
      </div>

      <div className="stat">
        <div className="stat-title">addLiquidity</div>
        <div className="stat-value">{props.addLiquidity}</div>
      </div>

      <div className="stat">
        <div className="stat-title">removeLiquidity</div>
        <div className="stat-value">{props.removeLiquidity}</div>
      </div>

      <div className="stat">
        <div className="stat-title">donate</div>
        <div className="stat-value">{props.donate}</div>
      </div>
    </div>
  );
};

export default HookGasConsumptionScope;
