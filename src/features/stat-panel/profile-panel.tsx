import { RefreshControl, ScrollView, View } from "react-native"
import { useStatsCtx } from "../stats/context/statsCtxProvider"
import DatePicker from "../stats/date-picker"
import IaVsHumanChart from "../stats/ia-human"
import LenguajesPie from "../stats/lenguajes-pie"
import ProjectsChart from "../stats/projects-chart"
import WeeklyProjectsTimeline from "../stats/projects-timeline/weekly-projects-timeline"
import TopList from "../stats/top-cards/top-list"
import YearHeatMap from "../stats/year-heatmap"
import { useTheme } from "../theme/context/theme-ctx-provider"

export default function ProfilePanel() {
  const { startDate, endDate, loadStats, loading } = useStatsCtx()
  const { themeData } = useTheme()

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
        <ProjectsChart />
        <LenguajesPie />
        <WeeklyProjectsTimeline
          startDate={startDate}
          endDate={endDate}
          projects={[]}
        />
        <IaVsHumanChart
          start_date={startDate}
          end_date={endDate}
        />
        <YearHeatMap />
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
} 
