import axios from "axios";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { ProgressRing } from "react-native-chart-kit/v2";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";

export interface SpansRequest {
  spans: Spans[];
}

export interface Spans {
  start_time: number;
  end_time: number;
  duration: number;
}

interface Props {
  start_date: string,
  end_date: string,
  projects: string[]
}

export default function CodingTimeTodayChart({ start_date, end_date, projects }: Props) {
  const { user, userApikey } = useAuthCtx()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<number | null>(null)

  useEffect(() => {
    const getStat = async (username: string, apikey: string) => {
      try {
        setLoading(true)
        setError(null)

        const startDate = new Date(start_date).getTime()
        const endDate = new Date(end_date).getTime()

        if (startDate > endDate) throw Error("Invalid date parameter")

        const { data }: { data: SpansRequest } = await axios.request({
          method: "GET",
          url: `https://hackatime.hackclub.com/api/v1/users/${username}/heartbeats/spans`,
          params: {
            start_date,
            end_date,
            filter_by_project: projects.join(",")
          },
          headers: {
            Authorization: `Bearer ${apikey}`
          }
        })

        if (!data) throw Error("Can't get chart data")

        let score = 0
        data.spans.forEach((span) => {
          score += span.duration
        })
        const promedio = score / data.spans.length

        console.warn(promedio)

        setChartData(promedio)
        setLoading(false)
      } catch (e) {
        setError(`${e}`)
        setLoading(false)
      }
    }

    if (user && userApikey) {
      getStat(user.username, userApikey)
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
            <ProgressRing
              height={300}
              width={300}
              value={chartData}
              centerLabel={({ average }) => `${average}%`}
            />
            :
            <Text>No data</Text>
      }
    </>
  )
}