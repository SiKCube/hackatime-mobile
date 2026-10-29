import Alert from "@/components/alert";
import LoadingSkeleton from "@/components/loading-skeleton";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { useTheme } from "../theme/context/theme-ctx-provider";
import { useStatsCtx } from "./context/statsCtxProvider";
import { gethoursAndMinutes, getStats } from "./get-stats";

export interface SpansRequest {
  spans: Spans[];
}

export interface Spans {
  start_time: number;
  end_time: number;
  duration: number;
}

interface ChartData {
  total: number
  promedio: number
}

interface Props {
  start_date: Date,
  end_date: Date,
  projects: string[],
  no_ia?: boolean
}

const getDaysBetweenDates = (startDate: Date, endDate: Date): number => { 
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

export default function AvarageCoding({ start_date, end_date, projects, no_ia }: Props) {
  const { user, userApikey } = useAuthCtx()
  const { selectedPeriodName } = useStatsCtx()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)

  const getAvarage = async (username: string, apikey: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data } = await getStats(username, apikey, {
        features: [],
        filter_by_category: [],
        filter_by_project: projects,
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
        no_ia
      })

      setChartData({
        total: data.total_seconds,
        promedio: data.daily_average,
      })
      setLoading(false)
    } catch (e) {
      return (`${e}`)
    }
  }

  useEffect(() => {
    if (user && userApikey) {
      getAvarage(user.username, userApikey)
    }
  }, [])

  useEffect(() => {
    if (user && userApikey) {
      getAvarage(user.username, userApikey)
    }
  }, [start_date, end_date])

  return (
    <StyledCard>
      <StyledText weight="bold" size={20}>Average Coding Time Per Day</StyledText>
      <StyledText type="seconday" size={15}>Across {selectedPeriodName}</StyledText>
      <Alert msg={error} type="error" />
      {
        !loading && chartData && !error ?
          <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", margin: 30, gap: 20 }}>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5 }}>
              <StyledText type="primary" weight="bold" size={35}>
                {gethoursAndMinutes(chartData.total)}
              </StyledText>
              <StyledText type="seconday" weight="bold" size={15}>
                per day across {getDaysBetweenDates(start_date, end_date)} days
              </StyledText>
            </View>
            <StyledText type="seconday" weight="bold">
              <StyledText weight="bold">{gethoursAndMinutes(chartData.total)} </StyledText>
              total
            </StyledText>
          </View>
          :
          <LoadingSkeleton height={200} />
      }
    </StyledCard>
  )
}