import { DynamicPoolKeyResult } from "@/components/result/dynamic";

export default function PoolKeyInformationResultPage() {
  return (
    <div className='text-xs w-fit-content'>
      <DynamicPoolKeyResult
        currency0={"0x0197481B0F5237eF312a78528e79667D8b33Dcff"}
        fee={3000}
        currency1={"0xA56569Bd93dc4b9afCc871e251017dB0543920d4"}
        tickSpacing={60}
        hooks={"0x6da8f09885Bb7aaD2d45476179DbC75573984080"}
      />
    </div>
  );
}
