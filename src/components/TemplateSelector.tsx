import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Receipt, BarChart3, Users } from 'lucide-react'

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

const templates = [
  {
    id: 'comprehensive-financial',
    name: 'Comprehensive Financial Statements',
    description: 'Full financial statements with income, balance sheet, cash flow & notes',
    icon: BarChart3,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'financial-statement',
    name: 'Income Statement',
    description: 'Income statement with revenue, costs, and profit metrics',
    icon: BarChart3,
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    id: 'balance-sheet',
    name: 'Balance Sheet',
    description: 'Assets, liabilities, and equity overview',
    icon: FileText,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'invoice',
    name: 'Invoice Template',
    description: 'Professional invoice with client details and amounts',
    icon: Receipt,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'employee-report',
    name: 'Employee Report',
    description: 'Staff information and performance metrics',
    icon: Users,
    color: 'bg-orange-100 text-orange-600'
  }
]

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Template Selection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {templates.map((template) => {
          const Icon = template.icon
          const isSelected = selectedTemplate === template.id
          
          return (
            <Button
              key={template.id}
              variant={isSelected ? "default" : "outline"}
              className={`w-full justify-start h-auto p-4 ${
                isSelected ? '' : 'hover:bg-slate-50'
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              <div className="flex items-start space-x-3 w-full min-w-0">
                <div className={`p-2 rounded-lg flex-shrink-0 ${template.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{template.name}</div>
                  <div className={`text-xs mt-1 leading-tight ${
                    isSelected ? 'text-blue-100' : 'text-slate-600'
                  }`}>
                    {template.description}
                  </div>
                </div>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}