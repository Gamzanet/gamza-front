import { FC } from "react";
import LogBox from "~~/components/gamza/LogBox";
import { TestLog } from "~~/types/gamza/AnalysisResult";

const TestLogsScope: FC<{ props: TestLog[] }> = ({ props }) => {
  return (
    <div className="bg-error">
      <h1>TestLogs Scope</h1>
      <div className="flex flex-col space-y-4">
        {props.map(log => (
          <LogBox key={Math.random().toString(36)} data={log} />
        ))}
      </div>
    </div>
  );
};

export default TestLogsScope;
