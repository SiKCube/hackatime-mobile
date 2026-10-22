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
  startDate: Date,
  setStartDate: Dispatch<SetStateAction<Date>>,
  endDate: Date
  setEndDate: Dispatch<SetStateAction<Date>>,
}

const STARTER_VALUES: StatsContextType = {
  error: null,
  loading: false,
  projectsNames: null,
  weeklyStats: null,
  todayStats: null,
  totalStats: null,
  startDate: new Date(new Date().getFullYear(), 0, 1, 1),
  setStartDate: () => { },
  endDate: new Date(new Date(new Date().getFullYear() + 1, 0, 1).getTime() - 24 * 60 * 60 * 1000),
  setEndDate: () => { }
}

const StatsContext = createContext<StatsContextType>(STARTER_VALUES)

const getProjectsNames = async (username: string, apikey: string, start_date: Date, end_date: Date) => {
  const { data } = await axios.request({
    method: "GET",
    url: `https://hackatime.hackclub.com/api/v1/users/${username}/projects`,
    headers: {
      Authorization: `Bearer ${apikey}`
    },
    params: {
      start_date: start_date.toISOString(),
      end_date: end_date.toDateString()
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
  const [startDate, setStartDate] = useState<Date>(STARTER_VALUES.startDate)
  const [endDate, setEndDate] = useState<Date>(STARTER_VALUES.endDate)

  // require data
  const { user, userApikey } = useAuthCtx()
  const network = useNetworkState()

  const getCtxStats = async (
    username: string, apikey: string,
    startDate: Date, endDate: Date,
  ) => {
    try {
      setloading(true)
      setError(null)

      const statsPerWeek = await getWeeklyStats(startDate, endDate, username, apikey)

      const totalStats = await getTotalStats(startDate, endDate, username, apikey)

      const prjlist = await getProjectsNames(username, apikey, startDate, endDate)

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
      getCtxStats(user.username, userApikey, startDate, endDate)
    }
  }, [])

  useEffect(() => {
    if (user && userApikey) {
      getCtxStats(user.username, userApikey, startDate, endDate)
    }
  }, [startDate, endDate])

  return (
    <StatsContext.Provider value={{
      weeklyStats, totalStats, todayStats,
      loading, error,
      projectsNames,
      startDate, setStartDate,
      endDate, setEndDate
    }}>
      {children}
    </StatsContext.Provider>
  )
}

export const useStatsCtx = () => useContext(StatsContext) 
