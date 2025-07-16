import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import { ExtractedData } from '@/App'

export type ExportFormat = 'pdf' | 'docx' | 'xlsx' | 'json' | 'csv'

export interface ExportOptions {
  format: ExportFormat
  templateType: string
  data: ExtractedData
  templateName: string
}

// PDF Export using jsPDF and html2canvas
export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Template element not found')

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  const imgWidth = 210
  const pageHeight = 295
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  let heightLeft = imgHeight

  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(`${filename}.pdf`)
}

// Word Document Export using docx
export const exportToWord = async (templateType: string, data: ExtractedData, filename: string) => {
  let doc: Document

  if (templateType === 'comprehensive-financial') {
    doc = createComprehensiveFinancialWordDoc(data)
  } else if (templateType === 'financial-statement') {
    doc = createFinancialStatementWordDoc(data)
  } else if (templateType === 'invoice') {
    doc = createInvoiceWordDoc(data)
  } else {
    doc = createGenericWordDoc(templateType, data)
  }

  const buffer = await Packer.toBuffer(doc)
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  saveAs(blob, `${filename}.docx`)
}

// Excel Export using xlsx
export const exportToExcel = (templateType: string, data: ExtractedData, filename: string) => {
  const workbook = XLSX.utils.book_new()

  if (templateType === 'comprehensive-financial') {
    // Create multiple sheets for comprehensive financial statements
    const incomeSheet = createIncomeStatementSheet(data)
    const balanceSheet = createBalanceSheetSheet(data)
    const cashFlowSheet = createCashFlowSheet(data)
    const notesSheet = createNotesSheet(data)

    XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income Statement')
    XLSX.utils.book_append_sheet(workbook, balanceSheet, 'Balance Sheet')
    XLSX.utils.book_append_sheet(workbook, cashFlowSheet, 'Cash Flow')
    XLSX.utils.book_append_sheet(workbook, notesSheet, 'Notes')
  } else {
    const worksheet = createGenericSheet(templateType, data)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
  }

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

// JSON Export
export const exportToJSON = (data: ExtractedData, filename: string) => {
  const jsonData = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonData], { type: 'application/json' })
  saveAs(blob, `${filename}.json`)
}

// CSV Export
export const exportToCSV = (data: ExtractedData, filename: string) => {
  const headers = Object.keys(data)
  const values = Object.values(data)
  
  const csvContent = [
    headers.join(','),
    values.map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : v).join(',')
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  saveAs(blob, `${filename}.csv`)
}

// Helper functions for Word document creation
const createComprehensiveFinancialWordDoc = (data: ExtractedData): Document => {
  return new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "COMPREHENSIVE FINANCIAL STATEMENTS",
          heading: HeadingLevel.TITLE,
          alignment: 'center'
        }),
        new Paragraph({
          text: "For the Year Ended December 31, 2024",
          alignment: 'center'
        }),
        new Paragraph({ text: "" }),
        
        // Income Statement Section
        new Paragraph({
          text: "STATEMENT OF COMPREHENSIVE INCOME",
          heading: HeadingLevel.HEADING_1
        }),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Revenue")] }),
                new TableCell({ children: [new Paragraph(`$${(data.revenue || 0).toLocaleString()}`)] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Cost of Goods Sold")] }),
                new TableCell({ children: [new Paragraph(`($${(data.cogs || 0).toLocaleString()})`)] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Gross Profit")] }),
                new TableCell({ children: [new Paragraph(`$${((data.revenue || 0) - (data.cogs || 0)).toLocaleString()}`)] })
              ]
            })
          ]
        }),
        
        new Paragraph({ text: "" }),
        
        // Balance Sheet Section
        new Paragraph({
          text: "STATEMENT OF FINANCIAL POSITION",
          heading: HeadingLevel.HEADING_1
        }),
        
        // Notes Section
        new Paragraph({ text: "" }),
        new Paragraph({
          text: "NOTES TO FINANCIAL STATEMENTS",
          heading: HeadingLevel.HEADING_1
        }),
        new Paragraph({
          text: "Note 1: Basis of Preparation",
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({
          text: "These financial statements have been prepared in accordance with International Financial Reporting Standards (IFRS)."
        })
      ]
    }]
  })
}

const createFinancialStatementWordDoc = (data: ExtractedData): Document => {
  return new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "INCOME STATEMENT",
          heading: HeadingLevel.TITLE,
          alignment: 'center'
        }),
        new Paragraph({
          text: "For the Year Ended December 31, 2024",
          alignment: 'center'
        }),
        new Paragraph({ text: "" }),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Revenue")] }),
                new TableCell({ children: [new Paragraph(`$${(data.revenue || 0).toLocaleString()}`)] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Cost of Goods Sold")] }),
                new TableCell({ children: [new Paragraph(`($${(data.cogs || 0).toLocaleString()})`)] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Operating Expenses")] }),
                new TableCell({ children: [new Paragraph(`($${(data.expenses || 0).toLocaleString()})`)] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Net Income", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: `$${(data.netIncome || 0).toLocaleString()}`, bold: true })] })
              ]
            })
          ]
        })
      ]
    }]
  })
}

const createInvoiceWordDoc = (data: ExtractedData): Document => {
  return new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "INVOICE",
          heading: HeadingLevel.TITLE,
          alignment: 'center'
        }),
        new Paragraph({
          text: `Invoice #: ${data.invoiceNumber || 'INV-001'}`,
          alignment: 'right'
        }),
        new Paragraph({
          text: `Date: ${data.date || new Date().toLocaleDateString()}`,
          alignment: 'right'
        }),
        new Paragraph({ text: "" }),
        new Paragraph({
          text: `Client: ${data.client || 'Client Name'}`,
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({ text: "" }),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Description")] }),
                new TableCell({ children: [new Paragraph("Amount")] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Professional Services")] }),
                new TableCell({ children: [new Paragraph(`$${(data.amount || 0).toLocaleString()}`)] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Total", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: `$${(data.amount || 0).toLocaleString()}`, bold: true })] })
              ]
            })
          ]
        })
      ]
    }]
  })
}

const createGenericWordDoc = (templateType: string, data: ExtractedData): Document => {
  const children = [
    new Paragraph({
      text: templateType.toUpperCase().replace('-', ' '),
      heading: HeadingLevel.TITLE,
      alignment: 'center'
    }),
    new Paragraph({ text: "" })
  ]

  Object.entries(data).forEach(([key, value]) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${key}: `, bold: true }),
          new TextRun({ text: value.toString() })
        ]
      })
    )
  })

  return new Document({
    sections: [{ properties: {}, children }]
  })
}

// Helper functions for Excel sheet creation
const createIncomeStatementSheet = (data: ExtractedData) => {
  const sheetData = [
    ['INCOME STATEMENT'],
    ['For the Year Ended December 31, 2024'],
    [''],
    ['Revenue', data.revenue || 0],
    ['Cost of Goods Sold', -(data.cogs || 0)],
    ['Gross Profit', (data.revenue || 0) - (data.cogs || 0)],
    ['Operating Expenses', -(data.expenses || 0)],
    ['Operating Income', (data.revenue || 0) - (data.cogs || 0) - (data.expenses || 0)],
    ['Interest Expense', -(data.interestExpense || 0)],
    ['Income Before Tax', (data.revenue || 0) - (data.cogs || 0) - (data.expenses || 0) - (data.interestExpense || 0)],
    ['Income Tax Expense', -(data.taxExpense || 0)],
    ['Net Income', data.netIncome || 0]
  ]
  return XLSX.utils.aoa_to_sheet(sheetData)
}

const createBalanceSheetSheet = (data: ExtractedData) => {
  const sheetData = [
    ['BALANCE SHEET'],
    ['As of December 31, 2024'],
    [''],
    ['ASSETS'],
    ['Current Assets:'],
    ['Cash and Cash Equivalents', data.cash || 25000],
    ['Accounts Receivable', data.accountsReceivable || 15000],
    ['Inventory', data.inventory || 10000],
    ['Total Current Assets', (data.cash || 25000) + (data.accountsReceivable || 15000) + (data.inventory || 10000)],
    [''],
    ['Non-Current Assets:'],
    ['Property, Plant & Equipment', data.ppe || 100000],
    ['Intangible Assets', data.intangibleAssets || 5000],
    ['Total Non-Current Assets', (data.ppe || 100000) + (data.intangibleAssets || 5000)],
    [''],
    ['TOTAL ASSETS', (data.cash || 25000) + (data.accountsReceivable || 15000) + (data.inventory || 10000) + (data.ppe || 100000) + (data.intangibleAssets || 5000)],
    [''],
    ['LIABILITIES AND EQUITY'],
    ['Current Liabilities:'],
    ['Accounts Payable', data.accountsPayable || 12000],
    ['Short-term Debt', data.shortTermDebt || 8000],
    ['Total Current Liabilities', (data.accountsPayable || 12000) + (data.shortTermDebt || 8000)],
    [''],
    ['Non-Current Liabilities:'],
    ['Long-term Debt', data.longTermDebt || 50000],
    ['Total Non-Current Liabilities', data.longTermDebt || 50000],
    [''],
    ['Equity:'],
    ['Share Capital', data.shareCapital || 50000],
    ['Retained Earnings', data.retainedEarnings || 25000],
    ['Total Equity', (data.shareCapital || 50000) + (data.retainedEarnings || 25000)],
    [''],
    ['TOTAL LIABILITIES AND EQUITY', (data.accountsPayable || 12000) + (data.shortTermDebt || 8000) + (data.longTermDebt || 50000) + (data.shareCapital || 50000) + (data.retainedEarnings || 25000)]
  ]
  return XLSX.utils.aoa_to_sheet(sheetData)
}

const createCashFlowSheet = (data: ExtractedData) => {
  const sheetData = [
    ['CASH FLOW STATEMENT'],
    ['For the Year Ended December 31, 2024'],
    [''],
    ['OPERATING ACTIVITIES'],
    ['Net Income', data.netIncome || 0],
    ['Depreciation', data.depreciation || 10000],
    ['Changes in Working Capital', data.workingCapitalChange || -5000],
    ['Net Cash from Operating Activities', (data.netIncome || 0) + (data.depreciation || 10000) + (data.workingCapitalChange || -5000)],
    [''],
    ['INVESTING ACTIVITIES'],
    ['Capital Expenditures', -(data.capex || 15000)],
    ['Net Cash from Investing Activities', -(data.capex || 15000)],
    [''],
    ['FINANCING ACTIVITIES'],
    ['Debt Proceeds', data.debtProceeds || 0],
    ['Debt Repayments', -(data.debtRepayments || 5000)],
    ['Dividends Paid', -(data.dividendsPaid || 2000)],
    ['Net Cash from Financing Activities', (data.debtProceeds || 0) - (data.debtRepayments || 5000) - (data.dividendsPaid || 2000)],
    [''],
    ['Net Change in Cash', ((data.netIncome || 0) + (data.depreciation || 10000) + (data.workingCapitalChange || -5000)) - (data.capex || 15000) + ((data.debtProceeds || 0) - (data.debtRepayments || 5000) - (data.dividendsPaid || 2000))],
    ['Cash at Beginning of Year', data.beginningCash || 20000],
    ['Cash at End of Year', (data.beginningCash || 20000) + (((data.netIncome || 0) + (data.depreciation || 10000) + (data.workingCapitalChange || -5000)) - (data.capex || 15000) + ((data.debtProceeds || 0) - (data.debtRepayments || 5000) - (data.dividendsPaid || 2000)))]
  ]
  return XLSX.utils.aoa_to_sheet(sheetData)
}

const createNotesSheet = (data: ExtractedData) => {
  const sheetData = [
    ['NOTES TO FINANCIAL STATEMENTS'],
    [''],
    ['Note 1: Basis of Preparation'],
    ['These financial statements have been prepared in accordance with'],
    ['International Financial Reporting Standards (IFRS).'],
    [''],
    ['Note 2: Revenue Recognition'],
    ['Revenue is recognized when control of goods or services is transferred'],
    ['to the customer at an amount that reflects the consideration expected.'],
    [''],
    ['Note 3: Property, Plant and Equipment'],
    ['PPE is stated at cost less accumulated depreciation and impairment losses.'],
    ['Depreciation is calculated using the straight-line method.'],
    [''],
    ['Note 4: Financial Instruments'],
    ['Financial assets are classified as measured at amortized cost,'],
    ['fair value through other comprehensive income, or fair value through profit or loss.'],
    [''],
    ['Note 5: Income Taxes'],
    ['Income tax expense comprises current and deferred tax.'],
    ['Current tax is calculated based on taxable income for the year.']
  ]
  return XLSX.utils.aoa_to_sheet(sheetData)
}

const createGenericSheet = (templateType: string, data: ExtractedData) => {
  const sheetData = [
    [templateType.toUpperCase().replace('-', ' ')],
    [''],
    ['Field', 'Value']
  ]
  
  Object.entries(data).forEach(([key, value]) => {
    sheetData.push([key, value])
  })
  
  return XLSX.utils.aoa_to_sheet(sheetData)
}

// Main export function
export const exportTemplate = async (options: ExportOptions) => {
  const { format, templateType, data, templateName } = options
  const filename = `${templateName}_${new Date().toISOString().split('T')[0]}`

  try {
    switch (format) {
      case 'pdf':
        await exportToPDF('template-preview', filename)
        break
      case 'docx':
        await exportToWord(templateType, data, filename)
        break
      case 'xlsx':
        exportToExcel(templateType, data, filename)
        break
      case 'json':
        exportToJSON(data, filename)
        break
      case 'csv':
        exportToCSV(data, filename)
        break
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  } catch (error) {
    console.error('Export failed:', error)
    throw error
  }
}