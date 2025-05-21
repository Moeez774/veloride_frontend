"use client"

import { ChevronDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
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
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#00563c",
  },
} satisfies ChartConfig

export function Component() {

  const context = getContacts()
  const toggleTheme = context?.toggleTheme
  return (
    <Card className={`inter ${toggleTheme? 'bg-[#0d0d0d]': 'bg-[#fefefe]'} border-none`} style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}>
      <CardHeader>
        <CardTitle className='text-xs font-medium flex w-full justify-between items-center gap-2 text-[#5b5b5b]'>
            <h1 className={`${toggleTheme? 'text-[#b1b1b1]': 'text-[#5b5b5b]'}`}>Completed rides</h1>
            <h1 className={`${toggleTheme? 'text-[#048C64]': 'text-[#00563c]'} flex items-center`}>6 months <ChevronDown size={17} color={toggleTheme? '#048C64': '#00563c'} /> </h1>
            </CardTitle>
        <CardDescription className={`${toggleTheme? 'text-[#fefefe]': 'text-[#202020]'} text-2xl font-semibold`}>6,400+</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-[20em] md:h-[10em] w-full' config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke={toggleTheme? '#048C64': '#00563c'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
