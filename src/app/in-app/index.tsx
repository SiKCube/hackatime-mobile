import Alert from "@/components/alert";
import StyledText from "@/components/ui/text";
import CodingTimeTodayChart from "@/features/stats/coding-t-today";
import { useStatsCtx } from "@/features/stats/context/statsCtxProvider";
import IaVsHumanChart from "@/features/stats/ia-human";
import LenguajesPie from "@/features/stats/lenguajes-pie";
import ProjectsChart from "@/features/stats/projects-chart";
import RhythmChart from "@/features/stats/rhythm";
import TopList from "@/features/stats/top-cards/top-list";
import WeeklyProjectsTimeline from "@/features/stats/weekly-projects-timeline";
import YearHeatMap from "@/features/stats/year-heatmap";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date())
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date())

  const { error } = useStatsCtx()

  return (
    <SafeAreaView>
      <Alert type="error" msg={error} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <StyledText weight="bold" size={20}>
          Keep Track Of
          <StyledText size={20} type="primary" weight="bold"> Your </StyledText>
          Coding Time
        </StyledText>
        <TopList />
        <ProjectsChart />
        <LenguajesPie />
        <WeeklyProjectsTimeline />
        <RhythmChart
          start_date="2026-01-01"
          end_date="2026-12-17"
          projects={["my-portfolio", "hackatime-mobile"]}
        />
        <CodingTimeTodayChart
          projects={[]}
          start_date="2026-10-11"
          end_date="2026-10-18"
        />
        <IaVsHumanChart />
        <YearHeatMap />
      </ScrollView>
    </SafeAreaView>
  )
}