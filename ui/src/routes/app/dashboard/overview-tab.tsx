import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui'
import { formatPercent } from '@/lib'
import { ModelInfo } from '@/types'

export const OverviewTab = ({ modelInfo }: { modelInfo: ModelInfo }) => {
  const chartConfig = {
    accuracy: {
      label: 'Accuracy',
      color: 'hsl(var(--chart-1))',
    },
    loss: {
      label: 'Loss',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
          <CardDescription>Current model performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Accuracy</span>
              <span className="text-sm font-medium">{formatPercent(modelInfo.accuracy)}</span>
            </div>
            <Progress value={modelInfo.accuracy * 100} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Precision</span>
              <span className="text-sm font-medium">{formatPercent(modelInfo.precision)}</span>
            </div>
            <Progress value={modelInfo.precision * 100} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Recall</span>
              <span className="text-sm font-medium">{formatPercent(modelInfo.recall)}</span>
            </div>
            <Progress value={modelInfo.recall * 100} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">F1 Score</span>
              <span className="text-sm font-medium">{formatPercent(modelInfo.f1)}</span>
            </div>
            <Progress value={modelInfo.f1 * 100} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Progress</CardTitle>
          <CardDescription>Model accuracy and loss on validation data</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={modelInfo.history}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="epoch" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                domain={[0, 1]}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => formatPercent(value)}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={value => formatPercent(Number(value))}
                  />
                }
              />
              <Line
                dataKey="accuracy"
                type="monotone"
                stroke="var(--color-accuracy)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="loss"
                type="monotone"
                stroke="var(--color-loss)"
                strokeWidth={2}
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
