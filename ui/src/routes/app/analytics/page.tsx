import { TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PieChart, Pie, LineChart, Line, CartesianGrid, XAxis } from 'recharts'

import { PageTitle } from '@/components'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAppRoute } from '@/config'
import { auth } from '@/lib'
import { api } from '@/lib/api'
import { PredictionResponse } from '@/types'

const AnalyticsPage = () => {
  const [predictions, setPredictions] = useState<PredictionResponse[]>([])
  const [selectedBatchId, setSelectedBatchId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true)
      try {
        const user = auth.currentUser
        if (!user) {
          setPredictions([])
          setLoading(false)
          return
        }

        const token = await user.getIdToken()
        const response = await api.get(`/get-predictions/${user.uid}`, token)
        if (response.data) {
          const predictions = response.data as PredictionResponse[]
          setPredictions(predictions)
          if (predictions.length > 0) {
            setSelectedBatchId(predictions[0].batchId)
          }
        }
      } catch (err) {
        console.error('Error fetching predictions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [])

  // Get the selected batch data
  const selectedBatch = predictions.find(p => p.batchId === selectedBatchId)

  // Prepare pie chart data for tumor distribution
  const pieChartData = selectedBatch
    ? [
        {
          category: 'Tumors',
          count: selectedBatch.predictions.filter(p => p.hasTumor).length,
          fill: 'hsl(var(--chart-1))',
        },
        {
          category: 'No Tumors',
          count: selectedBatch.predictions.filter(p => !p.hasTumor).length,
          fill: 'hsl(var(--chart-2))',
        },
      ]
    : []

  const pieChartConfig = {
    'count': {
      label: 'Count',
    },
    'Tumors': {
      label: 'Tumors',
      color: 'hsl(var(--chart-1))',
    },
    'No Tumors': {
      label: 'No Tumors',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig

  // Prepare detection percentage over time data
  const getDetectionTimelineData = () => {
    return predictions
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(batch => {
        const total = batch.predictions.length
        const tumorsDetected = batch.predictions.filter(p => p.hasTumor).length
        const percentage = total > 0 ? Math.round((tumorsDetected / total) * 100) : 0

        return {
          date: new Date(batch.timestamp).toLocaleDateString(),
          percentage: percentage,
          batchId: batch.batchId,
        }
      })
  }

  const timelineData = getDetectionTimelineData()

  const timelineChartConfig = {
    percentage: {
      label: 'Detection %',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  // Calculate total positive and negative counts
  const tumorCount = selectedBatch ? selectedBatch.predictions.filter(p => p.hasTumor).length : 0
  const totalCount = selectedBatch ? selectedBatch.predictions.length : 0
  const tumorPercentage = totalCount > 0 ? Math.round((tumorCount / totalCount) * 100) : 0

  // Determine if tumor rate is high (more than 50%)
  const isTumorRateHigh = tumorPercentage > 50

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading data...</p>
      </div>
    )
  }

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />

      <div className="space-y-6">
        {predictions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <h3 className="font-semibold text-lg mb-2">No uploads found</h3>
                <p className="text-muted-foreground">Upload files to see analysis results here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select an upload" />
                </SelectTrigger>
                <SelectContent>
                  {predictions.map(prediction => (
                    <SelectItem key={prediction.batchId} value={prediction.batchId}>
                      {new Date(prediction.timestamp).toLocaleString()} (
                      {prediction.predictions.length} files)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Files</CardTitle>
                  <CardDescription>In selected upload</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Tumors Detected</CardTitle>
                  <CardDescription>Positive results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{tumorCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Detection Rate</CardTitle>
                  <CardDescription>Percentage of positive results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{tumorPercentage}%</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Pie Chart */}
              <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Results Distribution</CardTitle>
                  <CardDescription>Tumor vs. No Tumor Detection</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={pieChartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={pieChartData}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    {isTumorRateHigh ? (
                      <>
                        High tumor detection rate <TrendingUp className="h-4 w-4 text-red-500" />
                      </>
                    ) : (
                      <>
                        Low tumor detection rate <TrendingDown className="h-4 w-4 text-green-500" />
                      </>
                    )}
                  </div>
                  <div className="leading-none text-muted-foreground">
                    {tumorPercentage}% of files show tumor detection
                  </div>
                </CardFooter>
              </Card>

              {/* Timeline Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Detection Rate Timeline</CardTitle>
                  <CardDescription>Percentage of tumors detected over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={timelineChartConfig}>
                    <LineChart
                      accessibilityLayer
                      data={timelineData}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Line
                        dataKey="percentage"
                        type="natural"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={true}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="leading-none text-muted-foreground">
                    Tumor detection rates across all uploads
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* File Details Table */}
            <Card>
              <CardHeader>
                <CardTitle>File Details</CardTitle>
                <CardDescription>Individual analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2 border-b">Filename</th>
                        <th className="text-left p-2 border-b">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBatch?.predictions.map((prediction, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                          <td className="p-2">{prediction.filename}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                prediction.hasTumor
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {prediction.hasTumor ? 'Tumor Detected' : 'No Tumor'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  )
}

export default AnalyticsPage
