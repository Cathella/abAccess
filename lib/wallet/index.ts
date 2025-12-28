import type {
  WalletTransaction,
  PaymentMethodType,
  WalletTransactionType,
  WalletTransactionStatus,
  TopUpData,
} from '@/types'

/**
 * Generate a unique transaction ID
 * Format: TXN-YYYY-XXXXX (e.g., TXN-2025-00891)
 */
export function generateTransactionId(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0')
  return `TXN-${year}-${randomNum}`
}

/**
 * Calculate processing fee based on payment method and amount
 * @param amount - Transaction amount
 * @param paymentMethod - Payment method type
 * @returns Processing fee
 */
export function calculateProcessingFee(
  amount: number,
  paymentMethod: PaymentMethodType
): number {
  switch (paymentMethod) {
    case 'mtn_momo':
    case 'airtel_money':
      // 2% fee for mobile money, minimum 500 UGX
      return Math.max(500, Math.round(amount * 0.02))
    case 'card':
      // 2.5% fee for card payments, minimum 1000 UGX
      return Math.max(1000, Math.round(amount * 0.025))
    default:
      return 0
  }
}

/**
 * Format currency amount in UGX
 * @param amount - Amount to format
 * @param showSymbol - Whether to show currency symbol
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, showSymbol: boolean = true): string {
  const formatted = amount.toLocaleString('en-UG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return showSymbol ? `UGX ${formatted}` : formatted
}

/**
 * Format short currency (e.g., "50K", "1.2M")
 * @param amount - Amount to format
 * @returns Formatted short currency
 */
export function formatShortCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`
  }
  return amount.toString()
}

/**
 * Get filtered transactions by type
 * @param transactions - All transactions
 * @param filter - Filter type
 * @returns Filtered transactions
 */
export function getFilteredTransactions(
  transactions: WalletTransaction[],
  filter: 'all' | WalletTransactionType
): WalletTransaction[] {
  if (filter === 'all') {
    return transactions
  }
  return transactions.filter((t) => t.type === filter)
}

/**
 * Group transactions by month
 * @param transactions - All transactions
 * @returns Transactions grouped by month
 */
export function groupTransactionsByMonth(
  transactions: WalletTransaction[]
): Record<string, WalletTransaction[]> {
  const grouped: Record<string, WalletTransaction[]> = {}

  transactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt)
    const monthYear = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })

    if (!grouped[monthYear]) {
      grouped[monthYear] = []
    }

    grouped[monthYear].push(transaction)
  })

  return grouped
}

/**
 * Get month label for grouping (e.g., "January 2025", "This month", "Last month")
 * @param monthYear - Month and year string
 * @returns Formatted month label
 */
export function getMonthLabel(monthYear: string): string {
  const now = new Date()
  const currentMonthYear = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthYear = lastMonth.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  if (monthYear === currentMonthYear) {
    return 'This month'
  } else if (monthYear === lastMonthYear) {
    return 'Last month'
  }

  return monthYear
}

/**
 * Process top up payment
 * @param data - Top up data
 * @returns Promise with transaction result
 */
export async function processTopUp(
  data: TopUpData
): Promise<{
  success: boolean
  transaction?: WalletTransaction
  error?: string
}> {
  try {
    // Calculate fee
    const fee = calculateProcessingFee(data.amount, data.paymentMethod)
    const totalAmount = data.amount + fee

    // Generate transaction ID
    const transactionId = generateTransactionId()

    // TODO: Integrate with actual payment gateway
    // For now, simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create transaction object
    const transaction: WalletTransaction = {
      id: crypto.randomUUID(),
      type: 'top_up',
      amount: data.amount,
      fee,
      status: 'completed',
      paymentMethod: data.paymentMethod,
      phoneNumber: data.phoneNumber,
      cardLast4: data.cardDetails
        ? data.cardDetails.number.slice(-4)
        : undefined,
      transactionId,
      createdAt: new Date().toISOString(),
    }

    return {
      success: true,
      transaction,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process payment',
    }
  }
}

/**
 * Get payment method display name
 * @param type - Payment method type
 * @returns Display name
 */
export function getPaymentMethodName(type: PaymentMethodType): string {
  switch (type) {
    case 'mtn_momo':
      return 'MTN Mobile Money'
    case 'airtel_money':
      return 'Airtel Money'
    case 'card':
      return 'Card Payment'
    default:
      return 'Unknown'
  }
}

/**
 * Get transaction status badge color
 * @param status - Transaction status
 * @returns Tailwind color class
 */
export function getStatusColor(status: WalletTransactionStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-success-100 text-success-900'
    case 'pending':
      return 'bg-warning-100 text-warning-900'
    case 'failed':
      return 'bg-error-100 text-error-900'
    default:
      return 'bg-neutral-200 text-neutral-700'
  }
}

/**
 * Get transaction type icon
 * @param type - Transaction type
 * @returns Icon name (for lucide-react)
 */
export function getTransactionIcon(type: WalletTransactionType): string {
  switch (type) {
    case 'top_up':
      return 'ArrowDownToLine'
    case 'purchase':
      return 'ShoppingBag'
    default:
      return 'Receipt'
  }
}

/**
 * Validate phone number for mobile money
 * @param phone - Phone number
 * @param provider - Payment provider
 * @returns Validation result
 */
export function validateMobileMoneyNumber(
  phone: string,
  provider: 'mtn_momo' | 'airtel_money'
): { valid: boolean; error?: string } {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '')

  // Check if it's a valid Uganda number
  const ugandaRegex = /^(\+256|0)(3[1-9]|7[0-8])\d{7}$/

  if (!ugandaRegex.test(cleaned)) {
    return {
      valid: false,
      error: 'Please enter a valid Uganda phone number',
    }
  }

  // Normalize to format: 0XXXXXXXXX
  const normalized = cleaned.replace(/^\+256/, '0')

  // Check provider-specific prefixes
  if (provider === 'mtn_momo') {
    // MTN: 077, 078, 076, 039
    if (!/^0(77|78|76|39)\d{7}$/.test(normalized)) {
      return {
        valid: false,
        error: 'This number is not registered with MTN Mobile Money',
      }
    }
  } else if (provider === 'airtel_money') {
    // Airtel: 075, 070, 074
    if (!/^0(75|70|74)\d{7}$/.test(normalized)) {
      return {
        valid: false,
        error: 'This number is not registered with Airtel Money',
      }
    }
  }

  return { valid: true }
}

/**
 * Format phone number for display
 * @param phone - Phone number
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '')

  // Convert to format: 0XXX XXX XXX
  const normalized = cleaned.replace(/^\+256/, '0')

  if (normalized.length === 10) {
    return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`
  }

  return phone
}

/**
 * Mask phone number for display
 * @param phone - Phone number
 * @returns Masked phone number (e.g., "077X XXX X234")
 */
export function maskPhoneNumber(phone: string): string {
  const formatted = formatPhoneNumber(phone)
  const parts = formatted.split(' ')

  if (parts.length === 3) {
    return `${parts[0].slice(0, 3)}X XXX X${parts[2].slice(-3)}`
  }

  return phone
}

/**
 * Validate card number (basic Luhn algorithm)
 * @param cardNumber - Card number
 * @returns Validation result
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '')

  if (!/^\d{13,19}$/.test(cleaned)) {
    return false
  }

  // Luhn algorithm
  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Get card brand from card number
 * @param cardNumber - Card number
 * @returns Card brand
 */
export function getCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '')

  if (/^4/.test(cleaned)) {
    return 'Visa'
  } else if (/^5[1-5]/.test(cleaned)) {
    return 'Mastercard'
  } else if (/^3[47]/.test(cleaned)) {
    return 'American Express'
  }

  return 'Unknown'
}
