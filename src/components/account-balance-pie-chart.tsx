"use client";

import { TrendingUp } from "lucide-react";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const colorByAccountType = {
  checking: "var(--color-checking)",
  savings: "var(--color-savings)",
  credit: "var(--color-credit)",
  investment: "var(--color-investment)",
  other: "var(--color-other)",
} as Record<string, string>;

const chartConfig = {
  balance: {
    label: "Balance",
  },
  checking: {
    label: "Checking",
    color: "hsl(var(--chart-1))",
  },
  savings: {
    label: "Savings",
    color: "hsl(var(--chart-2))",
  },
  credit: {
    label: "Credit",
    color: "hsl(var(--chart-3))",
  },
  investment: {
    label: "Investment",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function AccountBalancePieChart({
  chartData,
}: {
  chartData: { balance: number; accountType: string }[];
}) {
  const totalBalance = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.balance, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Accounts balance allocation</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((data) => ({
                ...data,
                fill: colorByAccountType[data.accountType],
              }))}
              dataKey="balance"
              nameKey="accountType"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalBalance.toLocaleString()}$
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total balance
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Overall balance up by 5.2% this month{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
