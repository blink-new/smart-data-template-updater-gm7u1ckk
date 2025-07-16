import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { History, FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import { ProcessingJob } from '@/App'

interface ProcessingHistoryProps {
  jobs: ProcessingJob[]
}

export function ProcessingHistory({ jobs }: ProcessingHistoryProps) {
  const getStatusIcon = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusBadge = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-700">Completed</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Processing</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const truncateFileName = (fileName: string, maxLength: number = 20) => {
    if (fileName.length <= maxLength) return fileName
    const extension = fileName.split('.').pop()
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'))
    const truncated = nameWithoutExt.substring(0, maxLength - extension!.length - 4) + '...'
    return `${truncated}.${extension}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Processing History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getStatusIcon(job.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-3 w-3 text-slate-400 flex-shrink-0" />
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {truncateFileName(job.fileName)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-slate-500">
                        {formatTime(job.timestamp)}
                      </p>
                      {job.templateType && (
                        <>
                          <span className="text-xs text-slate-400">•</span>
                          <p className="text-xs text-slate-500 capitalize">
                            {job.templateType.replace('-', ' ')}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {getStatusBadge(job.status)}
                  {job.status === 'completed' && job.extractedData && (
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="p-3 bg-slate-100 rounded-full w-fit mx-auto mb-3">
              <History className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">No processing history</p>
            <p className="text-xs text-slate-500 mt-1">
              Your processed files will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}