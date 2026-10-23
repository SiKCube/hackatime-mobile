import Alert from "@/components/alert";
import LoadingSkeleton from "@/components/loading-skeleton";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { useEffect, useState } from "react";
import { View } from 'react-native';
import { BarChart } from "react-native-chart-kit/v2";
import { useStatsCtx } from "./context/statsCtxProvider";
import { gethoursAndMinutes } from './get-stats';

type ChartDataType = ChartBarType[]

interface ChartBarType {
  project: string,
  hours: number,
}

export default function ProjectsChart() {
  const [chartData, setChartData] = useState<ChartDataType | null>(null)
  const { totalStats, loading, error } = useStatsCtx()

  useEffect(() => {
    if (totalStats?.projects) {
      const r: ChartDataType = totalStats.projects.map((prj) => {
        return {
          hours: prj.total_seconds,
          project: prj.name
        }
      })

      setChartData(r)
    }
  }, [totalStats])

  return (
    <StyledCard>
      <StyledText size={20} weight="bold">Project Durations</StyledText>
      <Alert type="error" msg={error} />
      <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {
          !loading && chartData ?
            <BarChart
              data={chartData as any}
              xKey="project"
              yKey="hours"
              formatYLabel={(val) => gethoursAndMinutes(val, true)}
              orientation="horizontal"
              showValuesOnTopOfBars
              width={260}
              height={450}
            />
            :
            <LoadingSkeleton height={450} />
        }
      </View>
    </StyledCard>
  )
}