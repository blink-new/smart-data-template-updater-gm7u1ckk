import React, { useState } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { DataInputZone } from '@/components/DataInputZone'
import { TemplateSelector } from '@/components/TemplateSelector'
import { ProcessingStatus } from '@/components/ProcessingStatus'
import { TemplatePreview } from '@/components/TemplatePreview'
import { ExtractedDataPanel } from '@/components/ExtractedDataPanel'
import { ProcessingHistory } from '@/components/ProcessingHistory'
import { FileText, Zap } from 'lucide-react'

export interface ExtractedData {
  [key: string]: string | number
}

export interface ProcessingJob {
  id: string
  fileName: string
  status: 'processing' | 'completed' | 'error'
  timestamp: Date
  extractedData?: ExtractedData
  templateType?: string
}

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('comprehensive-financial')
  const [extractedData, setExtractedData] = useState<ExtractedData>({})
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDataExtracted = (data: ExtractedData, jobId: string) => {
    setExtractedData(data)
    setProcessingJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'completed', extractedData: data, templateType: selectedTemplate }
          : job
      )
    )
    setIsProcessing(false)
  }

  const handleProcessingStart = (jobId: string, fileName: string) => {
    const newJob: ProcessingJob = {
      id: jobId,
      fileName,
      status: 'processing',
      timestamp: new Date()
    }
    setProcessingJobs(prev => [newJob, ...prev])
    setIsProcessing(true)
  }

  const handleProcessingError = (jobId: string) => {
    setProcessingJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'error' }
          : job
      )
    )
    setIsProcessing(false)
  }

  const handleDeleteJob = (jobId: string) => {
    setProcessingJobs(prev => prev.filter(job => job.id !== jobId))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Smart Data Template Updater</h1>
              <p className="text-sm text-slate-600">AI-powered data extraction and template population</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <FileText className="h-4 w-4" />
            <span>Ready to process</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          {/* Left Column - Input and Template Selection */}
          <div className="lg:col-span-1 space-y-6 min-h-0">
            <DataInputZone 
              onProcessingStart={handleProcessingStart}
              onDataExtracted={handleDataExtracted}
              onProcessingError={handleProcessingError}
              selectedTemplate={selectedTemplate}
            />
            
            <TemplateSelector 
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />

            <ProcessingHistory jobs={processingJobs} onDeleteJob={handleDeleteJob} />
          </div>

          {/* Middle Column - Processing Status and Extracted Data */}
          <div className="lg:col-span-1 space-y-6 min-h-0">
            <ProcessingStatus isProcessing={isProcessing} />
            
            <ExtractedDataPanel data={extractedData} />
          </div>

          {/* Right Column - Template Preview */}
          <div className="lg:col-span-2 min-h-0">
            <TemplatePreview 
              templateType={selectedTemplate}
              data={extractedData}
            />
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

export default App