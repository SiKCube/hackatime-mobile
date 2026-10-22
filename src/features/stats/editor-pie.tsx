import { useEffect, useState } from "react";
import { Text } from "react-native";
import { PieChart } from "react-native-chart-kit/v2";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { getStats } from "./get-stats";

type LengChartData = {
  leng: string
  time: number
  color: string
}[]

interface Props {
  limit: number
  categories: string[]
  projects: string[]
}

export default function EditorPie({ categories, projects, limit }: Props) {
  const { user, userApikey } = useAuthCtx()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<LengChartData | null>(null)

  useEffect(() => {
    const getData = async (username: string, apikey: string) => {
      try {
        setLoading(true)
        setError(null)

        const stats = await getStats(username, apikey, {
          features: ["editors"],
          filter_by_category: categories,
          filter_by_project: projects,
          limit: limit,
        })

        if (!stats.data.languages) throw Error("No editors found")

        const parsedStats: LengChartData = stats.data.languages.map((leng) => {
          return {
            leng: leng.name,
            time: leng.hours,
            color: leng.color
          }
        })

        setChartData(parsedStats)
        setLoading(false)
      } catch (e) {
        setError(`Can't get chart ${e}`)
        setLoading(false)
      }
    }

    if (user && userApikey) {
      getData(user.username, userApikey)
    }
  }, [])

  return (
    <>
      <Text>{error}</Text>
      {
        loading ?
          <Text>loading...</Text>
          :
          chartData ?
            <PieChart
              data={chartData as any}
              height={300}
              width={250}
              valueKey={"time"}
              labelKey={"leng"}
              colorKey="color"
            />
            :
            <Text>no data</Text>
      }
    </>
  )
}