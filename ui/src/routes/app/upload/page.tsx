import { Upload, ImageIcon, LoaderCircle, Clock, X, Download } from 'lucide-react'
import { ChangeEvent, DragEvent, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { PageTitle } from '@/components'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui'
import { getAppRoute } from '@/config'
import { auth } from '@/lib'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import { PredictionResponse } from '@/types'

type UploadedFile = {
  id: string
  file: File
  preview: string
}

const UploadPage = () => {
  const location = useLocation()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upload')
  const [predictions, setPredictions] = useState<PredictionResponse[]>([])
  const [error, setError] = useState<string | null>(null)

  // Function to export prediction data as CSV
  const exportToCsv = (prediction: PredictionResponse) => {
    // Create CSV header
    const headers = ['Filename', 'Result']

    // Create CSV rows from predictions
    const rows = prediction.predictions.map(pred => [
      `"${pred.filename}"`,
      pred.hasTumor ? 'Tumor Detected' : 'No Tumor Detected',
    ])

    // Combine header and rows
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

    // Create Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    // Create download link and trigger click
    const link = document.createElement('a')
    const timestamp = new Date(prediction.timestamp).toISOString().split('T')[0]
    const fileName = `tumor-analysis-${timestamp}.csv`

    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    URL.revokeObjectURL(url)
  }

  // Fetch existing predictions on load
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const user = auth.currentUser
        if (!user) {
          setPredictions([])
          return
        }

        const token = await user.getIdToken()
        try {
          const response = await api.get(`/get-predictions/${user.uid}`, token)
          setPredictions(
            (Array.isArray(response.data) ? response.data : []).sort((a, b) => {
              const dateA = new Date(a.timestamp)
              const dateB = new Date(b.timestamp)
              return dateB.getTime() - dateA.getTime()
            }),
          )
        } catch (error) {
          // If we get a 404, it just means no predictions exist yet
          if (error instanceof ApiError && error.status === 404) {
            setPredictions([])
          } else {
            throw error
          }
        }
      } catch (error) {
        console.error('Error fetching predictions:', error)
        setError('Failed to load existing predictions')
        setPredictions([]) // Ensure predictions is always an array
      } finally {
        setIsLoading(false)
      }
    }

    fetchPredictions()
  }, [])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files))
    }
  }

  const addFiles = (newFiles: File[]) => {
    // Filter for PNG files only
    const pngFiles = newFiles.filter(file => file.type === 'image/png')

    if (pngFiles.length === 0) return

    const newUploadedFiles = pngFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }))

    setFiles(prev => [...prev, ...newUploadedFiles])
  }

  const removeFile = (id: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(file => file.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prevFiles.filter(file => file.id !== id)
    })
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }
  const handleSubmit = async () => {
    if (files.length === 0 || isUploading) return
    setIsUploading(true)
    setError(null)

    try {
      const user = auth.currentUser
      if (!user) {
        setError('You must be logged in to upload files')
        return
      }

      const batchId = crypto.randomUUID()
      const token = await user.getIdToken()
      const MAX_CHUNK_SIZE = 100
      const allResults: PredictionResponse[] = []

      // Split files into chunks of 100
      const fileChunks = []
      for (let i = 0; i < files.length; i += MAX_CHUNK_SIZE) {
        fileChunks.push(files.slice(i, i + MAX_CHUNK_SIZE))
      }

      // Process each chunk and collect results
      await Promise.all(
        fileChunks.map(async (chunk, index) => {
          try {
            const chunkFormData = new FormData()
            chunkFormData.append('batchId', batchId)
            chunk.forEach(file => {
              chunkFormData.append('images', file.file)
            })

            const response = await api.post(`/predict/${user.uid}`, token, chunkFormData)

            if (response && response.data) {
              allResults.push(response.data as PredictionResponse)
            }
          } catch (chunkError) {
            console.error(`Error processing chunk ${index + 1}:`, chunkError)
            // Continue with other chunks instead of failing completely
          }
        }),
      )

      if (allResults.length > 0) {
        // Add all new predictions to our list and switch to history tab
        setPredictions(prev => {
          // Add all new results to the array
          const updatedPredictions = [...prev, ...allResults]
          // Sort by timestamp in descending order (newest first)
          return updatedPredictions.sort((a, b) => {
            const dateA = new Date(a.timestamp)
            const dateB = new Date(b.timestamp)
            return dateB.getTime() - dateA.getTime()
          })
        })
        setActiveTab('history')
        // Clean up files
        resetForm()
      } else {
        throw new Error('No images were successfully processed')
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      setError('Failed to process images. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    // Revoke all object URLs to prevent memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview))
    setFiles([])
  }

  // Format file sizes for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  // Check if the user is authenticated
  const isAuthenticated = !!auth.currentUser

  return (
    <div className="container mx-auto space-y-6">
      <PageTitle route={getAppRoute(location.pathname)} />

      {!isAuthenticated && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="rounded-md bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              <p>You need to log in to use the analysis features.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" disabled={!isAuthenticated}>
            Upload Images
          </TabsTrigger>
          <TabsTrigger
            value="history"
            disabled={!isAuthenticated || (isLoading && predictions.length === 0)}
          >
            History
            {predictions.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {predictions.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Upload PNG images for tumor detection analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-md bg-destructive/15 p-4 text-destructive">
                  {error}
                </div>
              )}

              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                  isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
                  'hover:border-primary hover:bg-primary/5',
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">Drag and drop your PNG files</h3>
                  <p className="text-sm text-muted-foreground">or click to browse your files</p>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".png"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={!isAuthenticated}
                  >
                    Select Files
                  </Button>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Selected Images ({files.length})</h4>
                    <p className="text-sm text-muted-foreground">
                      {files.length === 1
                        ? '1 file selected'
                        : `${files.length} files selected (max 100)`}
                    </p>
                  </div>

                  <div className="rounded-md border">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-10 w-12 px-4 text-left align-middle font-medium"></th>
                          <th className="h-10 px-4 text-left align-middle font-medium">
                            File Name
                          </th>
                          <th className="h-10 px-4 text-left align-middle font-medium">Size</th>
                          <th className="h-10 w-12 px-4 text-left align-middle font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {files.map(file => (
                          <tr key={file.id} className="border-b">
                            <td className="p-2 align-middle">
                              <div className="h-10 w-10 overflow-hidden rounded-md border">
                                <img
                                  src={file.preview}
                                  alt={file.file.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="font-medium">{file.file.name}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-muted-foreground">
                                {formatFileSize(file.file.size)}
                              </span>
                            </td>
                            <td className="p-2 align-middle">
                              <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={files.length === 0 || isUploading}
              >
                Clear All
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={files.length === 0 || isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4" />
                    Analyze Images
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>View your previous image analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="mb-4 rounded-md bg-destructive/15 p-4 text-destructive">
                  {error}
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab('upload')}>
                    Back to Upload
                  </Button>
                </div>
              ) : predictions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No analysis history</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Upload images to see your analysis results here
                  </p>
                  <Button onClick={() => setActiveTab('upload')}>Upload Images</Button>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {predictions.map((prediction, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-1 items-center justify-between pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              Upload #{predictions.length - index}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(prediction.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge>
                              {prediction.predictions && prediction.predictions.length
                                ? `${prediction.predictions.length} image${
                                    prediction.predictions.length !== 1 ? 's' : ''
                                  }`
                                : '0 images'}
                            </Badge>
                            {prediction.predictions && prediction.predictions.length > 0 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={e => {
                                        e.stopPropagation()
                                        exportToCsv(prediction)
                                      }}
                                    >
                                      <Download className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Download as CSV</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {prediction.predictions && prediction.predictions.length > 0 ? (
                          <div className="rounded-md border mt-2">
                            <table className="w-full caption-bottom text-sm">
                              <thead>
                                <tr className="border-b bg-muted/50">
                                  <th className="h-10 px-4 text-left align-middle font-medium">
                                    Filename
                                  </th>
                                  <th className="h-10 px-4 text-left align-middle font-medium">
                                    Result
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {prediction.predictions.map((pred, idx) => (
                                  <tr key={idx} className="border-b">
                                    <td className="p-3 align-middle">{pred.filename}</td>
                                    <td className="p-3 align-middle">
                                      <span
                                        className={cn(
                                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                                          pred.hasTumor
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                                        )}
                                      >
                                        {pred.hasTumor ? 'Tumor Detected' : 'No Tumor Detected'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="mt-2 rounded-md bg-muted p-4 text-sm">
                            No predictions available for this batch
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UploadPage
