import { createClient } from '@/lib/supabase/client'
import type { Dependent } from '@/types'
import { calculateAge } from '@/lib/utils/dateUtils'

/**
 * Get all dependents for a user
 * @param userId - User ID
 * @returns Array of dependents
 */
export async function getDependents(userId: string): Promise<{
  success: boolean
  dependents?: Dependent[]
  error?: string
}> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('dependents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    // Map database fields to Dependent type
    const dependents: Dependent[] = (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      relationship: row.relationship,
      dateOfBirth: row.date_of_birth,
      gender: row.gender as 'male' | 'female',
      photo: row.photo,
      birthCertificateNumber: row.birth_certificate_number,
      createdAt: row.created_at,
    }))

    return {
      success: true,
      dependents
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dependents'
    }
  }
}

/**
 * Add a new dependent
 * @param userId - User ID
 * @param data - Dependent data
 * @returns Created dependent
 */
export async function addDependent(
  userId: string,
  data: {
    name: string
    dateOfBirth: string
    gender: 'male' | 'female'
    relationship?: 'child' | 'spouse' | 'parent' | 'sibling' | 'other'
  }
): Promise<{
  success: boolean
  dependent?: Dependent
  error?: string
}> {
  try {
    const supabase = createClient()

    // Validate max dependents (3)
    const { data: existingDependents } = await supabase
      .from('dependents')
      .select('id')
      .eq('user_id', userId)

    if (existingDependents && existingDependents.length >= 3) {
      return {
        success: false,
        error: 'Maximum of 3 dependents allowed'
      }
    }

    // Insert new dependent
    const { data: newDependent, error } = await supabase
      .from('dependents')
      .insert({
        user_id: userId,
        name: data.name,
        relationship: data.relationship || 'child',
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
      })
      .select()
      .single()

    if (error || !newDependent) {
      return {
        success: false,
        error: error?.message || 'Failed to add dependent'
      }
    }

    const dependent: Dependent = {
      id: newDependent.id,
      userId: newDependent.user_id,
      name: newDependent.name,
      relationship: newDependent.relationship,
      dateOfBirth: newDependent.date_of_birth,
      gender: newDependent.gender as 'male' | 'female',
      photo: newDependent.photo,
      birthCertificateNumber: newDependent.birth_certificate_number,
      createdAt: newDependent.created_at,
    }

    return {
      success: true,
      dependent
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add dependent'
    }
  }
}

/**
 * Update a dependent
 * @param dependentId - Dependent ID
 * @param data - Data to update
 * @returns Updated dependent
 */
export async function updateDependent(
  dependentId: string,
  data: Partial<{
    name: string
    dateOfBirth: string
    gender: 'male' | 'female'
    relationship: 'child' | 'spouse' | 'parent' | 'sibling' | 'other'
  }>
): Promise<{
  success: boolean
  dependent?: Dependent
  error?: string
}> {
  try {
    const supabase = createClient()

    // Build update object with database field names
    const updates: Record<string, any> = {}

    if (data.name !== undefined) updates.name = data.name
    if (data.relationship !== undefined) updates.relationship = data.relationship
    if (data.dateOfBirth !== undefined) updates.date_of_birth = data.dateOfBirth
    if (data.gender !== undefined) updates.gender = data.gender

    const { data: updatedDependent, error } = await supabase
      .from('dependents')
      .update(updates)
      .eq('id', dependentId)
      .select()
      .single()

    if (error || !updatedDependent) {
      return {
        success: false,
        error: error?.message || 'Failed to update dependent'
      }
    }

    const dependent: Dependent = {
      id: updatedDependent.id,
      userId: updatedDependent.user_id,
      name: updatedDependent.name,
      relationship: updatedDependent.relationship,
      dateOfBirth: updatedDependent.date_of_birth,
      gender: updatedDependent.gender as 'male' | 'female',
      photo: updatedDependent.photo,
      birthCertificateNumber: updatedDependent.birth_certificate_number,
      createdAt: updatedDependent.created_at,
    }

    return {
      success: true,
      dependent
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update dependent'
    }
  }
}

/**
 * Remove a dependent
 * @param dependentId - Dependent ID
 * @returns Success status
 */
export async function removeDependent(dependentId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('dependents')
      .delete()
      .eq('id', dependentId)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove dependent'
    }
  }
}

/**
 * Get initials from full name
 * @param fullName - Full name
 * @returns Initials (e.g., "JD" for "John Doe")
 */
export function getInitials(fullName: string): string {
  if (!fullName) return ''

  const names = fullName.trim().split(/\s+/)

  if (names.length === 1) {
    // Single name - return first two letters
    return names[0].substring(0, 2).toUpperCase()
  }

  // Multiple names - return first letter of first and last name
  const firstInitial = names[0].charAt(0)
  const lastInitial = names[names.length - 1].charAt(0)

  return (firstInitial + lastInitial).toUpperCase()
}

/**
 * Get recent visits for a dependent
 * @param dependentId - Dependent ID
 * @param limit - Maximum number of visits to return
 * @returns Array of dependent visits
 */
export async function getDependentVisits(
  dependentId: string,
  limit: number = 3
): Promise<{
  success: boolean
  visits?: Array<{
    id: string
    dependentId: string
    facilityName: string
    facilityIcon?: string
    date: string
    packageName: string
  }>
  error?: string
}> {
  try {
    const supabase = createClient()

    // Get visits for the dependent
    const { data, error } = await supabase
      .from('visits')
      .select(`
        id,
        visit_date,
        facility:facilities(name),
        user_package:user_packages(
          package:packages(name)
        )
      `)
      .eq('dependent_id', dependentId)
      .eq('status', 'completed')
      .order('visit_date', { ascending: false })
      .limit(limit)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    // Map to DependentVisit format
    const visits = (data || []).map((row: any) => ({
      id: row.id,
      dependentId,
      facilityName: row.facility?.name || 'Unknown Facility',
      date: row.visit_date,
      packageName: row.user_package?.package?.name || 'Unknown Package',
    }))

    return {
      success: true,
      visits
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch visits'
    }
  }
}

/**
 * Calculate age from date of birth (re-export for convenience)
 */
export { calculateAge } from '@/lib/utils/dateUtils'
