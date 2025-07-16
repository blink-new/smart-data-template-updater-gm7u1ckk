import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, Image, Table, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ExtractedData } from '@/App'
import { validateExtractedData, enhancedDataExtraction, ValidationResult } from '@/utils/dataValidation'

interface DataInputZoneProps {
  onProcessingStart: (jobId: string, fileName: string) => void
  onDataExtracted: (data: ExtractedData, jobId: string) => void
  onProcessingError: (jobId: string) => void
  selectedTemplate: string
}

export function DataInputZone({ 
  onProcessingStart, 
  onDataExtracted, 
  onProcessingError,
  selectedTemplate 
}: DataInputZoneProps) {
  const [textInput, setTextInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const { toast } = useToast()

  const generateJobId = () => `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const simulateDataExtraction = useCallback(async (input: string, fileName: string = 'text-input') => {
    const jobId = generateJobId()
    onProcessingStart(jobId, fileName)
    setIsProcessing(true)
    setValidationResult(null)

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Use enhanced data extraction
      const extractedData = enhancedDataExtraction(input, selectedTemplate)

      // Validate the extracted data
      const validation = validateExtractedData(extractedData, selectedTemplate, input)
      setValidationResult(validation)

      if (!validation.isValid) {
        onProcessingError(jobId)
        toast({
          title: "Data validation failed",
          description: validation.errors[0] || "The input data doesn't match the selected template",
          variant: "destructive"
        })
        return
      }

      onDataExtracted(extractedData, jobId)
      
      // Show validation feedback
      if (validation.warnings.length > 0) {
        toast({
          title: "Data extracted with warnings",
          description: `Confidence: ${Math.round(validation.confidence)}% - ${validation.warnings[0]}`,
          variant: "default"
        })
      } else {
        toast({
          title: "Data extracted successfully",
          description: `Confidence: ${Math.round(validation.confidence)}% - Processed ${fileName}`,
        })
      }
    } catch (error) {
      onProcessingError(jobId)
      toast({
        title: "Processing failed",
        description: "Failed to extract data from the input",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }, [selectedTemplate, onProcessingStart, onDataExtracted, onProcessingError, toast])

  const handleFileUpload = useCallback(async (files: FileList) => {
    const file = files[0]
    if (!file) return

    const fileName = file.name
    const fileType = file.type

    // Simulate reading file content
    if (fileType.includes('text') || fileName.endsWith('.csv')) {
      const text = await file.text()
      await simulateDataExtraction(text, fileName)
    } else {
      // For other file types, simulate extraction
      const mockData = `Revenue: $100,000\nCOGS: $50,000\nExpenses: $30,000\nNet Income: $20,000`
      await simulateDataExtraction(mockData, fileName)
    }
  }, [simulateDataExtraction])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleTextProcess = () => {
    if (!textInput.trim()) {
      toast({
        title: "No input provided",
        description: "Please enter some text to process",
        variant: "destructive"
      })
      return
    }
    simulateDataExtraction(textInput)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Data Input</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Validation Feedback */}
        {validationResult && (
          <div className="mb-4 space-y-2">
            {validationResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Validation Error:</strong> {validationResult.errors[0]}
                </AlertDescription>
              </Alert>
            )}
            
            {validationResult.warnings.length > 0 && validationResult.isValid && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> {validationResult.warnings[0]}
                  <div className="text-xs mt-1">Confidence: {Math.round(validationResult.confidence)}%</div>
                </AlertDescription>
              </Alert>
            )}
            
            {validationResult.suggestions.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Suggestion:</strong> {validationResult.suggestions[0]}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="text">Paste Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Table className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Image className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Supports Excel, PDF, Images, CSV, and Text files
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".xlsx,.xls,.pdf,.png,.jpg,.jpeg,.csv,.txt"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Paste your data here... (e.g., Revenue: $100,000, COGS: $50,000, Expenses: $30,000)"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <Button 
              onClick={handleTextProcess} 
              className="w-full"
              disabled={isProcessing || !textInput.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Process Text
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}