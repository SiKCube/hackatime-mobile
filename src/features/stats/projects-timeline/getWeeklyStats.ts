import { getStoredData, storeData } from "@/features/storage"
import { getStats } from "../get-stats"
import type { StatWithWeekNum } from "../stats"

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

const getweeklist = (startDate: Date, endDate: Date) => {
  const numYearsToEnd = endDate.getFullYear() - startDate.getFullYear()
  // const lastDateOfStarterDate = new Date(new Date(startDate.getFullYear() + 1, 0, 1, 1).getTime() - 24 * 60 * 60 * 1000)

  // if (numYearsToEnd === 0) {
  //   const endYear = new Date(new Date(endDate.getFullYear() + 1, 0, 1, 1).getTime() - 24 * 60 * 60 * 1000)

  //   const yearWeekNum = getWeekNumByIsoString(endYear.toISOString())

  //   const weekList = Array.from({ length: yearWeekNum }, (_, i) => i + 1)

  //   return weekList
  // }

  let totalWeeks = 0
  Array.from({ length: numYearsToEnd + 1 }, (_, i) => i).forEach((plusToYear) => {
    const currentYear = startDate.getFullYear() + plusToYear

    const lastDateOfCurrentYear = new Date(new Date(currentYear + 1, 0, 1, 1).getTime() - 24 * 60 * 60 * 1000)
    totalWeeks += getWeekNumByIsoString(lastDateOfCurrentYear.toISOString())
  })

  const weekList = Array.from({ length: totalWeeks }, (_, i) => i + 1)
  const startYearWeeknum = getWeekNumByIsoString(startDate.toISOString())

  return weekList.filter((weeknum) => weeknum >= startYearWeeknum)
}

const stats = async (
  username: string,
  apikey: string,
  startDate: string, endDate: string,
  weekNum: number
): Promise<StatWithWeekNum> => {
  // const stored = await getStoredData(`stat-week/${startDate}/${endDate}`)

  // if (stored) {
  //   return JSON.parse(stored)
  // }

  const res = await getStats(username, apikey, {
    start_date: startDate,
    end_date: endDate,
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

  // const storeKey = `stat-week/${startDate}/${endDate}`
  // await storeData(storeKey, JSON.stringify(filterRes))

  return filterRes
}

export async function getWeeklyStats(
  startDate: Date, endDate: Date,
  username: string, apikey: string,
): Promise<StatWithWeekNum[]> {
  const weekList = getweeklist(startDate, endDate)

  // This divides the year in weeks by number, then fetches data for each week
  let lastDate: Date = startDate
  const yearStatsPerWeek: StatWithWeekNum[] = await Promise.all(weekList.map(async (weekNum): Promise<StatWithWeekNum> => {
    // starting and ending dates
    const currentStartDate = getFirstDateOfTheWeekByISOString(lastDate.toISOString())
    const currentEndDate = new Date(currentStartDate.getTime() + (86400000 * 6)) /*Week in milliseconds plus the starting Date of the week*/

    // updating for next iteration
    lastDate = new Date(currentStartDate.getTime() + (86400000 * 7))

    // fetching the data in that period of time (week)
    const res = await stats(username, apikey,
      currentStartDate.toISOString().slice(0, 10),
      currentEndDate.toISOString().slice(0, 10),
      weekNum
    )

    return res
  }))

  return yearStatsPerWeek
}
