import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, Image, Table, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ExtractedData } from '@/App'

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
  const { toast } = useToast()

  const generateJobId = () => `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const simulateDataExtraction = useCallback(async (input: string, fileName: string = 'text-input') => {
    const jobId = generateJobId()
    onProcessingStart(jobId, fileName)
    setIsProcessing(true)

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock data extraction based on template type
      let extractedData: ExtractedData = {}

      if (selectedTemplate === 'financial-statement') {
        // Extract financial data patterns
        const revenueMatch = input.match(/revenue[:\s]*\$?([0-9,]+)/i)
        const cogsMatch = input.match(/(?:cogs|cost of goods sold)[:\s]*\$?([0-9,]+)/i)
        const expensesMatch = input.match(/(?:expenses|operating expenses)[:\s]*\$?([0-9,]+)/i)
        const netIncomeMatch = input.match(/(?:net income|profit)[:\s]*\$?([0-9,]+)/i)

        extractedData = {
          revenue: revenueMatch ? parseInt(revenueMatch[1].replace(/,/g, '')) : 0,
          cogs: cogsMatch ? parseInt(cogsMatch[1].replace(/,/g, '')) : 0,
          expenses: expensesMatch ? parseInt(expensesMatch[1].replace(/,/g, '')) : 0,
          netIncome: netIncomeMatch ? parseInt(netIncomeMatch[1].replace(/,/g, '')) : 0,
          grossProfit: (revenueMatch && cogsMatch) ? 
            parseInt(revenueMatch[1].replace(/,/g, '')) - parseInt(cogsMatch[1].replace(/,/g, '')) : 0
        }
      } else if (selectedTemplate === 'invoice') {
        const invoiceNumberMatch = input.match(/(?:invoice|inv)[#\s]*([A-Z0-9-]+)/i)
        const dateMatch = input.match(/(?:date)[:\s]*([0-9\/\-]+)/i)
        const amountMatch = input.match(/(?:total|amount)[:\s]*\$?([0-9,\.]+)/i)
        const clientMatch = input.match(/(?:client|customer|to)[:\s]*([A-Za-z\s]+)/i)

        extractedData = {
          invoiceNumber: invoiceNumberMatch ? invoiceNumberMatch[1] : 'INV-001',
          date: dateMatch ? dateMatch[1] : new Date().toLocaleDateString(),
          amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
          client: clientMatch ? clientMatch[1].trim() : 'Client Name'
        }
      }

      onDataExtracted(extractedData, jobId)
      toast({
        title: "Data extracted successfully",
        description: `Processed ${fileName} and populated ${selectedTemplate} template`
      })
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