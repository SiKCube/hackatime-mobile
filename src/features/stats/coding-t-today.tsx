import Alert from "@/components/alert";
import LoadingSkeleton from "@/components/loading-skeleton";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ProgressRing } from "react-native-chart-kit/v2";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { useTheme } from "../theme/context/theme-ctx-provider";
import { getFirstDateOfTheWeekByISOString } from "./date-picker";
import { gethoursAndMinutes, getStats } from "./get-stats";
import { useStatsCtx } from "./context/statsCtxProvider";

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



export default function CodingTimeTodayChart() {
  const { user, userApikey } = useAuthCtx()
  const { projects, includeIA } = useStatsCtx()
  const { themeData } = useTheme()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)

  const getLast8days = async (username: string, apikey: string) => {
    try {
      setLoading(true)
      setError(null)

      const x = new Date()
      const today = new Date(x.getFullYear(), x.getMonth(), x.getDate())
      const firstDateOfTheWeek = getFirstDateOfTheWeekByISOString(today.toISOString())
      const todayEnd = new Date(today.getTime() + 23 * 60 * 60 * 1000)

      const { data } = await getStats(username, apikey, {
        features: [],
        filter_by_category: [],
        filter_by_project: [],
        start_date: firstDateOfTheWeek.toISOString(),
        end_date: todayEnd.toISOString(),
        no_ia: !includeIA
      })

      const todayData = await getStats(username, apikey, {
        features: [],
        filter_by_category: [],
        filter_by_project: projects,
        no_ia: !includeIA,
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
      setError(`${e}`)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && userApikey) {
      getLast8days(user.username, userApikey)
    }
  }, [])

  useEffect(() => {
    if (user && userApikey) {
      getLast8days(user.username, userApikey)
    }
  }, [projects, includeIA])

  return (
    <StyledCard>
      <StyledText weight="bold" size={20}>Coding Time Today</StyledText>
      <StyledText type="seconday" size={15}>Compared with your last eight days</StyledText>
      <Alert msg={error} type="error" />
      {
        !loading && chartData && !error ?
          <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10 }}>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
              <ProgressRing
                height={150}
                width={150}
                value={chartData.score}
                centerLabel={() => `${Math.floor(chartData.score * 100)}%`}
              />
              {
                Math.floor(chartData.score * 100) < 100 ?
                  <Text style={{ color: themeData.danger, fontWeight: "bold" }}>
                    {100 - Math.floor(chartData.score * 100)}% below usual daily total
                  </Text>
                  :
                  Math.floor(chartData.score * 100) === 100 ?
                    <Text style={{ color: themeData.success, fontWeight: "bold" }}>
                      PERFECT!
                    </Text>
                    :
                    <Text style={{ color: themeData.success, fontWeight: "bold" }}>
                      +{Math.floor((chartData.score * 100) - 100)}% above usual daily total
                    </Text>
              }
            </View>
            <View style={{ flexDirection: "row", gap: 4, justifyContent: "center", alignItems: "center" }}>
              <StyledText type="seconday" size={17}>Today {gethoursAndMinutes(chartData.today)}</StyledText>
              <View style={{ width: 4, height: 4, backgroundColor: themeData.secondary, borderRadius: 100 }} />
              <StyledText type="seconday" size={15}>Usual {gethoursAndMinutes(chartData.promedio)}</StyledText>
            </View>
          </View>
          :
          <LoadingSkeleton height={240} />
      }
    </StyledCard>
  )
}