import { TestLog } from "~~/types/gamza/AnalysisResult";

export default function LogBox(props: { data: TestLog }) {
  const { title, type, pass, summary, description, trace } = props.data;
  return (
    <div className="bg-error">
      <h1>LogBox</h1>
      <div className="flex flex-col space-y-4">
        <div>{title}</div>
        <div>{type}</div>
        <div>{pass ? "PASS" : "FAIL"}</div>
        <div>{summary}</div>
        <div>{description}</div>
        <div>{trace}</div>
      </div>
    </div>
  );
}
