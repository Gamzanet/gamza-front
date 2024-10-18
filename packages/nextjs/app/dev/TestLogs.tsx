import { FC } from "react";
import LogBox from "~~/components/gamza/LogBox";
import { TestLog } from "~~/types/gamza/AnalysisResult";

const TestLogsScope: FC<{ props: TestLog[] }> = ({ props }) => {
  return (
    <div className="bg-base-200 m-2">
      <h1>TestLogs Scope</h1>
      {props.map(log => (
        <LogBox key={Math.random().toString(36)} data={log} />
      ))}
    </div>
  );
};

export default TestLogsScope;
