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
  accuracy: 0.91,
  precision: 0.89,
  recall: 0.94,
  f1: 0.91,
  tp: 450,
  tn: 380,
  fp: 35,
  fn: 25,
  history: [
    { epoch: 1, accuracy: 0.7999, loss: 0.4541 },
    { epoch: 2, accuracy: 0.8929, loss: 0.2743 },
    { epoch: 3, accuracy: 0.9301, loss: 0.1878 },
    { epoch: 4, accuracy: 0.9429, loss: 0.1601 },
    { epoch: 5, accuracy: 0.9432, loss: 0.197 },
    { epoch: 6, accuracy: 0.9469, loss: 0.1492 },
    { epoch: 7, accuracy: 0.95, loss: 0.184 },
    { epoch: 8, accuracy: 0.9486, loss: 0.2119 },
    { epoch: 9, accuracy: 0.9121, loss: 0.3963 },
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
