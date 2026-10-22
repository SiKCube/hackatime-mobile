import axios from "axios";
import { useNetworkState } from "expo-network";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useAuthCtx } from "../../auth-ctx/auth-ctx-provider";
import { geTodayStats } from "./getTodayStats";
import { getTotalStats } from "./getTotalStats";
import { getWeeklyStats } from "./getWeeklyStats";

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
  totalStats: Stat | null
  projectsNames: string[] | null
  todayStats: Stat | null
  loading: boolean
  error: string | null
  selectedYear: number
  setSelectedYear: Dispatch<SetStateAction<number>>
}

const STARTER_VALUES: StatsContextType = {
  error: null,
  loading: false,
  projectsNames: null,
  weeklyStats: null,
  todayStats: null,
  totalStats: null,
  selectedYear: new Date().getFullYear(),
  setSelectedYear: () => { },
}

const StatsContext = createContext<StatsContextType>(STARTER_VALUES)

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
  // log states
  const [error, setError] = useState<string | null>(STARTER_VALUES.error)
  const [loading, setloading] = useState<boolean>(false)

  // stats
  const [weeklyStats, setweeklyStats] = useState<StatWithWeekNum[] | null>(STARTER_VALUES.weeklyStats)
  const [totalStats, setTotalStats] = useState<Stat | null>(STARTER_VALUES.totalStats)
  const [todayStats, setTodayStats] = useState<Stat | null>(STARTER_VALUES.todayStats)

  const [projectsNames, setProjectNames] = useState<string[] | null>(STARTER_VALUES.projectsNames)

  // parameters
  const [selectedYear, setSelectedYear] = useState<number>(STARTER_VALUES.selectedYear)

  // require data
  const { user, userApikey } = useAuthCtx()
  const network = useNetworkState()

  const getCtxStats = async (username: string, apikey: string, selectedYearState: number) => {
    try {
      setloading(true)
      setError(null)

      const firstDateOfTheYearDate = new Date(selectedYearState, 0, 1)
      const lastDateOfTheYearDate = new Date(new Date(selectedYearState + 1, 0, 1).getTime() - 24 * 60 * 60 * 1000)

      const statsPerWeek = await getWeeklyStats(firstDateOfTheYearDate, lastDateOfTheYearDate, username, apikey)

      const totalStats = await getTotalStats(firstDateOfTheYearDate, lastDateOfTheYearDate, username, apikey)

      const prjlist = await getProjectsNames(username, apikey, firstDateOfTheYearDate.toISOString().slice(0, 10), lastDateOfTheYearDate.toISOString().slice(0, 10))

      const todayStats = await geTodayStats(username, apikey)

      setTodayStats(todayStats)
      setProjectNames(prjlist)
      setTotalStats(totalStats)
      setweeklyStats(statsPerWeek)
      setloading(false)
    } catch (e) {
      setError(`${e}`)
      setloading(false)
    }
  }

  useEffect(() => {
    if (user && userApikey) {
      getCtxStats(user.username, userApikey, selectedYear)
    }
  }, [])

  return (
    <StatsContext.Provider value={{
      weeklyStats, totalStats, todayStats,
      loading, error,
      projectsNames,
      selectedYear, setSelectedYear,
    }}>
      {children}
    </StatsContext.Provider>
  )
}

export const useStatsCtx = () => useContext(StatsContext) 
