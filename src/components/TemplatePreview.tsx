import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Eye, FileText } from 'lucide-react'
import { ExtractedData } from '@/App'

interface TemplatePreviewProps {
  templateType: string
  data: ExtractedData
}

export function TemplatePreview({ templateType, data }: TemplatePreviewProps) {
  const renderFinancialStatement = () => (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-xl font-bold text-slate-900">Income Statement</h2>
        <p className="text-sm text-slate-600">For the Year Ended December 31, 2024</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="font-medium">Revenue</span>
          <span className="font-mono">${(data.revenue || 0).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b">
          <span className="font-medium">Cost of Goods Sold</span>
          <span className="font-mono">-${(data.cogs || 0).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b bg-slate-50 px-2 rounded">
          <span className="font-semibold">Gross Profit</span>
          <span className="font-mono font-semibold">
            ${((data.revenue || 0) - (data.cogs || 0)).toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b">
          <span className="font-medium">Operating Expenses</span>
          <span className="font-mono">-${(data.expenses || 0).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-2 border-blue-200 bg-blue-50 px-2 rounded">
          <span className="font-bold text-blue-900">Net Income</span>
          <span className="font-mono font-bold text-blue-900">
            ${(data.netIncome || ((data.revenue || 0) - (data.cogs || 0) - (data.expenses || 0))).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )

  const renderInvoice = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">INVOICE</h2>
          <p className="text-sm text-slate-600 mt-1">#{data.invoiceNumber || 'INV-001'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600">Date</p>
          <p className="font-medium">{data.date || new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">From:</h3>
          <div className="text-sm text-slate-600">
            <p>Your Company Name</p>
            <p>123 Business Street</p>
            <p>City, State 12345</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">To:</h3>
          <div className="text-sm text-slate-600">
            <p className="font-medium">{data.client || 'Client Name'}</p>
            <p>Client Address</p>
            <p>City, State 12345</p>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-semibold">Description</th>
              <th className="text-right p-3 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">Professional Services</td>
              <td className="p-3 text-right font-mono">${(data.amount || 0).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between items-center py-2 border-t-2 border-slate-900">
            <span className="font-bold">Total:</span>
            <span className="font-bold font-mono text-lg">
              ${(data.amount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBalanceSheet = () => (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-xl font-bold text-slate-900">Balance Sheet</h2>
        <p className="text-sm text-slate-600">As of December 31, 2024</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 pb-2 border-b">Assets</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Current Assets</span>
              <span className="font-mono">${(data.currentAssets || 50000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Fixed Assets</span>
              <span className="font-mono">${(data.fixedAssets || 100000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total Assets</span>
              <span className="font-mono">${((data.currentAssets || 50000) + (data.fixedAssets || 100000)).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 pb-2 border-b">Liabilities & Equity</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Current Liabilities</span>
              <span className="font-mono">${(data.currentLiabilities || 20000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Long-term Debt</span>
              <span className="font-mono">${(data.longTermDebt || 50000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Equity</span>
              <span className="font-mono">${(data.equity || 80000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total Liab. & Equity</span>
              <span className="font-mono">${((data.currentLiabilities || 20000) + (data.longTermDebt || 50000) + (data.equity || 80000)).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEmployeeReport = () => (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-xl font-bold text-slate-900">Employee Report</h2>
        <p className="text-sm text-slate-600">Performance Summary</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-600">Employee Name</label>
            <p className="font-medium">{data.employeeName || 'John Doe'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Department</label>
            <p className="font-medium">{data.department || 'Engineering'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Position</label>
            <p className="font-medium">{data.position || 'Software Developer'}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-600">Performance Score</label>
            <p className="font-medium">{data.performanceScore || '4.2'}/5.0</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Salary</label>
            <p className="font-medium font-mono">${(data.salary || 75000).toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Start Date</label>
            <p className="font-medium">{data.startDate || '2023-01-15'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const getTemplateContent = () => {
    switch (templateType) {
      case 'financial-statement':
        return renderFinancialStatement()
      case 'invoice':
        return renderInvoice()
      case 'balance-sheet':
        return renderBalanceSheet()
      case 'employee-report':
        return renderEmployeeReport()
      default:
        return renderFinancialStatement()
    }
  }

  const getTemplateName = () => {
    switch (templateType) {
      case 'financial-statement':
        return 'Financial Statement'
      case 'invoice':
        return 'Invoice Template'
      case 'balance-sheet':
        return 'Balance Sheet'
      case 'employee-report':
        return 'Employee Report'
      default:
        return 'Template'
    }
  }

  const hasData = Object.keys(data).length > 0

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Template Preview</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={hasData ? "default" : "secondary"}>
              {hasData ? "Populated" : "Empty"}
            </Badge>
            <Button size="sm" variant="outline" disabled={!hasData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg p-6 min-h-[500px]">
          <div className="mb-4 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">{getTemplateName()}</span>
          </div>
          
          {getTemplateContent()}
          
          {!hasData && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="p-3 bg-slate-100 rounded-full w-fit mx-auto mb-3">
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600">Template ready for data</p>
                <p className="text-xs text-slate-500 mt-1">
                  Upload or paste data to populate this template
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}