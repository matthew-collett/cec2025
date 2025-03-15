import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from '@/components/ui'
import { formatPercent } from '@/lib'
import { ModelInfo } from '@/types'

export const ConfusionMatrixTab = ({ modelInfo }: { modelInfo: ModelInfo }) => {
  const totalPredictions = modelInfo.tp + modelInfo.tn + modelInfo.fp + modelInfo.fn

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confusion Matrix</CardTitle>
        <CardDescription>Evaluation of classification accuracy</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 items-center">
          <div>
            <div className="grid grid-cols-2 gap-1 max-w-md mx-auto">
              <div className="border p-6 bg-green-100 dark:bg-green-950 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{modelInfo.tp}</span>
                <span className="text-sm text-muted-foreground">True Positive</span>
                <span className="text-xs text-muted-foreground">
                  {((modelInfo.tp / totalPredictions) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="border p-6 bg-red-100 dark:bg-red-950 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{modelInfo.fp}</span>
                <span className="text-sm text-muted-foreground">False Positive</span>
                <span className="text-xs text-muted-foreground">
                  {((modelInfo.fp / totalPredictions) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="border p-6 bg-red-100 dark:bg-red-950 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{modelInfo.fn}</span>
                <span className="text-sm text-muted-foreground">False Negative</span>
                <span className="text-xs text-muted-foreground">
                  {((modelInfo.fn / totalPredictions) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="border p-6 bg-green-100 dark:bg-green-950 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{modelInfo.tn}</span>
                <span className="text-sm text-muted-foreground">True Negative</span>
                <span className="text-xs text-muted-foreground">
                  {((modelInfo.tn / totalPredictions) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 dark:bg-green-900 mr-1"></div>
                  <span className="text-xs">Correct</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-100 dark:bg-red-900 mr-1"></div>
                  <span className="text-xs">Incorrect</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Prediction Breakdown</h4>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Correct Predictions</span>
                    <span className="text-sm font-medium">
                      {formatPercent((modelInfo.tp + modelInfo.tn) / totalPredictions)}
                    </span>
                  </div>
                  <Progress
                    value={((modelInfo.tp + modelInfo.tn) / totalPredictions) * 100}
                    className="bg-green-100"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Incorrect Predictions</span>
                    <span className="text-sm font-medium">
                      {formatPercent((modelInfo.fp + modelInfo.fn) / totalPredictions)}
                    </span>
                  </div>
                  <Progress
                    value={((modelInfo.fp + modelInfo.fn) / totalPredictions) * 100}
                    className="bg-red-100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Precision</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xl font-bold">{formatPercent(modelInfo.precision)}</p>
                  <p className="text-xs text-muted-foreground">TP / (TP + FP)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Recall</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xl font-bold">{formatPercent(modelInfo.recall)}</p>
                  <p className="text-xs text-muted-foreground">TP / (TP + FN)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
