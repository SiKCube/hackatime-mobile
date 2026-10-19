import { useNetworkState } from "expo-network";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { getStats, StatsRequest } from "../get-stats";
import axios from "axios";

interface Projects {
  name: string;
  total_seconds: number;
  text: string;
  hours: number;
  minutes: number;
  percent: number | number;
  digital: string;
}

interface Languages {
  name: string;
  total_seconds: number;
  text: string;
  hours: number;
  minutes: number;
  percent: number | number;
  digital: string;
  color: string;
}

export interface Stat {
  start_date: string
  end_date: string
  total_seconds: number
  daily_average: number
  human_readable_total: string
  human_readable_daily_average: string
  projects: Projects[]
  languages: Languages[]
}

export interface StatWithWeekNum extends Stat {
  weekNumber: number
}

interface StatsContextType {
  weeklyStats: StatWithWeekNum[] | null
  todayWeekStats: StatWithWeekNum | null
  totalYearStats: Stat | null
  projectsNames: string[] | null 
  loading: boolean
  error: string | null
  selectedYear: number
  setSelectedYear: Dispatch<SetStateAction<number>>
}

const StatsContext = createContext<StatsContextType>({
  error: null,
  loading: false,
  projectsNames: null,
  weeklyStats: null,
  todayWeekStats: null,
  totalYearStats: null,
  selectedYear: new Date().getFullYear(),
  setSelectedYear: () => { }
})

// gets the week number
const getWeekNumByIsoString = (isoStringDate: string): number => {
  const date = new Date(isoStringDate.slice(0, 10))
  const firstDate = new Date(Date.UTC(Number(isoStringDate.slice(0, 4)), 0, 1))

  const dayNumber = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNumber)

  const weekNumber = Math.ceil((((date.getTime() - firstDate.getTime()) / 86400000) + 1) / 7)

  return weekNumber
}

// it is Monday bu default, bruh
// this gets the starting monday of the week
const getFirstDateOfTheWeekByISOString = (isoString: string, firstDayofTheWeek: number = 1): Date => {
  const date = new Date(isoString.slice(0, 10))

  const dayNumber = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + firstDayofTheWeek - dayNumber)

  return date
}

const getProjectsNames = async (username: string, apikey: string, start_date: string, end_date: string) => {
  const { data } = await axios.request({
    method: "GET",
    url: `https://hackatime.hackclub.com/api/v1/users/${username}/projects`,
    headers: {
      Authorization: `Bearer ${apikey}`
    },
    params: {
      start_date,
      end_date
    }
  })

  const prjList: string[] | undefined = data.projects

  if (!prjList) throw Error("Projects list is undefined")

  return prjList
}

export default function StatsCtxProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setloading] = useState<boolean>(false)
  const [weeklyStats, setweeklyStats] = useState<StatWithWeekNum[] | null>(null)
  const [todayWeekStats, settodayWeekStats] = useState<StatWithWeekNum | null>(null)
  const [totalYearStats, setTodalYearStats] = useState<Stat | null>(null)
  const [projectsNames, setProjectNames] = useState<string[] | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  const { user, userApikey } = useAuthCtx()
  const network = useNetworkState()

  const getWeeklyStats = async (username: string, apikey: string, selectedYearState: number) => {
    try {
      setloading(true)
      setError(null)

      const firstDateOfTheYearDate = new Date(selectedYearState, 0, 1)
      const lastDateOfTheYearDate = new Date(new Date(selectedYearState + 1, 0, 1).getTime() - 24 * 60 * 60 * 1000)

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

      // the current week stats, to show directly
      const todayWeekStats = yearStatsPerWeek.find((week) => week.weekNumber === getWeekNumByIsoString(new Date().toISOString()))

      // fetch normaly but with the first date of the year and the last, mean all this years stats
      const fetchedTotalYearStats = await getStats(username, apikey, {
        features: ["languages", "projects"],
        filter_by_category: [],
        filter_by_project: [],
        start_date: firstDateOfTheYearDate.toISOString().slice(0, 10),
        end_date: lastDateOfTheYearDate.toISOString().slice(0, 10)
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

      const prjlist = await getProjectsNames(username, apikey, firstDateOfTheYearDate.toISOString().slice(0, 10), lastDateOfTheYearDate.toISOString().slice(0, 10))

      setProjectNames(prjlist)
      setTodalYearStats(parsedTotalYearStats)
      settodayWeekStats(todayWeekStats ? todayWeekStats : null)
      setweeklyStats(yearStatsPerWeek)
      setloading(false)
    } catch (e) {
      setError(`${e}`)
      setloading(false)
    }
  }

  useEffect(() => {
    if (user && userApikey) {
      getWeeklyStats(user.username, userApikey, selectedYear)
    }
  }, [])

  // useEffect(() => {
  //   if (user && userApikey) {
  //     getWeeklyStats(user.username, userApikey, selectedYear)
  //   }
  // }, [selectedYear])

  return (
    <StatsContext.Provider value={{
      weeklyStats, todayWeekStats, totalYearStats,
      loading, error,
      projectsNames,
      selectedYear, setSelectedYear
    }}>
      {children}
    </StatsContext.Provider>
  )
}

export const useWeeklyStats = () => useContext(StatsContext) 
