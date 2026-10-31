import { useLocalSearchParams } from "expo-router"
import { useEffect } from "react"
import { RefreshControl, ScrollView, View } from "react-native"
import AvarageCoding from "../stats/average-coding"
import CodingTimeTodayChart from "../stats/coding-t-today"
import { useStatsCtx } from "../stats/context/statsCtxProvider"
import DatePicker from "../stats/date-picker"
import IaVsHumanChart from "../stats/ia-human"
import LenguajesPie from "../stats/lenguajes-pie"
import RhythmChart from "../stats/rhythm"
import TopList from "../stats/top-cards/top-list"
import { useTheme } from "../theme/context/theme-ctx-provider"

export default function ProjectPanel() {
  const { projectId }: { projectId: string } = useLocalSearchParams()
  const { startDate, endDate, selectedPeriod, setProjects, loading, loadStats } = useStatsCtx()
  const { themeData } = useTheme()

  useEffect(() => {
    if (projectId) {
      setProjects([projectId])
    }
  }, [projectId])

  return (
    <View>
      <DatePicker />
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 20 }}
        refreshControl={
          <RefreshControl refreshing={loading}
            onRefresh={loadStats}
            colors={[themeData.primary]}
            progressBackgroundColor={themeData.darkless}
            progressViewOffset={-30}
          />
        }
      >
        <TopList />
        <LenguajesPie />
        <RhythmChart
          start_date={startDate}
          end_date={endDate}
        />
        {
          selectedPeriod === "alltime" || selectedPeriod === "today" ?
            <CodingTimeTodayChart />
            :
            <AvarageCoding
              start_date={startDate}
              end_date={endDate}
            />
        }
        <IaVsHumanChart
          start_date={startDate}
          end_date={endDate}
        />
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
}