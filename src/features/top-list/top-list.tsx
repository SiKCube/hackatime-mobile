import LoadingSkeleton from "@/components/loading-skeleton";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { gethoursAndMinutes } from "../get-stats";
import { useWeeklyStats } from "../stats-ctx/statsCtxProvider";
import TopCard from "./top-card";

interface Tops {
  total_time_secs: number
  top_project: string
  top_language: string
}

export default function TopList() {
  const { totalYearStats, loading, error } = useWeeklyStats()
  const [tops, setTops] = useState<Tops | null>(null)

  useEffect(() => {
    if (totalYearStats) {
      const totaltime = totalYearStats.total_seconds
      const topleng = totalYearStats.languages.reduce((previous, current) => {
        if (previous.total_seconds > current.total_seconds) return previous
        return current
      })
      const topProject = totalYearStats.projects.reduce((prv, current) => {
        if (prv.total_seconds > current.total_seconds) return prv
        return current
      })

      setTops({
        total_time_secs: totaltime,
        top_language: topleng.name,
        top_project: topProject.name
      })
    }
  }, [totalYearStats])

  return (
    <View style={{ flexDirection: "column", gap: 20 }}>
      {
        !loading && tops ?
          <>
            <TopCard
              title="Total time"
              value={gethoursAndMinutes(tops.total_time_secs)}
              important
            />
            <TopCard
              title="Top language"
              value={tops.top_language}
            />
            <TopCard
              title="Top project"
              value={tops.top_project}
            />
          </>
          :
          Array.from({ length: 3 }).map((_, i) => <LoadingSkeleton key={i} height={80} />)
      }
    </View>
  )
}