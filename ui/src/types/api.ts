export type ModelInfo = {
  accuracy: number
  precision: number
  recall: number
  f1: number
  tp: number
  tn: number
  fp: number
  fn: number
  history: History[]
}

type History = {
  epoch: number
  accuracy: number
  loss: number
}

export type PredictionResponse = {
  timestamp: string
  userId: string
  batchId: string
  predictions: Prediction[]
}

type Prediction = {
  filename: string
  hasTumor: boolean
}
