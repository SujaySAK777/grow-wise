
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface SensorChartProps {
  title: string;
  data: ChartData[];
  color: string;
  unit: string;
}

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} as const;

const SensorChart = ({ title, data, color, unit }: SensorChartProps) => {
  return (
    <Card className="shadow-lg border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">{title}</CardTitle>
        <CardDescription className="text-gray-600">Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                className="text-sm"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                className="text-sm"
              />
              <ChartTooltip
                content={<ChartTooltipContent 
                  formatter={(value) => [`${value}${unit}`, title]}
                />}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SensorChart;
