import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Zap, CheckCircle, AlertCircle } from 'lucide-react'

interface ProcessingStatusProps {
  isProcessing: boolean
}

export function ProcessingStatus({ isProcessing }: ProcessingStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>AI Processing</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Extracting data...</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Processing
              </Badge>
            </div>
            <Progress value={65} className="w-full" />
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>File uploaded successfully</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Content extracted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                <span>AI analyzing patterns...</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <span>Mapping to template fields</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="p-3 bg-slate-100 rounded-full w-fit mx-auto mb-3">
              <AlertCircle className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">Ready to process data</p>
            <p className="text-xs text-slate-500 mt-1">
              Upload a file or paste text to begin
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}