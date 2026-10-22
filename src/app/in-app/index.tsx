import Alert from "@/components/alert";
import StyledText from "@/components/ui/text";
import CodingTimeTodayChart from "@/features/charts/coding-t-today";
import IaVsHumanChart from "@/features/charts/ia-human";
import LenguajesPie from "@/features/charts/lenguajes-pie";
import ProjectsChart from "@/features/charts/projects-chart";
import RhythmChart from "@/features/charts/rhythm";
import WeeklyProjectsTimeline from "@/features/charts/weekly-projects-timeline";
import YearHeatMap from "@/features/charts/year-heatmap";
import { useWeeklyStats } from "@/features/stats-ctx/statsCtxProvider";
import TopList from "@/features/top-list/top-list";
import { useState } from "react";
import { Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgUri } from "react-native-svg";

export default function HomeScreen() {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date())
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date())

  const { error } = useWeeklyStats()

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