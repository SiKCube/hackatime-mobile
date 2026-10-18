import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ProgressRing } from "react-native-chart-kit/v2";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { gethoursAndMinutes, getStats } from "../get-stats";

export interface SpansRequest {
  spans: Spans[];
}

export interface Spans {
  start_time: number;
  end_time: number;
  duration: number;
}

interface ChartData {
  score: number
  promedio: number
  today: number
}

interface Props {
  start_date: string,
  end_date: string,
  projects: string[],
  no_ia?: boolean
}

export default function CodingTimeTodayChart({ start_date, end_date, projects, no_ia }: Props) {
  const { user, userApikey } = useAuthCtx()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)

  useEffect(() => {
    const getLast8days = async (username: string, apikey: string) => {
      try {
        setLoading(true)
        setError(null)

        const { data } = await getStats(username, apikey, {
          features: [],
          filter_by_category: [],
          filter_by_project: [],
          start_date,
          end_date,
          no_ia
        })

        const x = new Date()
        const today = new Date(x.getFullYear(), x.getMonth(), x.getDate())
        const todayEnd = new Date(today.getTime() + 23 * 60 * 60 * 1000)

        const todayData = await getStats(username, apikey, {
          features: [],
          filter_by_category: [],
          filter_by_project: projects,
          no_ia,
          start_date: today.toISOString(),
          end_date: todayEnd.toISOString()
        })

        const score = Number((Math.floor((todayData.data.total_seconds * 100) / data.daily_average) * 0.01).toFixed(2))

        setChartData({
          score,
          promedio: data.daily_average,
          today: todayData.data.total_seconds
        })
        setLoading(false)
      } catch (e) {
        return (`${e}`)
      }
    }

    if (user && userApikey) {
      getLast8days(user.username, userApikey)
    }
  }, [])

  return (
    <>
      <Text>{error}</Text>
      {
        loading ?
          <Text>Loading...</Text>
          :
          chartData ?
            <View>
              <ProgressRing
                height={150}
                width={150}
                value={chartData.score}
                centerLabel={() => `${Math.floor(chartData.score * 100)}%`}
              />
              {
                Math.floor(chartData.score * 100) ?
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    {100 - Math.floor(chartData.score * 100)}% below usual daily total
                  </Text>
                  :
                  null
              }
              <Text>Today {gethoursAndMinutes(chartData.today)}</Text>
              <Text>Usual {gethoursAndMinutes(chartData.promedio)}</Text>
            </View>
            :
            <Text>No data</Text>
      }
    </>
  )
}