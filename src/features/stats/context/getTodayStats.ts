import { getStats } from "../get-stats"
import { Stat } from "./statsCtxProvider"

export async function geTodayStats(username: string, apikey: string) {
  const x = new Date()
  const todayDate = new Date(x.getFullYear(), x.getMonth(), x.getDate(), 0, 0, 0)
  const todayEndDate = new Date(todayDate.getTime() + 23 * 60 * 60 * 1000)

  const fetchedTodayStats = await getStats(username, apikey, {
    features: [],
    filter_by_category: [],
    filter_by_project: [],
    start_date: todayDate.toISOString(),
    end_date: todayEndDate.toISOString()
  })
  const parsedTodayStats: Stat = {
    total_seconds: fetchedTodayStats.data.total_seconds,
    daily_average: fetchedTodayStats.data.daily_average,
    human_readable_daily_average: fetchedTodayStats.data.human_readable_daily_average,
    human_readable_total: fetchedTodayStats.data.human_readable_total,
    languages: fetchedTodayStats.data.languages ?? [],
    projects: fetchedTodayStats.data.projects ?? [],
    start_date: fetchedTodayStats.data.start,
    end_date: fetchedTodayStats.data.end
  }

  return parsedTodayStats
}