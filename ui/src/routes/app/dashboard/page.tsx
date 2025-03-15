import { useLocation } from 'react-router-dom'

import { ConfusionMatrixTab } from './confusion-matrix-tab'
import { OverviewCard } from './overview-card'
import { OverviewTab } from './overview-tab'
import { TrainingTab } from './training-tab'

import { PageTitle } from '@/components'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { getAppRoute } from '@/config'
import { ModelInfo } from '@/types'

// Mock data for development
const mockModelInfo: ModelInfo = {
  accuracy: 0.92,
  precision: 0.89,
  recall: 0.94,
  f1: 0.91,
  tp: 450,
  tn: 380,
  fp: 35,
  fn: 25,
  history: [
    { epoch: 1, accuracy: 0.6829, loss: 0.593 },
    { epoch: 2, accuracy: 0.8491, loss: 0.3503 },
    { epoch: 3, accuracy: 0.925, loss: 0.1891 },
    { epoch: 4, accuracy: 0.9429, loss: 0.1601 },
    { epoch: 5, accuracy: 0.9793, loss: 0.0535 },
    { epoch: 6, accuracy: 0.9838, loss: 0.0468 },
    { epoch: 7, accuracy: 0.9887, loss: 0.0345 },
    { epoch: 8, accuracy: 0.9927, loss: 0.0237 },
    { epoch: 9, accuracy: 0.9902, loss: 0.0283 },
    { epoch: 10, accuracy: 0.9899, loss: 0.0316 },
  ],
}

const DashboardPage = () => {
  const location = useLocation()
  const modelInfo = mockModelInfo

  return (
    <div className="container mx-auto space-y-6">
      <PageTitle route={getAppRoute(location.pathname)} />
      <OverviewCard modelInfo={modelInfo} />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab modelInfo={modelInfo} />
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-4">
          <TrainingTab modelInfo={modelInfo} />
        </TabsContent>

        <TabsContent value="confusion" className="space-y-4">
          <ConfusionMatrixTab modelInfo={modelInfo} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardPage
