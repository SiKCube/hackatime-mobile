import StyledText from "@/components/ui/text"
import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AvarageCoding from "../stats/average-coding"
import CodingTimeTodayChart from "../stats/coding-t-today"
import { useStatsCtx } from "../stats/context/statsCtxProvider"
import DatePicker from "../stats/date-picker"
import IaVsHumanChart from "../stats/ia-human"
import LenguajesPie from "../stats/lenguajes-pie"
import ProjectsChart from "../stats/projects-chart"
import WeeklyProjectsTimeline from "../stats/projects-timeline/weekly-projects-timeline"
import RhythmChart from "../stats/rhythm"
import TopList from "../stats/top-cards/top-list"
import YearHeatMap from "../stats/year-heatmap"

export default function GeneralPanel() {
  const { startDate, endDate, selectedPeriod } = useStatsCtx()

  return (
    <SafeAreaView>
      <DatePicker />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <StyledText weight="bold" size={20}>
          Keep Track Of
          <StyledText size={20} type="primary" weight="bold"> Your </StyledText>
          Coding Time
        </StyledText>
        <TopList />
        <ProjectsChart />
        <LenguajesPie />
        <WeeklyProjectsTimeline
          startDate={startDate}
          endDate={endDate}
          projects={[]}
        />
        <RhythmChart
          start_date={startDate}
          end_date={endDate}
        />
        {
          selectedPeriod === "alltime" || selectedPeriod === "today" ?
            <CodingTimeTodayChart
            />
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
        <YearHeatMap />
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  )
}