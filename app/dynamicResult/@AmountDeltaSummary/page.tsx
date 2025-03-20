"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  RadioStateHandler,
  CheckBoxBooleanStateHandler,
} from "@/components/form/RadioStateHandler";
import Loading from "@/components/ui/loading";
import { useSSE } from "@/components/request/SSEManager";

export default function AmountDeltaSummaryPage() {
  const [methodType, setMethodType] = useState<
    "Swap" | "AddLiquidity" | "RemoveLiquidity" | "Donate"
  >("Swap");
  const [exactType, setExactType] = useState<"ExactIn" | "ExactOut">("ExactIn");
  const [isMint, setIsMint] = useState(false);
  const [isBurn, setIsBurn] = useState(false);
  const { taskResults, error } = useSSE();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const data = taskResults["dynamic-2-9"];
  if (!data) {
    return (
      <div className="w-full h-full">
        <Loading containerClassName="h-full" />
      </div>
    );
  }

  const { with_6909: with6909, with_20: with20 } = data.result.data;
  const deltaData = { with6909, with20 };

  const getFilteredData = (method: string) => {
    if (method === "Swap") {
      return isMint || isBurn
        ? filterData(
            deltaData.with6909.swap || [],
            isBurn,
            exactType === "ExactIn",
          )
        : filterData(
            deltaData.with20.swap || [],
            false,
            exactType === "ExactIn",
          );
    }
    if (method === "AddLiquidity") {
      return isBurn
        ? [deltaData.with6909.addLiquidity]
        : [deltaData.with20.addLiquidity];
    }
    if (method === "RemoveLiquidity") {
      return isMint
        ? [deltaData.with6909.removeLiquidity]
        : [deltaData.with20.removeLiquidity];
    }
    if (method === "Donate") {
      return [deltaData.with20.donate];
    }
    return [];
  };

  const filterData = (
    data: any[],
    isBurn: boolean | null,
    isExactIn: boolean,
  ) => {
    return data.filter((item) => {
      const burnMatch = isBurn === null || item.is_burn === isBurn;
      const exactInMatch = item.is_exactIn === isExactIn;
      return burnMatch && exactInMatch;
    });
  };

  const renderTableRows = (data: any[]) => {
    return Array.isArray(data)
      ? data.map((item, index) => (
          <React.Fragment key={index}>
            <TableRow
              style={{
                borderTop: "3px solid grey",
              }}
            >
              <TableCell>General</TableCell>
              <TableCell>Delta</TableCell>
              <TableCell>{item.amount0delta || "No data"}</TableCell>
              <TableCell>{item.amount1delta || "No data"}</TableCell>
            </TableRow>
            <TableRow
              style={{
                borderTop: "3px solid grey",
              }}
            >
              <TableCell>ERC20</TableCell>
              <TableCell>User</TableCell>
              <TableCell>{item.userAmount0delta || "No data"}</TableCell>
              <TableCell>{item.userAmount1delta || "No data"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ERC20</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>{item.managerAmount0delta || "No data"}</TableCell>
              <TableCell>{item.managerAmount1delta || "No data"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ERC20</TableCell>
              <TableCell>Hook</TableCell>
              <TableCell>{item.hookAmount0delta || "No data"}</TableCell>
              <TableCell>{item.hookAmount1delta || "No data"}</TableCell>
            </TableRow>
            <TableRow
              style={{
                borderTop: "3px solid grey",
              }}
            >
              <TableCell>ERC6909</TableCell>
              <TableCell>User</TableCell>
              <TableCell>{item.user6909Amount0delta || "No data"}</TableCell>
              <TableCell>{item.user6909Amount1delta || "No data"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ERC6909</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>{item.managerAmount0delta || "No data"}</TableCell>
              <TableCell>{item.managerAmount1delta || "No data"}</TableCell>
            </TableRow>
          </React.Fragment>
        ))
      : Object.entries(data).map(([key, value]: any, index) => (
          <TableRow key={index}>
            <TableCell>{key}</TableCell>
            <TableCell>Delta</TableCell>
            <TableCell>{value.amount0delta || "0"}</TableCell>
            <TableCell>{value.amount1delta || "0"}</TableCell>
          </TableRow>
        ));
  };

  const selectedData = getFilteredData(methodType);
  const showExactType = methodType === "Swap"; // exactIn/Out 라디오 버튼 표시 여부
  const disableMint = methodType === "AddLiquidity" || methodType === "Donate";
  const disableBurn =
    methodType === "RemoveLiquidity" || methodType === "Donate";

  const handleMintChange = (checked: boolean) => {
    if (checked) {
      setIsMint(true);
      setIsBurn(false);
    } else {
      setIsMint(false);
    }
  };

  const handleBurnChange = (checked: boolean) => {
    if (checked) {
      setIsBurn(true);
      setIsMint(false);
    } else {
      setIsBurn(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex">
            <div className="flex flex-col px-4">
              <CardTitle>Amount0/1 Delta Summary</CardTitle>
              <CardDescription>Compare delta among stakeholers</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4">
            <div className="flex gap-4 items-center">
              <Tabs defaultValue="Swap">
                <TabsList>
                  {["Swap", "AddLiquidity", "RemoveLiquidity", "Donate"].map(
                    (value) => (
                      <TabsTrigger
                        key={value}
                        value={value}
                        onClick={() => {
                          setMethodType(value as any);
                        }}
                      >
                        {value}
                      </TabsTrigger>
                    ),
                  )}
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-2">
                  {CheckBoxBooleanStateHandler({
                    label: "Mint",
                    setter: handleMintChange,
                    checked: isMint,
                    isDisabled: disableMint,
                  })}
                  {CheckBoxBooleanStateHandler({
                    label: "Burn",
                    setter: handleBurnChange,
                    checked: isBurn,
                    isDisabled: disableBurn,
                  })}
                </div>
                {showExactType && (
                  <RadioStateHandler
                    labels={["ExactIn", "ExactOut"]}
                    setter={(value) => setExactType(value as any)}
                  />
                )}
              </div>
            </div>

            <Table className="font-fira-code">
              <TableCaption>
                Amount0/1 Delta Summary for {methodType}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>PoolHookUser</TableHead>
                  <TableHead>Amount0Delta</TableHead>
                  <TableHead>Amount1Delta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedData && selectedData.length > 0 ? (
                  renderTableRows(selectedData)
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-500"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
