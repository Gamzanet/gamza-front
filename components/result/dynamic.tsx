"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ERC20DeltaDifferenceProps,
  TokenPriceProps,
  TransactionGasCostProps,
} from "@/types/DynamicAnalysis";
import { PoolKeyType } from "@/types/Property";

function DynamicERC20DeltaDifferenceResult({
  props,
}: {
  props: ERC20DeltaDifferenceProps;
}) {
  // can handle ERC20 & ERC6909 mint & ERC6909 burn cases
  const [method, setMethod] = useState("swap");

  const row = (type: string) => {
    const value = props[method][type];
    return (
      <TableRow>
        <TableCell className="text-center">{type}</TableCell>
        <TableCell className="text-center">{value.amount0}</TableCell>
        <TableCell className="text-center">{value.amount1}</TableCell>
      </TableRow>
    );
  };
  const getButtonClass = (currentMethod: string) =>
    `rounded-[15px] ${
      method === currentMethod ? "bg-primary" : "bg-primary-300 bg-opacity-50"
    }`;

  return (
    <Card className="w-min">
      <CardHeader>
        <CardTitle>ERC20DeltaDifference</CardTitle>
        <CardDescription>Component Description</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex w-min">
          <Button
            className={getButtonClass("swap")}
            onClick={() => setMethod("swap")}
          >
            swap
          </Button>
          <Button
            className={getButtonClass("addLiquidity")}
            onClick={() => setMethod("addLiquidity")}
          >
            addLiquidity
          </Button>
          <Button
            className={getButtonClass("removeLiquidity")}
            onClick={() => setMethod("removeLiquidity")}
          >
            removeLiquidity
          </Button>
          <Button
            className={getButtonClass("donate")}
            onClick={() => setMethod("donate")}
          >
            donate
          </Button>
        </div>
        <Table className="w-[350px]">
          <TableCaption>Table Description</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-primary">Type</TableHead>
              <TableHead className="text-center w-[100px] text-primary">
                amount0
              </TableHead>
              <TableHead className="text-center w-[100px] text-primary">
                amount1
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {row("user")}
            {row("hook")}
            {row("manager")}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <p></p>
      </CardFooter>
    </Card>
  );
}

function DynamicTransactionGasResult({
  data,
}: {
  data: TransactionGasCostProps;
}) {
  const component = (method: keyof TransactionGasCostProps) => {
    const value: {
      withHook: number;
      withoutHook: number;
    } = data[method];
    return (
      <TableRow>
        <TableCell className="text-center">{method}</TableCell>
        <TableCell className="text-center">{value.withHook}</TableCell>
        <TableCell className="text-center">{value.withoutHook}</TableCell>
        <TableCell className="text-center">
          {(value.withHook - value.withoutHook).toFixed(0)}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Transaction Price</CardTitle>
        <CardDescription>Component Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Table Description</TableCaption>
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="text-center">Mehtod</TableHead>
              <TableHead className="text-center w-[100px]">With Hook</TableHead>
              <TableHead className="text-center w-[100px]">
                Without Hook
              </TableHead>
              <TableHead className="text-center w-[100px]">Delta</TableHead>
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
  chain,
  currency0,
  currency1,
  fee,
  tickSpacing,
  hooks,
  deployer,
}: PoolKeyType) {
  return (
    <Card className="m-0 rounded-[15px] border mr-2 w-auto w-full min-h-[330px] flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">PoolKey</CardTitle>
          <CardDescription className="text-base text-gray-500">
            Chain: <span className="font-medium">{chain}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="font-fira-code">
        <div className="grid grid-cols-[minmax(120px,auto),1fr] border gap-4 p-4 text-sm">
          <p className="font-bold text-base">Currency0</p>
          <p className="truncate text-sm">{currency0}</p>

          <p className="font-bold text-base">Currency1</p>
          <p className="truncate text-sm">{currency1}</p>

          <p className="font-bold text-base">Fee</p>
          <p className="text-sm">{fee}</p>

          <p className="font-bold text-base">TickSpacing</p>
          <p className="text-sm">{tickSpacing}</p>

          <p className="font-bold text-base">Hooks</p>
          <p className="truncate text-sm">{hooks}</p>
        </div>

        <div className="grid grid-cols-[minmax(120px,auto),1fr] gap-4 p-4 text-sm">
          <p className="font-bold text-base">Deployer</p>
          <p className="truncate text-sm">{deployer}</p>
        </div>
      </CardContent>
    </Card>
  );
}


function DynamicTokenPriceResult({
  swappedPrice,
  fee,
  oraclePrice,
}: TokenPriceProps) {
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString()); // 한 번만 실행
  }, []);

  const priceDiff = ((swappedPrice / oraclePrice) * 100 - 100).toFixed(2);

  return (
    <Card className="m-0 rounded-[15px] border ml-2 w-auto w-full min-h-[330px] flex flex-col">
      <CardHeader>
        <CardTitle>Token Price</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Overview of ExactIn-Swap and oracle price data
        </CardDescription>
      </CardHeader>
      <CardContent className="font-fira-code">
        <div className="grid grid-cols-[auto,1fr] gap-y-4 border p-4 gap-x-8">
          {/* ✅ Swapped Price */}
          <div>
            <p className="font-bold">Swapped Price:</p>
            <p className="text-sm text-gray-500">Included Hook Fee:</p>
          </div>
          <div>
            <p>{swappedPrice}</p>
            <p className="text-sm text-gray-500">
              {fee} ({fee / 10000}%)
            </p>
          </div>

          {/* ✅ Oracle Price */}
          <div>
            <p className="font-bold">Oracle Price:</p>
            <p className="text-sm text-gray-500">Fetched via Pyth</p>
          </div>
          <div>
            <p>{oraclePrice}</p>
            <p className="text-sm text-gray-500">Currency0 / Currency1</p>
          </div>

          {/* ✅ Price Difference */}
          <p className="font-bold">Price Difference:</p>
          <p
            className={`text-lg font-semibold ${
              parseFloat(priceDiff) >= 5 ? "text-red-500" : "text-green-500"
            }`}
          >
            {priceDiff}%
          </p>
        </div>

        {/* ✅ 조회 시간 */}
        <div className="mt-2 text-xs text-gray-500 text-right">
          Last Updated at: {lastUpdated}
        </div>
      </CardContent>
    </Card>
  );
}

export {
  DynamicERC20DeltaDifferenceResult,
  DynamicTransactionGasResult,
  DynamicPoolKeyResult,
  DynamicTokenPriceResult,
};
