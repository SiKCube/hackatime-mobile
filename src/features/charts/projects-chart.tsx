import { useEffect, useState } from "react";
import { Text } from 'react-native';
import { BarChart } from "react-native-chart-kit/v2";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { getStats } from '../get-stats';

type ChartDataType = ChartBarType[]

interface ChartBarType {
  project: string,
  hours: number,
  hours_label: string
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
            hours: Number((prj.total_seconds / 3600).toFixed(2)),
            hours_label: prj.text
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
    <>
      {
        chartData ?
          loading ?
            <Text>Loading...</Text>
            :
            <BarChart
              data={chartData as any}
              xKey="project"
              yKey="hours"
              accessibilityLabel="hours_label"
              formatYLabel={(val) => `${chartData.find((data) => data.hours === val)?.hours_label}`}
              showXAxisLabels={false}
              orientation="horizontal"
              showValuesOnTopOfBars
              width={350}
              height={460}
            />
          :
          <Text>{error}</Text>
      }
    </>
  )
}