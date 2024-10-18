import { FC } from "react";
import { TokenPriceDifference } from "~~/types/gamza/AnalysisResult";

const TokenPriceDifferenceScope: FC<{ props: TokenPriceDifference }> = ({ props }) => {
  return (
    <div className="bg-error">
      <h1>TokenPriceDifferenceScope</h1>
      <div className="flex flex-col space-y-4">
        <div>Expect: {props.expect}</div>
        <div>Actual: {props.actual}</div>
      </div>
    </div>
  );
};

export default TokenPriceDifferenceScope;
