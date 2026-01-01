import { createClient } from '@/lib/supabase/client'
import type {
  PackageType,
  UserPackageType,
  PackageUsage,
  PackageDisplayInfo,
  PackageCategoryType,
} from '@/types'

/**
 * Get user's packages
 */
export async function getUserPackages(userId: string): Promise<UserPackageType[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_packages')
      .select(`
        *,
        package:packages(*)
      `)
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false })

    if (error) throw error

    // Transform the data to match UserPackageType interface
    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      packageId: item.package_id,
      package: item.package,
      purchaseDate: item.purchase_date,
      expiryDate: item.expiry_date,
      completedDate: item.completed_date,
      totalVisits: item.total_visits,
      usedVisits: item.used_visits,
      remainingVisits: item.remaining_visits,
      status: item.status,
      usageHistory: item.usage_history || [],
    }))
  } catch (error) {
    console.error('Error fetching user packages:', error)
    return []
  }
}

/**
 * Get available packages for purchase
 */
export async function getAvailablePackages(): Promise<PackageType[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (error) throw error

    // Transform the data to match PackageType interface
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      visits: item.visits,
      validityDays: item.validity_days,
      copay: item.copay,
      facilities: item.facilities,
    }))
  } catch (error) {
    console.error('Error fetching available packages:', error)
    return []
  }
}

/**
 * Purchase a package
 */
export async function purchasePackage(
  userId: string,
  packageId: string
): Promise<{
  success: boolean
  userPackage?: UserPackageType
  error?: string
}> {
  try {
    const supabase = createClient()
    // Get package details
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single()

    if (packageError) throw packageError

    // Calculate expiry date
    const purchaseDate = new Date()
    const expiryDate = new Date(purchaseDate)
    expiryDate.setDate(expiryDate.getDate() + packageData.validity_days)

    // Create user package
    const { data, error } = await supabase
      .from('user_packages')
      .insert({
        user_id: userId,
        package_id: packageId,
        purchase_date: purchaseDate.toISOString(),
        expiry_date: expiryDate.toISOString(),
        total_visits: packageData.visits,
        used_visits: 0,
        remaining_visits: packageData.visits,
        status: 'active',
        usage_history: [],
      })
      .select(`
        *,
        package:packages(*)
      `)
      .single()

    if (error) throw error

    const userPackage: UserPackageType = {
      id: data.id,
      userId: data.user_id,
      packageId: data.package_id,
      package: data.package,
      purchaseDate: data.purchase_date,
      expiryDate: data.expiry_date,
      completedDate: data.completed_date,
      totalVisits: data.total_visits,
      usedVisits: data.used_visits,
      remainingVisits: data.remaining_visits,
      status: data.status,
      usageHistory: data.usage_history || [],
    }

    return {
      success: true,
      userPackage,
    }
  } catch (error) {
    console.error('Error purchasing package:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to purchase package',
    }
  }
}

/**
 * Purchase a package with custom package data (for browse packages)
 * This allows purchasing without requiring the package to exist in the packages table
 */
export async function purchasePackageWithData(
  userId: string,
  packageData: {
    id: string
    name: string
    category: PackageCategoryType
    price: number
    visits: number
    validityDays: number
    copay: number
    facilities: number
    description?: string
  }
): Promise<{
  success: boolean
  userPackage?: UserPackageType
  error?: string
}> {
  try {
    const supabase = createClient()

    // Calculate expiry date
    const purchaseDate = new Date()
    const expiryDate = new Date(purchaseDate)
    expiryDate.setDate(expiryDate.getDate() + packageData.validityDays)

    // Create user package with embedded package data
    const { data, error } = await supabase
      .from('user_packages')
      .insert({
        user_id: userId,
        package_id: packageData.id,
        purchase_date: purchaseDate.toISOString(),
        expiry_date: expiryDate.toISOString(),
        total_visits: packageData.visits,
        used_visits: 0,
        remaining_visits: packageData.visits,
        status: 'active',
        usage_history: [],
      })
      .select()
      .single()

    if (error) throw error

    const userPackage: UserPackageType = {
      id: data.id,
      userId: data.user_id,
      packageId: data.package_id,
      package: {
        id: packageData.id,
        name: packageData.name,
        category: packageData.category,
        description: packageData.description || `${packageData.visits} visits pack`,
        price: packageData.price,
        visits: packageData.visits,
        validityDays: packageData.validityDays,
        copay: packageData.copay,
        facilities: packageData.facilities,
      },
      purchaseDate: data.purchase_date,
      expiryDate: data.expiry_date,
      completedDate: data.completed_date,
      totalVisits: data.total_visits,
      usedVisits: data.used_visits,
      remainingVisits: data.remaining_visits,
      status: data.status,
      usageHistory: data.usage_history || [],
    }

    return {
      success: true,
      userPackage,
    }
  } catch (error) {
    console.error('Error purchasing package with data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to purchase package',
    }
  }
}

/**
 * Calculate package display info
 */
export function getPackageDisplayInfo(pkg: UserPackageType): PackageDisplayInfo {
  const daysUntilExpiry = getDaysUntilExpiry(pkg.expiryDate)
  const isExpiringSoon = daysUntilExpiry < 7 && daysUntilExpiry >= 0
  const isLowVisits = pkg.remainingVisits === 1
  const totalCopayPaid = getTotalCopayPaid(pkg.usageHistory)

  return {
    isExpiringSoon,
    isLowVisits,
    daysUntilExpiry,
    totalCopayPaid,
  }
}

/**
 * Check if package is expiring soon (< 7 days)
 */
export function isExpiringSoon(expiryDate: string): boolean {
  const days = getDaysUntilExpiry(expiryDate)
  return days < 7 && days >= 0
}

/**
 * Check if package has low visits (1 remaining)
 */
export function isLowVisits(remaining: number): boolean {
  return remaining === 1
}

/**
 * Get days until expiry
 */
export function getDaysUntilExpiry(expiryDate: string): number {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Calculate total co-pay paid for a package
 */
export function getTotalCopayPaid(usageHistory: PackageUsage[]): number {
  return usageHistory.reduce((total, usage) => total + usage.copayPaid, 0)
}

/**
 * Get icon name for package category
 */
export function getPackageIcon(category: PackageCategoryType): string {
  const iconMap: Record<PackageCategoryType, string> = {
    consultations: 'stethoscope',
    lab_tests: 'flask',
    pharmacy: 'pill',
    dental: 'tooth',
    optical: 'eye',
    maternity: 'baby',
  }

  return iconMap[category] || 'package'
}

/**
 * Format date in "d MMM yyyy" format (e.g., "4 Jan 2025")
 */
export function formatPackageDate(dateString: string): string {
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: PackageCategoryType): string {
  const nameMap: Record<PackageCategoryType, string> = {
    consultations: 'Consultations',
    lab_tests: 'Lab Tests',
    pharmacy: 'Pharmacy',
    dental: 'Dental',
    optical: 'Optical',
    maternity: 'Maternity',
  }

  return nameMap[category] || category
}

/**
 * Calculate visits forfeited for expired packages
 */
export function getVisitsForfeited(pkg: UserPackageType): number {
  return pkg.remainingVisits
}

/**
 * Record package usage
 */
export async function recordPackageUsage(
  userPackageId: string,
  usage: Omit<PackageUsage, 'id' | 'userPackageId'>
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = createClient()
    // Get current package
    const { data: currentPackage, error: fetchError } = await supabase
      .from('user_packages')
      .select('*')
      .eq('id', userPackageId)
      .single()

    if (fetchError) throw fetchError

    // Create new usage record
    const newUsage: PackageUsage = {
      id: crypto.randomUUID(),
      userPackageId,
      ...usage,
    }

    // Update package
    const newUsedVisits = currentPackage.used_visits + 1
    const newRemainingVisits = currentPackage.remaining_visits - 1
    const newStatus = newRemainingVisits === 0 ? 'completed' : currentPackage.status

    const { error: updateError } = await supabase
      .from('user_packages')
      .update({
        used_visits: newUsedVisits,
        remaining_visits: newRemainingVisits,
        status: newStatus,
        completed_date: newRemainingVisits === 0 ? new Date().toISOString() : null,
        usage_history: [...(currentPackage.usage_history || []), newUsage],
      })
      .eq('id', userPackageId)

    if (updateError) throw updateError

    return { success: true }
  } catch (error) {
    console.error('Error recording package usage:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record usage',
    }
  }
}

/**
 * Update expired packages status
 * Should be called periodically or on app launch
 */
export async function updateExpiredPackages(userId: string): Promise<void> {
  try {
    const supabase = createClient()
    const now = new Date().toISOString()

    await supabase
      .from('user_packages')
      .update({ status: 'expired' })
      .eq('user_id', userId)
      .eq('status', 'active')
      .lt('expiry_date', now)
  } catch (error) {
    console.error('Error updating expired packages:', error)
  }
}
