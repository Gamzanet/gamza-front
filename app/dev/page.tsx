import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PoolKeyType } from "@/types/AnalysisResponse";

export default function Page() {
  return (
    <div>
      <DynamicPoolKeyResult
        currency0='0x0197481B0F5237eF312a78528e79667D8b33Dcff'
        currency1='0xA56569Bd93dc4b9afCc871e251017dB0543920d4'
        fee={3000}
        tickSpacing={60}
        hooks='0x6caC2dcc5eCf5caac0382F1B4A77EABac0F6C0Cc'
      />
      {/* <TokenPriceProps realPrice={1.4} expectedPrice={1.4} oraclePrice={2.1} /> */}
    </div>
  );
}

function DynamicPoolKeyResult({
  currency0,
  currency1,
  fee,
  tickSpacing,
  hooks,
}: PoolKeyType) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PoolKey</CardTitle>
        <CardDescription>Component Description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 w-[600px] grid-cols-[150px,auto] border gap-4 p-4'>
          <p>Currency0</p> <p>{currency0}</p>
          <p>Currency1</p> <p>{currency1}</p>
          <p>Fee</p> <p>{fee}</p>
          <p>TickSpacing</p> <p>{tickSpacing}</p>
          <p>Hooks</p> <p>{hooks}</p>
        </div>
      </CardContent>
      <CardFooter>
        <p></p>
      </CardFooter>
    </Card>
  );
}

function DynamicTokenPriceResult({
  realPrice,
  expectedPrice,
  oraclePrice,
}: TokenPriceProps) {
  const expectedDiff = ((expectedPrice / realPrice) * 100).toFixed(2);
  const oracleDiff = ((oraclePrice / realPrice) * 100).toFixed(2);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Price</CardTitle>
        <CardDescription>Component Description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 grid-flow-row border gap-4 w-[500px] justify-items-center p-4'>
          <p>Real Price</p> <p>{realPrice}</p>
          <p>Expected Price</p>
          <p>
            <span>{expectedPrice} </span>
            <span className='text-xs'>({expectedDiff}%)</span>
          </p>
          <p>Oracle Price</p>
          <p>
            <span>{oraclePrice} </span>
            <span className='text-xs'>({oracleDiff}%)</span>
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <p></p>
      </CardFooter>
    </Card>
  );
}
