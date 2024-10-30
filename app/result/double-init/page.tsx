import RecursiveJson from "@/components/RecursiveJson";

import { rawResponse } from "./response";
export default function Page() {
  // read ./double_init.json and converts it to a variable

  const data = rawResponse;
  return (
    <div>
      <RecursiveJson data={data} />
    </div>
  );
}
