import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useAuthCtx } from "../../auth-ctx/auth-ctx-provider";
import type { Stat } from "../stats";
import { geTodayStats } from "./getTodayStats";
import { getTotalStats } from "./getTotalStats";

interface StatsContextType {
  totalStats: Stat | null
  todayStats: Stat | null
  loading: boolean
  error: string | null
  startDate: Date,
  setStartDate: Dispatch<SetStateAction<Date>>,
  endDate: Date
  setEndDate: Dispatch<SetStateAction<Date>>,
  projects: string[]
  setProjects: Dispatch<SetStateAction<string[]>>,
  selectedPeriod: string
  setSelectedPeriod: Dispatch<SetStateAction<string>>,
  selectedPeriodName: string
  setSelectedPeriodName: Dispatch<SetStateAction<string>>
  includeIA: boolean
  setIncludeIA: Dispatch<SetStateAction<boolean>>,
  loadStats: () => Promise<void>
}

const STARTER_VALUES: StatsContextType = {
  error: null,
  loading: false,
  todayStats: null,
  totalStats: null,
  startDate: new Date(new Date().getFullYear(), 0, 1, 1),
  setStartDate: () => { },
  endDate: new Date(new Date(new Date().getFullYear() + 1, 0, 1).getTime() - 24 * 60 * 60 * 1000),
  setEndDate: () => { },
  projects: [],
  setProjects: () => { },
  selectedPeriod: "alltime",
  setSelectedPeriod: () => { },
  selectedPeriodName: "All time",
  setSelectedPeriodName: () => { },
  includeIA: true,
  setIncludeIA: () => { },
  loadStats: async () => { }
}

const StatsContext = createContext<StatsContextType>(STARTER_VALUES)


export default function StatsCtxProvider({ children }: { children: React.ReactNode }) {
  // log states
  const [error, setError] = useState<string | null>(STARTER_VALUES.error)
  const [loading, setloading] = useState<boolean>(false)

  // stats
  const [totalStats, setTotalStats] = useState<Stat | null>(STARTER_VALUES.totalStats)
  const [todayStats, setTodayStats] = useState<Stat | null>(STARTER_VALUES.todayStats)

  // parameters
  const [startDate, setStartDate] = useState<Date>(STARTER_VALUES.startDate)
  const [endDate, setEndDate] = useState<Date>(STARTER_VALUES.endDate)
  const [projects, setProjects] = useState<string[]>(STARTER_VALUES.projects)
  const [includeIA, setIncludeIA] = useState<boolean>(STARTER_VALUES.includeIA)
  const [selectedPeriod, setSelectedPeriod] = useState<string>(STARTER_VALUES.selectedPeriod)
  const [selectedPeriodName, setSelectedPeriodName] = useState<string>(STARTER_VALUES.selectedPeriodName)

  // require data
  const { user, userApikey } = useAuthCtx()

  const getCtxStats = async (
    username: string, apikey: string,
    startDate: Date, endDate: Date,
    selectedProjects: string[],
    selectedIncludeIA: boolean
  ) => {
    try {
      setloading(true)
      setError(null)

      const totalStats = await getTotalStats(
        startDate, endDate,
        username, apikey,
        selectedProjects,
        selectedIncludeIA
      )

      const todayStats = await geTodayStats(username, apikey)

      setTodayStats(todayStats)
      setTotalStats(totalStats)
      setloading(false)
    } catch (e) {
      setError(`${e}`)
      setloading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    loadStats()
  }, [startDate, endDate, projects, includeIA])

  const loadStats = async () => {
    if (user && userApikey) {
      await getCtxStats(user.username, userApikey, startDate, endDate, projects, includeIA)
    }
  }

  return (
    <StatsContext.Provider value={{
      totalStats, todayStats,
      loading, error,
      startDate, setStartDate,
      endDate, setEndDate,
      selectedPeriod, setSelectedPeriod,
      selectedPeriodName, setSelectedPeriodName,
      projects, setProjects,
      includeIA, setIncludeIA,
      loadStats
    }}>
      {children}
    </StatsContext.Provider>
  )
}

export const useStatsCtx = () => useContext(StatsContext) 
