import CodingTimeTodayChart from "@/features/charts/coding-t-today";
import IaVsHumanChart from "@/features/charts/ia-human";
import LenguajesPie from "@/features/charts/lenguajes-pie";
import RhythmChart from "@/features/charts/rhythm";
import ProjectsChart from "@/features/charts/projects-chart";
import { Button, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import WeeklyProjectsTimeline from "@/features/charts/weekly-projects-timeline";
import { Link } from "expo-router";

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
        <WeeklyProjectsTimeline/>
        <RhythmChart
          start_date="2026-01-01"
          end_date="2026-12-17"
          projects={[]}
        />
        <CodingTimeTodayChart
          projects={[]}
          start_date="2026-10-11"
          end_date="2026-10-18"
        />
        <IaVsHumanChart />
      </ScrollView>
    </SafeAreaView>
  )
}