"use client"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts"
import { getContacts } from '@/context/ContactsProvider'
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
import { WalletData } from "@/app/dashboard/(Dashboard)/Pages/Wallet"
import { useState, useEffect } from "react"

type ChartData = {
  month: string
  Spent: number
  Earned: number
}

const chartConfig = {
  Spent: {
    label: "Spent",
    color: "#00563c",
  },
  Earned: {
    label: "Earned",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Component({ walletData }: { walletData: WalletData }) {

  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    setChartData(walletData.monthlyStats.map(stat => ({
      month: stat.month,
      Spent: stat.spent,
      Earned: stat.earned,
    })))
  }, [walletData])

  const context = getContacts()
  const toggleTheme = context?.toggleTheme
  return (
    <Card className={`p-0 m-0 h-[20em] w-full shadow-none inter ${toggleTheme ? 'bg-[#0d0d0d]' : 'bg-[#fefefe]'} border-none`}>
      <CardContent className='h-[20em] p-0 m-0 w-full'>
        <ChartContainer className='h-[25em] p-0 m-0 w-full' config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 5
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent className={`${toggleTheme ? 'text-[#fefefe] border border-[#353535] bg-[#202020]' : 'text-[#202020] border bg-[#fefefe]'}`} />} />
            <defs>
              <linearGradient id="fillSpent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#00563c"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#00563c"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillEarned" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-yellow-500)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-yellow-500)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="Earned"
              type="natural"
              fill="url(#fillEarned)"
              fillOpacity={0.4}
              stroke="var(--color-yellow-500)"
              stackId="a"
            />
            <Area
              dataKey="Spent"
              type="natural"
              fill="url(#fillSpent)"
              fillOpacity={0.4}
              stroke="#00563c"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
