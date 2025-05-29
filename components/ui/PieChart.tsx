"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart as RechartsChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  rides: {
    label: "Rides",
    color: "#4F46E5"
  },
  tips: {
    label: "Tips",
    color: "#10B981",
  },
  withdrawls: {
    label: "Withdrawls",
    color: "#F59E0B",
  },
  refunds: {
    label: "Refunds",
    color: "#EF4444",
  },
  other: {
    label: "Other",
    color: "#9CA3AF",
  },
} satisfies ChartConfig

export function PieChart({ toggleTheme, spendings }: { toggleTheme: boolean | undefined, spendings: any }) {

    const chartData = [
        { category: "rides", spending: spendings.rides===0? 0.01: spendings.rides, fill: "#4F46E5" },
        { category: "tips", spending: spendings.tips===0? 0.01: spendings.tips, fill: "#10B981" },
        { category: "withdrawls", spending: spendings.withdrawls===0? 0.01: spendings.withdrawls, fill: "#F59E0B" },
        { category: "refunds", spending: spendings.refunds===0? 0.01: spendings.refunds, fill: "#EF4444" },
        { category: "other", spending: spendings.other===0? 0.01: spendings.other, fill: "#9CA3AF" },
      ]

  return (
    <Card className={`${toggleTheme ? 'bg-[#0d0d0d]' : 'bg-[#fefefe]'} outline-none border-none flex h-[17em] flex-col`}>
      <CardHeader className="items-center pb-0">
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent className="border-none shadow-none outline-none px-0 h-[17em] pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto shadow-none border-none aspect-square -translate-y-8 w-[20em] max-h-[300px]"
        >
          <RechartsChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className={`${toggleTheme ? 'text-[#fefefe] bg-[#202020] border border-[#353535]' : 'text-[#202020] bg-[#fefefe] border'}`} hideLabel />}
            />
            <Pie data={chartData} dataKey="spending" nameKey="category" />
          </RechartsChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default PieChart;
