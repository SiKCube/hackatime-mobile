import Alert from "@/components/alert";
import StyledText from "@/components/ui/text";
import CodingTimeTodayChart from "@/features/stats/coding-t-today";
import { useStatsCtx } from "@/features/stats/context/statsCtxProvider";
import DatePicker from "@/features/stats/date-picker";
import IaVsHumanChart from "@/features/stats/ia-human";
import LenguajesPie from "@/features/stats/lenguajes-pie";
import ProjectsChart from "@/features/stats/projects-chart";
import RhythmChart from "@/features/stats/rhythm";
import TopList from "@/features/stats/top-cards/top-list";
import WeeklyProjectsTimeline from "@/features/stats/weekly-projects-timeline";
import YearHeatMap from "@/features/stats/year-heatmap";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { error, startDate, endDate } = useStatsCtx()
  
  return (
    <SafeAreaView>
      <Alert type="error" msg={error} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <StyledText weight="bold" size={20}>
          Keep Track Of
          <StyledText size={20} type="primary" weight="bold"> Your </StyledText>
          Coding Time
        </StyledText>
        <DatePicker />
        <TopList />
        <ProjectsChart />
        <LenguajesPie />
        <WeeklyProjectsTimeline />
        <RhythmChart
          start_date={startDate.toISOString()}
          end_date={endDate.toISOString()}
          projects={[]}
        />
        <CodingTimeTodayChart
          projects={[]}
          start_date={startDate.toISOString()}
          end_date={endDate.toISOString()}
        /> 
        <IaVsHumanChart
          start_date={startDate.toISOString()}
          end_date={endDate.toISOString()}
        />
        <YearHeatMap />
      </ScrollView>
    </SafeAreaView>
  )
}