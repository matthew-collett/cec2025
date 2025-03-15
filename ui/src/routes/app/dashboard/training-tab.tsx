import { Card, CardContent, CardHeader, CardTitle, Progress } from '@/components/ui'
import { formatPercent } from '@/lib'
import { ModelInfo } from '@/types'

export const TrainingTab = ({ modelInfo }: { modelInfo: ModelInfo }) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {modelInfo.history.map(epoch => (
          <Card key={epoch.epoch}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Epoch {epoch.epoch}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Accuracy</span>
                  <span className="text-sm font-medium">{formatPercent(epoch.accuracy)}</span>
                </div>
                <Progress value={epoch.accuracy * 100} />
                <div className="flex justify-between mt-2">
                  <span className="text-sm">Loss</span>
                  <span className="text-sm font-medium">{formatPercent(epoch.loss)}</span>
                </div>
                <Progress value={epoch.loss * 100} className="bg-red-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
