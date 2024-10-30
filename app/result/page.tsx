import AnalysisResponseType, { PoolKeyType } from "@/types/AnalysisResponse";
import { rawResponse } from "./response";

import DeltaResults from "./DeltaResults";

export default function Page() {
  const cleanUpResponse: AnalysisResponseType = rawResponse;

  return (
    <div>
      <MetaData data={cleanUpResponse} />
      <Results data={cleanUpResponse} />
    </div>
  );
}

function MetaData({ data }: { data: AnalysisResponseType }) {
  return (
    <div className='border'>
      <h1>MetaData</h1>
      <p>{data.task_id}</p>
      <p>{data.status}</p>
    </div>
  );
}

function Results({ data }: { data: AnalysisResponseType }) {
  return (
    <div className='border'>
      <h1>Results</h1>
      <p>{data.result.name}</p>
      <p>{data.result.mode}</p>
      <p>{data.result.idx}</p>
      <p>{data.result.time}</p>
      <p>{data.result.price}</p>
      <PoolKey poolKey={data.result.poolKey} />
      <DeltaResults data={data.result.data} />
    </div>
  );
}

function PoolKey({ poolKey }: { poolKey: PoolKeyType }) {
  return (
    <div className='border'>
      <h1>Pool Key</h1>
      <p>{poolKey.hooks}</p>
      <p>{poolKey.currency0}</p>
      <p>{poolKey.currency1}</p>
      <p>{poolKey.fee}</p>
      <p>{poolKey.tickSpacing}</p>
    </div>
  );
}
