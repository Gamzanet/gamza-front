"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableRow,
  TableCell,
  TableCaption,
  TableHeader,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { PoolKeyType } from "@/types/AnalysisResponse";

export default function Page() {
  return (
    <div>
      <DynamicTransactionPriceResult
        data={{
          swap: {
            withHook: 12342,
            withoutHook: 9090,
          },
          removeLiquidity: {
            withHook: 6771,
            withoutHook: 5670,
          },
          addLiquidity: {
            withHook: 5422,
            withoutHook: 4579,
          },
          donate: {
            withHook: 3400,
            withoutHook: 3400,
          },
        }}
      />
      {/* <DynamicPoolKeyResult
        currency0="0x0197481B0F5237eF312a78528e79667D8b33Dcff"
        currency1="0xA56569Bd93dc4b9afCc871e251017dB0543920d4"
        fee={3000}
        tickSpacing={60}
        hooks="0x6caC2dcc5eCf5caac0382F1B4A77EABac0F6C0Cc"
      /> */}
      {/* <TokenPriceProps realPrice={1.4} expectedPrice={1.4} oraclePrice={2.1} /> */}
    </div>
  );
}

function DynamicTransactionPriceResult({
  data,
}: {
  data: TransactionPriceProps;
}) {
  const component = (method: string) => {
    const value = data[method];
    return (
      <TableRow>
        <TableCell className='text-center'>{method}</TableCell>
        <TableCell className='text-center'>{value.withHook}</TableCell>
        <TableCell className='text-center'>{value.withoutHook}</TableCell>
        <TableCell className='text-center'>
          {(value.withHook - value.withoutHook).toFixed(0)}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className='w-[500px]'>
      <CardHeader>
        <CardTitle>Transaction Price</CardTitle>
        <CardDescription>Component Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Table Description</TableCaption>
          <TableHeader className='bg-gray-200'>
            <TableRow>
              <TableHead className='text-center'>Mehtod</TableHead>
              <TableHead className='w-[100px] text-center'>With Hook</TableHead>
              <TableHead className='w-[100px] text-center'>
                Without Hook
              </TableHead>
              <TableHead className='w-[100px] text-center'>Delta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {component("swap")}
            {component("removeLiquidity")}
            {component("addLiquidity")}
            {component("donate")}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <p></p>
      </CardFooter>
    </Card>
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
