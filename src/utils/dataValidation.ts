import { ExtractedData } from '@/App'

export interface ValidationResult {
  isValid: boolean
  confidence: number
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export interface DataQualityMetrics {
  relevanceScore: number
  completenessScore: number
  accuracyScore: number
  overallScore: number
}

// Enhanced data validation for different template types
export const validateExtractedData = (
  data: ExtractedData, 
  templateType: string, 
  originalInput: string
): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    confidence: 0,
    errors: [],
    warnings: [],
    suggestions: []
  }

  // Check if input is nonsense or unrelated
  const inputQuality = assessInputQuality(originalInput, templateType)
  
  if (inputQuality.overallScore < 0.3) {
    result.isValid = false
    result.confidence = inputQuality.overallScore * 100
    result.errors.push('Input appears to be unrelated to the selected template type')
    result.suggestions.push('Please provide data relevant to ' + getTemplateDescription(templateType))
    return result
  }

  // Template-specific validation
  switch (templateType) {
    case 'financial-statement':
    case 'comprehensive-financial':
      return validateFinancialData(data, result, inputQuality)
    case 'balance-sheet':
      return validateBalanceSheetData(data, result, inputQuality)
    case 'invoice':
      return validateInvoiceData(data, result, inputQuality)
    case 'employee-report':
      return validateEmployeeData(data, result, inputQuality)
    default:
      return validateGenericData(data, result, inputQuality)
  }
}

// Assess the quality and relevance of input data
const assessInputQuality = (input: string, templateType: string): DataQualityMetrics => {
  const metrics: DataQualityMetrics = {
    relevanceScore: 0,
    completenessScore: 0,
    accuracyScore: 0,
    overallScore: 0
  }

  // Check for nonsense patterns
  const nonsensePatterns = [
    /^[a-z]{1,3}(\s[a-z]{1,3}){10,}$/i, // Random short words
    /^[!@#$%^&*()]{5,}$/, // Special characters only
    /^(\w)\1{10,}$/, // Repeated characters
    /lorem ipsum/i, // Lorem ipsum text
    /test{2,}|sample{2,}/i, // Test/sample repeated
    /^[0-9\s]{50,}$/, // Only numbers and spaces
    /^[.,;:!?]{10,}$/ // Only punctuation
  ]

  const isNonsense = nonsensePatterns.some(pattern => pattern.test(input.trim()))
  if (isNonsense) {
    return { ...metrics, overallScore: 0.1 }
  }

  // Check relevance based on template type
  metrics.relevanceScore = calculateRelevanceScore(input, templateType)
  
  // Check completeness (presence of expected data types)
  metrics.completenessScore = calculateCompletenessScore(input, templateType)
  
  // Check accuracy (valid formats, reasonable values)
  metrics.accuracyScore = calculateAccuracyScore(input)
  
  // Calculate overall score
  metrics.overallScore = (
    metrics.relevanceScore * 0.4 + 
    metrics.completenessScore * 0.3 + 
    metrics.accuracyScore * 0.3
  )

  return metrics
}

const calculateRelevanceScore = (input: string, templateType: string): number => {
  const lowerInput = input.toLowerCase()
  
  const templateKeywords: Record<string, string[]> = {
    'financial-statement': [
      'revenue', 'income', 'profit', 'loss', 'expense', 'cost', 'sales', 
      'cogs', 'operating', 'net', 'gross', 'ebitda', 'margin', 'financial'
    ],
    'comprehensive-financial': [
      'revenue', 'income', 'profit', 'loss', 'expense', 'cost', 'sales',
      'assets', 'liabilities', 'equity', 'cash', 'debt', 'balance', 'statement',
      'depreciation', 'amortization', 'tax', 'interest', 'dividend'
    ],
    'balance-sheet': [
      'assets', 'liabilities', 'equity', 'cash', 'receivable', 'payable',
      'inventory', 'debt', 'capital', 'retained', 'current', 'non-current'
    ],
    'invoice': [
      'invoice', 'bill', 'amount', 'total', 'client', 'customer', 'date',
      'payment', 'due', 'service', 'product', 'quantity', 'price'
    ],
    'employee-report': [
      'employee', 'staff', 'salary', 'wage', 'performance', 'department',
      'position', 'hire', 'review', 'rating', 'bonus', 'benefits'
    ]
  }

  const keywords = templateKeywords[templateType] || []
  const matchCount = keywords.filter(keyword => lowerInput.includes(keyword)).length
  
  return Math.min(matchCount / keywords.length, 1)
}

const calculateCompletenessScore = (input: string, templateType: string): number => {
  const hasNumbers = /\d/.test(input)
  const hasCurrency = /\$|USD|EUR|GBP|\d+\.\d{2}/.test(input)
  const hasPercentages = /%|\d+\s*percent/.test(input)
  const hasDates = /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}/.test(input)
  
  let score = 0
  
  if (templateType.includes('financial') || templateType === 'balance-sheet') {
    if (hasNumbers) score += 0.4
    if (hasCurrency) score += 0.4
    if (hasPercentages) score += 0.2
  } else if (templateType === 'invoice') {
    if (hasNumbers) score += 0.3
    if (hasCurrency) score += 0.4
    if (hasDates) score += 0.3
  } else if (templateType === 'employee-report') {
    if (hasNumbers) score += 0.3
    if (hasCurrency) score += 0.3
    if (hasDates) score += 0.2
    if (input.length > 50) score += 0.2
  }
  
  return Math.min(score, 1)
}

const calculateAccuracyScore = (input: string): number => {
  let score = 0.5 // Base score
  
  // Check for reasonable number formats
  const numbers = input.match(/\d+(?:,\d{3})*(?:\.\d{2})?/g)
  if (numbers && numbers.length > 0) {
    score += 0.2
  }
  
  // Check for proper currency formatting
  const currencies = input.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g)
  if (currencies && currencies.length > 0) {
    score += 0.2
  }
  
  // Penalize for obvious errors
  if (input.includes('undefined') || input.includes('null')) {
    score -= 0.3
  }
  
  // Check for reasonable text length
  if (input.length > 20 && input.length < 10000) {
    score += 0.1
  }
  
  return Math.min(Math.max(score, 0), 1)
}

// Template-specific validation functions
const validateFinancialData = (
  data: ExtractedData, 
  result: ValidationResult, 
  quality: DataQualityMetrics
): ValidationResult => {
  result.confidence = quality.overallScore * 100

  // Check for required financial fields
  const requiredFields = ['revenue', 'cogs', 'expenses']
  const missingFields = requiredFields.filter(field => !data[field] || data[field] === 0)
  
  if (missingFields.length > 0) {
    result.warnings.push(`Missing or zero values for: ${missingFields.join(', ')}`)
  }

  // Validate financial logic
  const revenue = Number(data.revenue) || 0
  const cogs = Number(data.cogs) || 0
  const expenses = Number(data.expenses) || 0
  
  if (cogs > revenue) {
    result.warnings.push('Cost of Goods Sold exceeds Revenue - please verify')
  }
  
  if (revenue > 0 && (cogs + expenses) > revenue * 1.5) {
    result.warnings.push('Total costs seem unusually high compared to revenue')
  }

  // Check for negative values where they shouldn't be
  if (revenue < 0) {
    result.errors.push('Revenue cannot be negative')
    result.isValid = false
  }

  if (result.errors.length === 0 && result.warnings.length === 0) {
    result.suggestions.push('Financial data looks good! Consider adding more detailed expense breakdowns.')
  }

  return result
}

const validateBalanceSheetData = (
  data: ExtractedData, 
  result: ValidationResult, 
  quality: DataQualityMetrics
): ValidationResult => {
  result.confidence = quality.overallScore * 100

  const assets = (Number(data.currentAssets) || 0) + (Number(data.fixedAssets) || 0)
  const liabilities = (Number(data.currentLiabilities) || 0) + (Number(data.longTermDebt) || 0)
  const equity = Number(data.equity) || 0

  // Balance sheet equation check
  const difference = Math.abs(assets - (liabilities + equity))
  if (difference > assets * 0.01) { // Allow 1% tolerance
    result.warnings.push('Balance sheet does not balance - Assets ≠ Liabilities + Equity')
  }

  if (assets === 0) {
    result.warnings.push('No asset values detected')
  }

  return result
}

const validateInvoiceData = (
  data: ExtractedData, 
  result: ValidationResult, 
  quality: DataQualityMetrics
): ValidationResult => {
  result.confidence = quality.overallScore * 100

  if (!data.amount || Number(data.amount) <= 0) {
    result.errors.push('Invoice amount is required and must be positive')
    result.isValid = false
  }

  if (!data.client || data.client.toString().trim().length === 0) {
    result.warnings.push('Client name is missing')
  }

  if (!data.invoiceNumber) {
    result.suggestions.push('Consider adding an invoice number for better tracking')
  }

  return result
}

const validateEmployeeData = (
  data: ExtractedData, 
  result: ValidationResult, 
  quality: DataQualityMetrics
): ValidationResult => {
  result.confidence = quality.overallScore * 100

  if (!data.employeeName) {
    result.warnings.push('Employee name is missing')
  }

  const salary = Number(data.salary) || 0
  if (salary > 0 && (salary < 20000 || salary > 500000)) {
    result.warnings.push('Salary amount seems unusual - please verify')
  }

  return result
}

const validateGenericData = (
  data: ExtractedData, 
  result: ValidationResult, 
  quality: DataQualityMetrics
): ValidationResult => {
  result.confidence = quality.overallScore * 100

  if (Object.keys(data).length === 0) {
    result.errors.push('No data could be extracted from the input')
    result.isValid = false
  }

  return result
}

const getTemplateDescription = (templateType: string): string => {
  const descriptions: Record<string, string> = {
    'financial-statement': 'financial data including revenue, costs, and expenses',
    'comprehensive-financial': 'comprehensive financial statements with income, balance sheet, and cash flow data',
    'balance-sheet': 'balance sheet data including assets, liabilities, and equity',
    'invoice': 'invoice data including amounts, client information, and dates',
    'employee-report': 'employee information including names, salaries, and performance data'
  }
  
  return descriptions[templateType] || 'relevant data for the selected template'
}

// Enhanced data extraction with better pattern matching
export const enhancedDataExtraction = (input: string, templateType: string): ExtractedData => {
  const data: ExtractedData = {}
  
  // More sophisticated pattern matching based on template type
  if (templateType === 'comprehensive-financial') {
    return extractComprehensiveFinancialData(input)
  } else if (templateType === 'financial-statement') {
    return extractFinancialStatementData(input)
  } else if (templateType === 'balance-sheet') {
    return extractBalanceSheetData(input)
  } else if (templateType === 'invoice') {
    return extractInvoiceData(input)
  } else if (templateType === 'employee-report') {
    return extractEmployeeData(input)
  }
  
  return data
}

const extractComprehensiveFinancialData = (input: string): ExtractedData => {
  const data: ExtractedData = {}
  
  // Income Statement items
  const patterns = {
    revenue: /(?:revenue|sales|income|turnover)[:\s]*\$?([0-9,]+)/i,
    cogs: /(?:cogs|cost of goods sold|cost of sales)[:\s]*\$?([0-9,]+)/i,
    expenses: /(?:expenses|operating expenses|opex)[:\s]*\$?([0-9,]+)/i,
    depreciation: /(?:depreciation|amortization)[:\s]*\$?([0-9,]+)/i,
    interestExpense: /(?:interest expense|interest cost)[:\s]*\$?([0-9,]+)/i,
    taxExpense: /(?:tax expense|income tax|taxes)[:\s]*\$?([0-9,]+)/i,
    netIncome: /(?:net income|net profit|profit after tax)[:\s]*\$?([0-9,]+)/i,
    
    // Balance Sheet items
    cash: /(?:cash|cash equivalents)[:\s]*\$?([0-9,]+)/i,
    accountsReceivable: /(?:accounts receivable|receivables|ar)[:\s]*\$?([0-9,]+)/i,
    inventory: /(?:inventory|stock)[:\s]*\$?([0-9,]+)/i,
    ppe: /(?:ppe|property plant equipment|fixed assets)[:\s]*\$?([0-9,]+)/i,
    intangibleAssets: /(?:intangible assets|intangibles)[:\s]*\$?([0-9,]+)/i,
    accountsPayable: /(?:accounts payable|payables|ap)[:\s]*\$?([0-9,]+)/i,
    shortTermDebt: /(?:short.?term debt|current debt)[:\s]*\$?([0-9,]+)/i,
    longTermDebt: /(?:long.?term debt|non.?current debt)[:\s]*\$?([0-9,]+)/i,
    shareCapital: /(?:share capital|capital stock|equity)[:\s]*\$?([0-9,]+)/i,
    retainedEarnings: /(?:retained earnings|accumulated earnings)[:\s]*\$?([0-9,]+)/i,
    
    // Cash Flow items
    capex: /(?:capex|capital expenditure|capital spending)[:\s]*\$?([0-9,]+)/i,
    workingCapitalChange: /(?:working capital|wc change)[:\s]*\$?([0-9,]+)/i,
    debtProceeds: /(?:debt proceeds|borrowings)[:\s]*\$?([0-9,]+)/i,
    debtRepayments: /(?:debt repayments|debt payments)[:\s]*\$?([0-9,]+)/i,
    dividendsPaid: /(?:dividends paid|dividend payments)[:\s]*\$?([0-9,]+)/i,
    beginningCash: /(?:beginning cash|opening cash)[:\s]*\$?([0-9,]+)/i
  }
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = input.match(pattern)
    if (match) {
      data[key] = parseInt(match[1].replace(/,/g, ''))
    }
  })
  
  return data
}

const extractFinancialStatementData = (input: string): ExtractedData => {
  const data: ExtractedData = {}
  
  const patterns = {
    revenue: /(?:revenue|sales|income)[:\s]*\$?([0-9,]+)/i,
    cogs: /(?:cogs|cost of goods sold)[:\s]*\$?([0-9,]+)/i,
    expenses: /(?:expenses|operating expenses)[:\s]*\$?([0-9,]+)/i,
    netIncome: /(?:net income|profit)[:\s]*\$?([0-9,]+)/i
  }
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = input.match(pattern)
    if (match) {
      data[key] = parseInt(match[1].replace(/,/g, ''))
    }
  })
  
  return data
}

const extractBalanceSheetData = (input: string): ExtractedData => {
  const data: ExtractedData = {}
  
  const patterns = {
    currentAssets: /(?:current assets)[:\s]*\$?([0-9,]+)/i,
    fixedAssets: /(?:fixed assets|non.?current assets)[:\s]*\$?([0-9,]+)/i,
    currentLiabilities: /(?:current liabilities)[:\s]*\$?([0-9,]+)/i,
    longTermDebt: /(?:long.?term debt|non.?current liabilities)[:\s]*\$?([0-9,]+)/i,
    equity: /(?:equity|shareholders equity)[:\s]*\$?([0-9,]+)/i
  }
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = input.match(pattern)
    if (match) {
      data[key] = parseInt(match[1].replace(/,/g, ''))
    }
  })
  
  return data
}

const extractInvoiceData = (input: string): ExtractedData => {
  const data: ExtractedData = {}
  
  const patterns = {
    invoiceNumber: /(?:invoice|inv)[#\s]*([A-Z0-9-]+)/i,
    date: /(?:date)[:\s]*([0-9/-]+)/i,
    amount: /(?:total|amount)[:\s]*\$?([0-9,.]+)/i,
    client: /(?:client|customer|to)[:\s]*([A-Za-z\s]+)/i
  }
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = input.match(pattern)
    if (match) {
      if (key === 'amount') {
        data[key] = parseFloat(match[1].replace(/,/g, ''))
      } else {
        data[key] = match[1].trim()
      }
    }
  })
  
  return data
}

const extractEmployeeData = (input: string): ExtractedData => {
  const data: ExtractedData = {}
  
  const patterns = {
    employeeName: /(?:employee|name)[:\s]*([A-Za-z\s]+)/i,
    department: /(?:department|dept)[:\s]*([A-Za-z\s]+)/i,
    position: /(?:position|title|role)[:\s]*([A-Za-z\s]+)/i,
    salary: /(?:salary|wage)[:\s]*\$?([0-9,]+)/i,
    performanceScore: /(?:performance|score|rating)[:\s]*([0-9.]+)/i,
    startDate: /(?:start date|hire date)[:\s]*([0-9/-]+)/i
  }
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = input.match(pattern)
    if (match) {
      if (key === 'salary') {
        data[key] = parseInt(match[1].replace(/,/g, ''))
      } else {
        data[key] = match[1].trim()
      }
    }
  })
  
  return data
}