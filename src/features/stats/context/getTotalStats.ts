import { getStats } from "../get-stats"
import { Stat } from "../stats"

export async function getTotalStats(
  startDate: Date, endDate: Date,
  username: string, apikey: string,
  projects: string[],
  includeIA: boolean = true
) {
  const fetchedTotalYearStats = await getStats(username, apikey, {
    features: ["languages", "projects"],
    filter_by_category: [],
    filter_by_project: projects,
    start_date: startDate.toISOString().slice(0, 10),
    end_date: endDate.toISOString().slice(0, 10),
    no_ia: !includeIA
  })
  const parsedTotalYearStats: Stat = {
    start_date: fetchedTotalYearStats.data.start,
    end_date: fetchedTotalYearStats.data.end,
    daily_average: fetchedTotalYearStats.data.daily_average,
    human_readable_daily_average: fetchedTotalYearStats.data.human_readable_daily_average,
    total_seconds: fetchedTotalYearStats.data.total_seconds,
    human_readable_total: fetchedTotalYearStats.data.human_readable_total,
    languages: fetchedTotalYearStats.data.languages ?? [],
    projects: fetchedTotalYearStats.data.projects ?? []
  }

  return parsedTotalYearStats
}