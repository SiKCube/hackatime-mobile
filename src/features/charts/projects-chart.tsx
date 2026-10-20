import StyledCard from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Text, View } from 'react-native';
import { BarChart } from "react-native-chart-kit/v2";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { gethoursAndMinutes, getStats } from '../get-stats';
import StyledText from "@/components/ui/text";

type ChartDataType = ChartBarType[]

interface ChartBarType {
  project: string,
  hours: number,
}

export default function ProjectsChart() {
  const { userApikey, user } = useAuthCtx()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<ChartDataType | null>(null)

  useEffect(() => {
    const getUserStats = async (apikey: string, username: string) => {
      try {
        setLoading(true)
        setError(null)

        const { data } = await getStats(username, apikey, {
          features: ["projects"],
          filter_by_category: [],
          filter_by_project: [],
          limit: 10,
        })

        if (!data.projects) throw Error("Projects none")

        const parsedData: ChartDataType = data.projects.map((prj): ChartBarType => {
          return {
            project: prj.name,
            hours: prj.total_seconds,
          }
        })

        setChartData(parsedData)
        setLoading(false)
      } catch (e) {
        setError(`Can't get chart: ${e}`)
        setLoading(false)
      }
    }

    if (userApikey && user) {
      getUserStats(userApikey, user.username)
    } else {
      setError("Not authenticated, how are you seeing this?")
    }
  }, [])

  return (
    <StyledCard>
      <StyledText size={20} weight="bold">Project Durations</StyledText>
      <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {
          chartData ?
            loading ?
              <Text>Loading...</Text>
              :
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
            <Text>{error}</Text>
        }
      </View>
    </StyledCard>
  )
}