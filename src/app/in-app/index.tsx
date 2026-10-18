import CodingTimeTodayChart from "@/features/charts/coding-t-today";
import IaVsHumanChart from "@/features/charts/ia-human";
import LenguajesPie from "@/features/charts/lenguajes-pie";
import ProjectsTimeline from "@/features/charts/projects-timeline";
import RhythmChart from "@/features/charts/rhythm";
import ProjectsChart from "@/features/charts/projects-chart";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function HomeScreen() {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date())
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date())
  
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Home</Text>
        <ProjectsChart />
        <LenguajesPie
          limit={10}
          categories={[]}
          projects={[]}
        />
        {/* <ProjectsTimeline
          projects={[]}
          interval_days={6}
          start_date="2026-01-01"
          end_date="2026-10-14"
        /> */}
        <RhythmChart
          start_date="2026-01-01"
          end_date="2026-12-17"
          projects={[]}
        />
        <CodingTimeTodayChart
          projects={[]}
          start_date="2026-01-01"
          end_date="2026-10-14"
        />
        <IaVsHumanChart />
      </ScrollView>
    </SafeAreaView>
  )
}