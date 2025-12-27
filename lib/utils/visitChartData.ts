/**
 * Transform visit statistics into weekly chart format
 */

interface VisitStat {
  date: string;
  count: number;
  familyMember?: string;
}

interface ChartData {
  label: string;
  value: number;
}

/**
 * Get day abbreviation from date
 * Returns M, T, W, T, F, S, S for Mon-Sun
 */
function getDayAbbreviation(date: Date): string {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return days[date.getDay()];
}

/**
 * Transform visit statistics into weekly chart data
 * Creates an array of 7 days with labels (M, T, W, etc.) and visit counts
 *
 * @param visits - Array of visit statistics from the backend
 * @returns Array of chart data points for the last 7 days
 */
export function transformVisitDataToWeeklyChart(
  visits: VisitStat[]
): ChartData[] {
  // Get the last 7 days
  const today = new Date();
  const weekData: ChartData[] = [];

  // Generate last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0); // Reset time to midnight

    const dateString = date.toISOString().split('T')[0];
    const dayLabel = getDayAbbreviation(date);

    // Find visits for this date
    const visitsForDay = visits.filter(v => {
      const visitDate = new Date(v.date).toISOString().split('T')[0];
      return visitDate === dateString;
    });

    // Sum up visit counts for this day
    const totalVisits = visitsForDay.reduce((sum, v) => sum + v.count, 0);

    weekData.push({
      label: dayLabel,
      value: totalVisits,
    });
  }

  return weekData;
}

/**
 * Transform visit statistics grouped by family member
 *
 * @param visits - Array of visit statistics from the backend
 * @param familyMembers - Array of family members with their IDs and names
 * @returns Object mapping family member names (and "All") to their weekly chart data
 */
export function transformVisitDataByDependent(
  visits: VisitStat[],
  familyMembers: Array<{ id: string; name: string }>
): Record<string, ChartData[]> {
  const result: Record<string, ChartData[]> = {};

  // Add "All" category with all visits
  result['All'] = transformVisitDataToWeeklyChart(visits);

  // Add data for each family member
  familyMembers.forEach(member => {
    const memberVisits = visits.filter(
      v => v.familyMember === member.id
    );
    result[member.id] = transformVisitDataToWeeklyChart(memberVisits);
  });

  return result;
}
