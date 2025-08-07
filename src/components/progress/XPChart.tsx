
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface PerformanceData {
  month: string
  completed: number
  xp: number
}

interface XPChartProps {
  data: PerformanceData[]
}

export const XPChart = ({ data }: XPChartProps) => {
  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle>Ganho de XP</CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#6366f1"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
