import { Text } from "react-native";
import { BarChart } from "react-native-chart-kit/v2";
import { gethoursAndMinutes } from "../get-stats";
import { StatWithWeekNum, useWeeklyStats } from "../stats-ctx/statsCtxProvider";
import { Rect } from "react-native-svg";

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
    <>
      <Text>{error}</Text>
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
              width={350}
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
    </>
  )
}