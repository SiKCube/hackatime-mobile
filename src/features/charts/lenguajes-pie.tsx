import Alert from "@/components/alert";
import LoadingSkeleton from "@/components/loading-skeleton";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { PieChart } from "react-native-chart-kit/v2";
import { useWeeklyStats } from "../stats-ctx/statsCtxProvider";

type LengChartData = {
  leng: string
  time: number
  color: string
}[]

export default function LenguajesPie() {
  const [chartData, setChartData] = useState<LengChartData | null>(null)

  const { totalYearStats, loading, error } = useWeeklyStats()

  useEffect(() => {
    if (totalYearStats?.languages) {
      const r: LengChartData = totalYearStats.languages.map((leng) => {
        return {
          time: leng.total_seconds,
          color: leng.color,
          leng: leng.name
        }
      })

      setChartData(r)
    }
  }, [totalYearStats])

  return (
    <StyledCard>
      <StyledText weight="bold" size={20}>Languages</StyledText>
      <Alert type="error" msg={error} />
      <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {
          !loading && chartData ?
            <PieChart
              data={chartData as any}
              height={300}
              width={250}
              valueKey={"time"}
              labelKey={"leng"}
              colorKey="color"
              interaction={{
                mode: "tap",
                deselectOnOutsidePress: true,
              }}
            />
            :
            <LoadingSkeleton width={250} height={300} />
        }
      </View>
    </StyledCard>
  )
}