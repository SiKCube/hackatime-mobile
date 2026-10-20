import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit/v2";
import { Rect } from "react-native-svg";
import { gethoursAndMinutes } from "../get-stats";
import { StatWithWeekNum, useWeeklyStats } from "../stats-ctx/statsCtxProvider";

interface Props {

}

const filterChartData = (weeklyStats: StatWithWeekNum[]) => {
  let chartData: Record<string, number>[] = []
  weeklyStats.forEach((week) => {
    if (week.projects.length > 0) {
      let r: Record<string, number> = { weeknum: week.weekNumber }

      week.projects.forEach((prj) => {
        r[prj.name] = prj.total_seconds
      })

      chartData.push(r)
    }
  })

  return chartData
}

export default function WeeklyProjectsTimeline() {
  const { loading, error, weeklyStats, projectsNames } = useWeeklyStats()

  return (
    <StyledCard>
      <StyledText size={20} weight="bold">Project Timeline</StyledText>
      <StyledText size={15} type="seconday">Peer week</StyledText>
      <Text>{error}</Text>
      <View style={{ flexDirection: "column", justifyContent: "center", alignItems: 'center' }}>

        {
          loading ?
            <Text>Loading...</Text>
            :
            weeklyStats != null && projectsNames != null ?
              <BarChart
                xKey="weeknum"
                mode="stacked"
                barGapRatio={4}
                series={projectsNames.map((prj) => {
                  return {
                    yKey: prj,
                    label: prj
                  }
                })}
                data={filterChartData(weeklyStats)}
                height={350}
                width={270}
                scrollable
                visiblePoints={8}
                interaction={{
                  mode: "tap",
                  deselectOnOutsidePress: true,
                }}
                tooltip={{
                  anchor: "pointer",
                  placement: "above",
                  width: 200
                }}
                selectionAnimation={false}
                renderBar={({ bar, fill }) => (
                  <Rect
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={fill}
                  />
                )}
                formatYLabel={(value) => gethoursAndMinutes(value)}
              />
              :
              <Text>No data</Text>
        }
      </View>
    </StyledCard>
  )
}