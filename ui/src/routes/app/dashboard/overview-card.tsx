import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { formatPercent } from '@/lib'
import { ModelInfo } from '@/types'

export const OverviewCard = ({ modelInfo }: { modelInfo: ModelInfo }) => {
  const getPerformanceStatus = (f1: number) => {
    if (f1 >= 0.9) return 'excellent'
    if (f1 >= 0.8) return 'good'
    if (f1 >= 0.7) return 'average'
    return 'needs improvement'
  }

  const performanceStatus = getPerformanceStatus(modelInfo.f1)

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Model Performance</CardTitle>
              <CardDescription>Overall metrics and statistics</CardDescription>
            </div>
            <Badge
              variant={
                performanceStatus === 'excellent'
                  ? 'default'
                  : performanceStatus === 'good'
                    ? 'secondary'
                    : performanceStatus === 'average'
                      ? 'outline'
                      : 'destructive'
              }
            >
              {performanceStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold">{formatPercent(modelInfo.accuracy)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Precision</p>
              <p className="text-2xl font-bold">{formatPercent(modelInfo.precision)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Recall</p>
              <p className="text-2xl font-bold">{formatPercent(modelInfo.recall)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">F1 Score</p>
              <p className="text-2xl font-bold">{formatPercent(modelInfo.f1)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
