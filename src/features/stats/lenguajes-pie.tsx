import Alert from "@/components/alert";
import LoadingSkeleton from "@/components/loading-skeleton";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { PieChart } from "react-native-chart-kit/v2";
import { useTheme } from "../theme/context/theme-ctx-provider";
import { useStatsCtx } from "./context/statsCtxProvider";
import { gethoursAndMinutes } from "./get-stats";

type LengChartData = {
  leng: string
  time: number
  color: string
}[]

export default function LenguajesPie() {
  const [chartData, setChartData] = useState<LengChartData | null>(null)
  const [selectedPiece, setSelectedPiece] = useState<{
    name: string,
    time: string
  } | null>(null)

  const { totalStats, loading, error } = useStatsCtx()
  const { themeData } = useTheme()

  useEffect(() => {
    if (totalStats?.languages) {
      const r: LengChartData = totalStats.languages.map((leng) => {
        return {
          time: leng.total_seconds,
          color: leng.color,
          leng: leng.name
        }
      })

      setChartData(r)
    }
  }, [totalStats])

  useEffect(() => { setSelectedPiece(null) }, [loading])

  return (
    <StyledCard>
      <StyledText weight="bold" size={20}>Languages</StyledText>
      <Alert type="error" msg={error} />
      <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {
          !loading && chartData ?
            <>
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
                  onSelect: (item) => {
                    setSelectedPiece({
                      name: item.label,
                      time: gethoursAndMinutes(item.value ?? 0)
                    })
                  },
                  onDeselect: () => {
                    setSelectedPiece(null)
                  }
                }}
              />
              {
                selectedPiece &&
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                  <StyledText type="seconday" size={15}>
                    {selectedPiece.name}
                  </StyledText>
                  <View style={{ width: 4, height: 4, backgroundColor: themeData.secondary, borderRadius: 10 }} />
                  <StyledText weight="bold" size={15}>
                    {selectedPiece.time}
                  </StyledText>
                </View>
              }
            </>
            :
            <LoadingSkeleton width={250} height={300} />
        }
      </View>
    </StyledCard>
  )
}