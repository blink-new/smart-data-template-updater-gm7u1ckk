import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, DollarSign, Hash, Calendar, User } from 'lucide-react'
import { ExtractedData } from '@/App'

interface ExtractedDataPanelProps {
  data: ExtractedData
}

export function ExtractedDataPanel({ data }: ExtractedDataPanelProps) {
  const dataEntries = Object.entries(data)
  
  const getFieldIcon = (key: string) => {
    if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('income') || 
        key.toLowerCase().includes('profit') || key.toLowerCase().includes('amount')) {
      return DollarSign
    }
    if (key.toLowerCase().includes('number') || key.toLowerCase().includes('id')) {
      return Hash
    }
    if (key.toLowerCase().includes('date')) {
      return Calendar
    }
    if (key.toLowerCase().includes('client') || key.toLowerCase().includes('customer')) {
      return User
    }
    return Database
  }

  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      if (value >= 1000) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        }).format(value)
      }
      return value.toString()
    }
    return value
  }

  const formatFieldName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Extracted Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dataEntries.length > 0 ? (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {dataEntries.map(([key, value]) => {
              const Icon = getFieldIcon(key)
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="p-1.5 bg-white rounded-md flex-shrink-0">
                      <Icon className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {formatFieldName(key)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs flex-shrink-0 ml-2">
                    {formatValue(value)}
                  </Badge>
                </div>
              )
            })}
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                {dataEntries.length} field{dataEntries.length !== 1 ? 's' : ''} extracted
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="p-3 bg-slate-100 rounded-full w-fit mx-auto mb-3">
              <Database className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">No data extracted yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Process a file or text to see extracted fields
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}