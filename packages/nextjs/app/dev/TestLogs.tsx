import { FC } from "react";
import LogBox from "~~/components/gamza/legacy/LogBox";
import { TestLog } from "~~/types/gamza/AnalysisResult";

const TestLogsScope: FC<{ props: TestLog[] }> = ({ props }) => {
  return (
    <div className="bg-base-200 m-2 space-y-2 p-4">
      <header className="text-center text-3xl font-bold">TestLogs</header>
      {props.map(log => (
        <LogBox key={Math.random().toString(36)} data={log} />
      ))}
    </div>
  );
};

export default TestLogsScope;
