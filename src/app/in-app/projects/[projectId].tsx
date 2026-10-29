import AvarageCoding from "@/features/stats/average-coding";
import CodingTimeTodayChart from "@/features/stats/coding-t-today";
import { useStatsCtx } from "@/features/stats/context/statsCtxProvider";
import DatePicker from "@/features/stats/date-picker";
import IaVsHumanChart from "@/features/stats/ia-human";
import LenguajesPie from "@/features/stats/lenguajes-pie";
import RhythmChart from "@/features/stats/rhythm";
import TopList from "@/features/stats/top-cards/top-list";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";

export default function Details() {
  const { projectId }: { projectId: string } = useLocalSearchParams()
  const { startDate, endDate, selectedPeriod, setProjects } = useStatsCtx()

  useEffect(() => {
    if (projectId) {
      setProjects([projectId])
    }
  }, [projectId])

  return (
    <View>
      <DatePicker />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
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