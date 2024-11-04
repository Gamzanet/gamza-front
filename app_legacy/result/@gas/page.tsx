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
import {
  TransactionGasCostToChartProps,
  TransactionGasCostToChartData,
} from "@/types/DynamicAnalysis";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  YAxis,
  XAxis,
  Bar,
  LabelList,
  BarChart,
} from "recharts";

function givenData(): TransactionGasCostToChartProps {
  const chartData: TransactionGasCostToChartData[] = [
    { method: "swap", enableHook: 186, disableHook: 80 },
    { method: "addLiquidity", enableHook: 305, disableHook: 200 },
    { method: "removeLiquidity", enableHook: 237, disableHook: 120 },
    { method: "donate", enableHook: 190, disableHook: 73 },
  ];
  return { data: chartData };
}

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

export function GasDifferenceChart() {
  const data: TransactionGasCostToChartProps = givenData();
  return (
    <Component
      cardTitle='Estimated Gas Usage'
      cardDescription='per method gas consumption enabled/disabled hooks'
      chartData={data.data}
    >
      <GasDifferenceSummary />
    </Component>
  );
}

function GasDifferenceSummary(): React.ReactNode {
  // summary per method difference
  // const methodDifferences = chartData.map(
  //   ({ method, enableHook, disableHook }) =>
  //     `${method}: ${enableHook - disableHook}`
  // );

  // // summary min/max difference

  // const minDifference = Math.min(
  //   ...chartData.map(({ enableHook, disableHook }) => enableHook - disableHook)
  // );
  // const maxDifference = Math.max(
  //   ...chartData.map(({ enableHook, disableHook }) => enableHook - disableHook)
  // );

  // // summary total difference
  // const totalEnableHook = chartData.reduce(
  //   (acc, { enableHook }) => acc + enableHook,
  //   0
  // );
  // const totalDisableHook = chartData.reduce(
  //   (acc, { disableHook }) => acc + disableHook,
  //   0
  // );
  // const totalDifference = totalEnableHook - totalDisableHook;

  const chartData2 = [
    { method: "Swap", gas: 186 },
    { method: "AddLiquidity", gas: 305 },
    { method: "RemoveLiquidity", gas: 237 },
    { method: "Donate", gas: 190 },
  ];

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
          <BarChart accessibilityLayer data={chartData2}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='method'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 6)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='gas' fill='hsl(var(--chart-3))' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
