import { getStats } from "../get-stats"
import { Stat } from "./statsCtxProvider"

export interface StatWithWeekNum extends Stat {
  weekNumber: number
}

// it is Monday bu default, bruh
// this gets the starting monday of the week
const getFirstDateOfTheWeekByISOString = (isoString: string, firstDayofTheWeek: number = 1): Date => {
  const date = new Date(isoString.slice(0, 10))

  const dayNumber = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + firstDayofTheWeek - dayNumber)

  return date
}

// gets the week number
const getWeekNumByIsoString = (isoStringDate: string): number => {
  const date = new Date(isoStringDate.slice(0, 10))
  const firstDate = new Date(Date.UTC(Number(isoStringDate.slice(0, 4)), 0, 1))

  const dayNumber = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNumber)

  const weekNumber = Math.ceil((((date.getTime() - firstDate.getTime()) / 86400000) + 1) / 7)

  return weekNumber
}

export async function getWeeklyStats(
  firstDateOfTheYearDate: Date, lastDateOfTheYearDate: Date,
  username: string, apikey: string
): Promise<StatWithWeekNum[]> {
  const yearWeekNum = getWeekNumByIsoString(lastDateOfTheYearDate.toISOString())

  const weekList = Array.from({ length: yearWeekNum }, (_, i) => i + 1)

  // This divides the year in weeks by number, then fetches data for each week
  let lastDate: Date = firstDateOfTheYearDate
  const yearStatsPerWeek: StatWithWeekNum[] = await Promise.all(weekList.map(async (weekNum): Promise<StatWithWeekNum> => {
    // starting and ending dates
    const currentStartDate = getFirstDateOfTheWeekByISOString(lastDate.toISOString())
    const currentEndDate = new Date(currentStartDate.getTime() + (86400000 * 6)) /*Week in milliseconds plus the starting Date of the week*/

    // updating for next iteration
    lastDate = new Date(currentStartDate.getTime() + (86400000 * 7))

    // fetching the data in that period of time (week)
    const res = await getStats(username, apikey, {
      start_date: currentStartDate.toISOString().slice(0, 10),
      end_date: currentEndDate.toISOString().slice(0, 10),
      features: ["projects", "languages"],
      filter_by_category: [],
      filter_by_project: [],
    })

    if (!res.data.projects || !res.data.languages) throw Error("Undefined, projects or languages values")

    const filterRes: StatWithWeekNum = {
      weekNumber: weekNum,
      start_date: res.data.start,
      end_date: res.data.end,
      daily_average: res.data.daily_average,
      human_readable_daily_average: res.data.human_readable_daily_average,
      total_seconds: res.data.total_seconds,
      human_readable_total: res.data.human_readable_total,
      languages: res.data.languages,
      projects: res.data.projects
    }

    return filterRes
  }))

  return yearStatsPerWeek
}