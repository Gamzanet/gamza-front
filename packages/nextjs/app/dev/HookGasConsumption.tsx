import { FC } from "react";
import { HookGasConsumption } from "~~/types/gamza/AnalysisResult";

const HookGasConsumptionScope: FC<{ props: HookGasConsumption }> = ({ props }) => {
  return (
    <div className="bg-error">
      <h1>HookGasConsumptionScope</h1>
      <div className="flex flex-col space-y-4">
        <div>Swap: {props.swap}</div>
        <div>Add Liquidity: {props.addLiquidity}</div>
        <div>Remove Liquidity: {props.removeLiquidity}</div>
        <div>Donate: {props.donate}</div>
      </div>
    </div>
  );
};

export default HookGasConsumptionScope;
