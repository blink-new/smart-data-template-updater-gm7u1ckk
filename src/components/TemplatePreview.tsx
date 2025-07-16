import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download, Eye, FileText, ChevronDown, FileSpreadsheet, FileImage, Code, Table } from 'lucide-react'
import { ExtractedData } from '@/App'
import { exportTemplate, ExportFormat } from '@/utils/exportUtils'
import { useToast } from '@/hooks/use-toast'

interface TemplatePreviewProps {
  templateType: string
  data: ExtractedData
}

export function TemplatePreview({ templateType, data }: TemplatePreviewProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)
    try {
      await exportTemplate({
        format,
        templateType,
        data,
        templateName: getTemplateName()
      })
      toast({
        title: "Export successful",
        description: `Template exported as ${format.toUpperCase()}`
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export template. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }
  const renderComprehensiveFinancial = () => (
    <div className="space-y-8">
      {/* Income Statement */}
      <div className="space-y-4">
        <div className="text-center border-b pb-4">
          <h2 className="text-xl font-bold text-slate-900">STATEMENT OF COMPREHENSIVE INCOME</h2>
          <p className="text-sm text-slate-600">For the Year Ended December 31, 2024</p>
        </div>
        
        <div className="space-y-3">
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
            <span className="font-mono font-semibold">${((data.revenue || 0) - (data.cogs || 0)).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Operating Expenses</span>
            <span className="font-mono">-${(data.expenses || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Depreciation & Amortization</span>
            <span className="font-mono">-${(data.depreciation || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b bg-slate-50 px-2 rounded">
            <span className="font-semibold">Operating Income</span>
            <span className="font-mono font-semibold">${(((data.revenue || 0) - (data.cogs || 0) - (data.expenses || 0) - (data.depreciation || 0))).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Interest Expense</span>
            <span className="font-mono">-${(data.interestExpense || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Income Tax Expense</span>
            <span className="font-mono">-${(data.taxExpense || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-2 border-blue-200 bg-blue-50 px-2 rounded">
            <span className="font-bold text-blue-900">Net Income</span>
            <span className="font-mono font-bold text-blue-900">${(data.netIncome || (((data.revenue || 0) - (data.cogs || 0) - (data.expenses || 0) - (data.depreciation || 0) - (data.interestExpense || 0) - (data.taxExpense || 0)))).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Balance Sheet */}
      <div className="space-y-4">
        <div className="text-center border-b pb-4">
          <h2 className="text-xl font-bold text-slate-900">STATEMENT OF FINANCIAL POSITION</h2>
          <p className="text-sm text-slate-600">As of December 31, 2024</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 pb-2 border-b">ASSETS</h3>
            <div className="space-y-2">
              <h4 className="font-medium text-slate-700 text-sm">Current Assets:</h4>
              <div className="flex justify-between pl-4">
                <span className="text-sm">Cash and Cash Equivalents</span>
                <span className="font-mono text-sm">${(data.cash || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="text-sm">Accounts Receivable</span>
                <span className="font-mono text-sm">${(data.accountsReceivable || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="text-sm">Inventory</span>
                <span className="font-mono text-sm">${(data.inventory || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span className="text-sm">Total Current Assets</span>
                <span className="font-mono text-sm">${((data.cash || 0) + (data.accountsReceivable || 0) + (data.inventory || 0)).toLocaleString()}</span>
              </div>
              
              <h4 className="font-medium text-slate-700 text-sm pt-3">Non-Current Assets:</h4>
              <div className="flex justify-between pl-4">
                <span className="text-sm">Property, Plant & Equipment</span>
                <span className="font-mono text-sm">${(data.ppe || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="text-sm">Intangible Assets</span>
                <span className="font-mono text-sm">${(data.intangibleAssets || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold border-t-2 border-slate-900 pt-2">
                <span className="text-sm">TOTAL ASSETS</span>
                <span className="font-mono text-sm">${((data.cash || 0) + (data.accountsReceivable || 0) + (data.inventory || 0) + (data.ppe || 0) + (data.intangibleAssets || 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 pb-2 border-b">LIABILITIES & EQUITY</h3>
            <div className="space-y-2">
              <h4 className="font-medium text-slate-700 text-sm">Current Liabilities:</h4>
              <div className="flex justify-between pl-4">
                <span className="text-sm">Accounts Payable</span>
                <span className="font-mono text-sm">${(data.accountsPayable || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="text-sm">Short-term Debt</span>
                <span className="font-mono text-sm">${(data.shortTermDebt || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span className="text-sm">Total Current Liabilities</span>
                <span className="font-mono text-sm">${((data.accountsPayable || 0) + (data.shortTermDebt || 0)).toLocaleString()}</span>
              </div>
              
              <h4 className="font-medium text-slate-700 text-sm pt-3">Non-Current Liabilities:</h4>
              <div className="flex justify-between pl-4">
                <span className="text-sm">Long-term Debt</span>
                <span className="font-mono text-sm">${(data.longTermDebt || 0).toLocaleString()}</span>
              </div>
              
              <h4 className="font-medium text-slate-700 text-sm pt-3">Equity:</h4>
              <div className="flex justify-between pl-4">
                <span className="text-sm">Share Capital</span>
                <span className="font-mono text-sm">${(data.shareCapital || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="text-sm">Retained Earnings</span>
                <span className="font-mono text-sm">${(data.retainedEarnings || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold border-t-2 border-slate-900 pt-2">
                <span className="text-sm">TOTAL LIAB. & EQUITY</span>
                <span className="font-mono text-sm">${((data.accountsPayable || 0) + (data.shortTermDebt || 0) + (data.longTermDebt || 0) + (data.shareCapital || 0) + (data.retainedEarnings || 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Statement */}
      <div className="space-y-4">
        <div className="text-center border-b pb-4">
          <h2 className="text-xl font-bold text-slate-900">STATEMENT OF CASH FLOWS</h2>
          <p className="text-sm text-slate-600">For the Year Ended December 31, 2024</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Operating Activities</h3>
            <div className="space-y-1 pl-4">
              <div className="flex justify-between">
                <span className="text-sm">Net Income</span>
                <span className="font-mono text-sm">${(data.netIncome || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Depreciation & Amortization</span>
                <span className="font-mono text-sm">${(data.depreciation || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Changes in Working Capital</span>
                <span className="font-mono text-sm">${(data.workingCapitalChange || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span className="text-sm">Net Cash from Operating Activities</span>
                <span className="font-mono text-sm">${((data.netIncome || 0) + (data.depreciation || 0) + (data.workingCapitalChange || 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Investing Activities</h3>
            <div className="space-y-1 pl-4">
              <div className="flex justify-between">
                <span className="text-sm">Capital Expenditures</span>
                <span className="font-mono text-sm">-${(data.capex || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span className="text-sm">Net Cash from Investing Activities</span>
                <span className="font-mono text-sm">-${(data.capex || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Financing Activities</h3>
            <div className="space-y-1 pl-4">
              <div className="flex justify-between">
                <span className="text-sm">Debt Proceeds</span>
                <span className="font-mono text-sm">${(data.debtProceeds || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Debt Repayments</span>
                <span className="font-mono text-sm">-${(data.debtRepayments || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Dividends Paid</span>
                <span className="font-mono text-sm">-${(data.dividendsPaid || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span className="text-sm">Net Cash from Financing Activities</span>
                <span className="font-mono text-sm">${((data.debtProceeds || 0) - (data.debtRepayments || 0) - (data.dividendsPaid || 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t-2 border-slate-900 pt-3">
            <div className="flex justify-between font-semibold">
              <span>Net Change in Cash</span>
              <span className="font-mono">${(((data.netIncome || 0) + (data.depreciation || 0) + (data.workingCapitalChange || 0)) - (data.capex || 0) + ((data.debtProceeds || 0) - (data.debtRepayments || 0) - (data.dividendsPaid || 0))).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash at Beginning of Year</span>
              <span className="font-mono">${(data.beginningCash || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Cash at End of Year</span>
              <span className="font-mono">${((data.beginningCash || 0) + (((data.netIncome || 0) + (data.depreciation || 0) + (data.workingCapitalChange || 0)) - (data.capex || 0) + ((data.debtProceeds || 0) - (data.debtRepayments || 0) - (data.dividendsPaid || 0)))).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes to Financial Statements */}
      <div className="space-y-4">
        <div className="text-center border-b pb-4">
          <h2 className="text-xl font-bold text-slate-900">NOTES TO FINANCIAL STATEMENTS</h2>
        </div>
        
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Note 1: Basis of Preparation</h3>
            <p className="text-slate-700 leading-relaxed">
              These financial statements have been prepared in accordance with International Financial Reporting Standards (IFRS) 
              and present the financial position, performance, and cash flows of the entity for the year ended December 31, 2024.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Note 2: Revenue Recognition</h3>
            <p className="text-slate-700 leading-relaxed">
              Revenue is recognized when control of goods or services is transferred to the customer at an amount that reflects 
              the consideration to which the entity expects to be entitled in exchange for those goods or services, in accordance with IFRS 15.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Note 3: Property, Plant and Equipment</h3>
            <p className="text-slate-700 leading-relaxed">
              Property, plant and equipment is stated at cost less accumulated depreciation and accumulated impairment losses. 
              Depreciation is calculated using the straight-line method over the estimated useful lives of the assets.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Note 4: Financial Instruments</h3>
            <p className="text-slate-700 leading-relaxed">
              Financial assets are classified as measured at amortized cost, fair value through other comprehensive income, 
              or fair value through profit or loss, based on the business model and contractual cash flow characteristics.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Note 5: Income Taxes</h3>
            <p className="text-slate-700 leading-relaxed">
              Income tax expense comprises current and deferred tax. Current tax is calculated based on taxable income for the year 
              using tax rates enacted or substantively enacted at the reporting date.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Note 6: Going Concern</h3>
            <p className="text-slate-700 leading-relaxed">
              The financial statements have been prepared on a going concern basis. Management has assessed the entity's ability 
              to continue as a going concern and believes that the entity has adequate resources to continue operations for the foreseeable future.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

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
              <span className="font-mono">${(data.currentAssets || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Fixed Assets</span>
              <span className="font-mono">${(data.fixedAssets || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total Assets</span>
              <span className="font-mono">${((data.currentAssets || 0) + (data.fixedAssets || 0)).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 pb-2 border-b">Liabilities & Equity</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Current Liabilities</span>
              <span className="font-mono">${(data.currentLiabilities || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Long-term Debt</span>
              <span className="font-mono">${(data.longTermDebt || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Equity</span>
              <span className="font-mono">${(data.equity || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total Liab. & Equity</span>
              <span className="font-mono">${((data.currentLiabilities || 0) + (data.longTermDebt || 0) + (data.equity || 0)).toLocaleString()}</span>
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
            <p className="font-medium">{data.employeeName || '[Employee Name]'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Department</label>
            <p className="font-medium">{data.department || '[Department]'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Position</label>
            <p className="font-medium">{data.position || '[Position]'}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-600">Performance Score</label>
            <p className="font-medium">{data.performanceScore || '0'}/5.0</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Salary</label>
            <p className="font-medium font-mono">${(data.salary || 0).toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Start Date</label>
            <p className="font-medium">{data.startDate || '[Start Date]'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const getTemplateContent = () => {
    switch (templateType) {
      case 'comprehensive-financial':
        return renderComprehensiveFinancial()
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
      case 'comprehensive-financial':
        return 'Comprehensive Financial Statements'
      case 'financial-statement':
        return 'Income Statement'
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" disabled={!hasData || isExporting}>
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export"}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileImage className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('docx')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as Word
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  <Code className="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <Table className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div id="template-preview" className="bg-white border rounded-lg p-6 min-h-[500px] max-h-[800px] overflow-y-auto relative">
          <div className="mb-4 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">{getTemplateName()}</span>
          </div>
          
          {getTemplateContent()}
        </div>
      </CardContent>
    </Card>
  )
}