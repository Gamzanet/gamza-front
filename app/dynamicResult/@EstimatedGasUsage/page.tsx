"use client";

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  YAxis,
  XAxis,
  Bar,
  LabelList,
  BarChart,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import Loading from "@/components/ui/loading";
import { useSSE } from "@/components/request/SSEManager";

export const description = "A bar chart with a custom label";

const chartConfig = {
  enableHook: {
    label: "enableHook",
    color: "hsl(var(--chart-1))",
  },
  disableHook: {
    label: "disableHook",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "white",
  },
} satisfies ChartConfig;

function Component({
  cardTitle,
  cardDescription,
  children,
  chartData = [],
}: {
  cardTitle: string;
  cardDescription: string;
  children?: React.ReactNode;
  chartData: { method: string; enableHook: number; disableHook: number }[];
}) {
  if (chartData.length === 0) {
    return <div>No data available</div>;
  }

  // ✅ 음수 값을 0으로 보정하고 유효성 체크 추가
  const sanitizedChartData = chartData.map((data) => ({
    method: data.method,
    enableHook: data.enableHook < 0 ? 0 : data.enableHook,
    disableHook: data.disableHook < 0 ? 0 : data.disableHook,
    isInvalid: data.enableHook < 0 || data.disableHook < 0, // 🚀 유효성 체크
  }));

  // ✅ 유효한 데이터만 필터링
  const validData = sanitizedChartData.filter((data) => !data.isInvalid);
  const invalidData = sanitizedChartData.filter((data) => data.isInvalid);

  // ✅ 최소/최대/평균/중앙값 계산
  const maxGas = validData.length
    ? Math.max(...validData.map((d) => d.enableHook))
    : 0;
  const maxGasMethod = validData.find((d) => d.enableHook === maxGas)?.method;

  const minGas = validData.length
    ? Math.min(...validData.map((d) => d.enableHook))
    : 0;
  const minGasMethod = validData.find((d) => d.enableHook === minGas)?.method;

  const averageGas = validData.length
    ? (
      validData.reduce((sum, d) => sum + d.enableHook, 0) / validData.length
    ).toFixed(2)
    : "0";

  const medianGas = validData.length
    ? (() => {
      const sorted = validData.map((d) => d.enableHook).sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2)
        : sorted[mid].toString();
    })()
    : "0";

  const maxValue =
    Math.max(...validData.map((d) => Math.max(d.enableHook, d.disableHook))) *
    1.2; // 최대값보다 약간 더 여유 공간 추가

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>

      <CardContent>
        {/* 🚀 차트 한 번만 렌더링 */}
        {validData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={validData}
              layout="vertical"
              margin={{ right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="method"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis domain={[0, maxValue]} type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="enableHook"
                layout="vertical"
                fill="hsl(var(--chart-5))"
                className="opacity-50 hover:opacity-100"
                radius={4}
              >
                <LabelList
                  dataKey="method"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="enableHook"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
              <Bar
                dataKey="disableHook"
                layout="vertical"
                fill="hsl(var(--chart-1))"
                className="opacity-50 hover:opacity-100"
                radius={4}
              >
                <LabelList
                  dataKey="method"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="disableHook"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="text-red-500 w-full mb-4">
            {invalidData.map((data, index) => (
              <p key={index} className="text-sm">
                {data.method}: No Data
              </p>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Maximum gas: {maxGasMethod} {maxGas}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          min:{minGas} | average:{averageGas} | median:{medianGas}
        </div>
        <div className="leading-none text-muted-foreground">{children}</div>
      </CardFooter>
    </Card>
  );
}
interface GasData {
  method: string;
  hookGas: number;
  noHookGas: number;
  difference: number;
}

function GasDifferenceSummary({
  chartData = [],
}: {
  chartData: { method: string; gas: number }[];
}) {
  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        No data available
      </div>
    );
  }

  const maxGas = chartData.reduce(
    (max, data) => (data.gas > max ? data.gas : max),
    0,
  );
  const maxGasMethod = chartData.find((data) => data.gas === maxGas)?.method;

  const minGas = chartData.reduce(
    (min, data) => (data.gas < min ? data.gas : min),
    Infinity,
  );
  const minGasMethod = chartData.find((data) => data.gas === minGas)?.method;

  const averageGas = (
    chartData.reduce((sum, data) => sum + data.gas, 0) / chartData.length
  ).toFixed(2);

  const medianGas = (() => {
    const sorted = [...chartData].sort((a, b) => a.gas - b.gas);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? ((sorted[mid - 1].gas + sorted[mid].gas) / 2).toFixed(2)
      : sorted[mid].gas;
  })();

  const chartConfig2 = {
    method: {
      label: "method",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gas Difference Summary</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig2}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="method"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="gas" fill="hsl(var(--chart-3))" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Maximum gas gap: {maxGasMethod} {maxGas}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          min:{minGas} | average:{averageGas} | median:{medianGas}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function GasDifferenceChart() {
  const [isCode, setIsCode] = useState<boolean>(false);
  const { taskResults, error } = useSSE();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const data = taskResults["dynamic-1-8"];
  if (!data) {
    return (
      <div className="w-full h-full">
        <Loading containerClassName="h-full" />
      </div>
    );
  }

  // ✅ `hook`과 `noHook` 데이터 정리
  const hook = data.result.result.hook;
  const noHook = data.result.result.noHook;
  const formattedData: GasData[] = [
    { method: "Add", hookGas: Number(hook.add.gas), noHookGas: Number(noHook.add.gas), difference: Number(hook.add.gas) - Number(noHook.add.gas) },
    { method: "Remove", hookGas: Number(hook.remove.gas), noHookGas: Number(noHook.remove.gas), difference: Number(hook.remove.gas) - Number(noHook.remove.gas) },
    { method: "Donate", hookGas: Number(hook.donate.gas), noHookGas: Number(noHook.donate.gas), difference: Number(hook.donate.gas) - Number(noHook.donate.gas) },
    { method: "Swap", hookGas: Number(hook.swap.gas), noHookGas: Number(noHook.swap.gas), difference: Number(hook.swap.gas) - Number(noHook.swap.gas) },
  ];
  const gasPrice = data.result.result.gasPrice;
  const gasData = formattedData;

  return (
    <>
      {!isCode && (
        <div className="flex flex-col items-center justify-center">
          {/* ✅ 현재 체인의 가스비 표시 */}
          <div className="mt-4 p-2 border rounded-lg bg-gray-100 text-sm text-gray-700">
            {gasPrice ? (
              <p>
                <strong>Current Gas Price:</strong>{" "}
                {gasPrice > 0 ? gasPrice + " wei" : "No Data"}
              </p>
            ) : (
              <p>Loading gas price...</p>
            )}
          </div>
          <Component
            cardTitle="Estimated Gas Usage"
            cardDescription="per method gas consumption enabled/disabled hooks"
            chartData={gasData.map(({ method, hookGas, noHookGas }) => ({
              method,
              enableHook: hookGas,
              disableHook: noHookGas,
            }))}
          >
            <GasDifferenceSummary
              chartData={gasData.map(({ method, difference }) => ({
                method,
                gas: difference,
              }))}
            />
          </Component>
        </div>
      )}
    </>
  );
}
