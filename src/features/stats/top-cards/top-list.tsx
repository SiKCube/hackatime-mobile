import LoadingSkeleton from "@/components/loading-skeleton";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useStatsCtx } from "../context/statsCtxProvider";
import { gethoursAndMinutes } from "../get-stats";
import TopCard from "./top-card";

interface Tops {
  total_time_secs: number
  top_project: string
  top_language: string
}

export default function TopList() {
  const { totalStats, loading } = useStatsCtx()
  const [tops, setTops] = useState<Tops | null>(null)

  useEffect(() => {
    if (totalStats) {
      const totaltime = totalStats.total_seconds
      const topleng = totalStats.languages.length > 0 ? 
        totalStats.languages.reduce((previous, current) => {
          if (previous.total_seconds > current.total_seconds) return previous
          return current
        }).name
        :
        "None"
      const topProject = totalStats.projects.length > 0 ?
        totalStats.projects.reduce((prv, current) => {
          if (prv.total_seconds > current.total_seconds) return prv
          return current
        }).name
        :
        "None"

      setTops({
        total_time_secs: totaltime,
        top_language: topleng,
        top_project: topProject
      })
    }
  }, [totalStats])

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