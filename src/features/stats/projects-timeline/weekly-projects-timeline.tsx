import LoadingSkeleton from "@/components/loading-skeleton";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { BarChart } from "react-native-chart-kit/v2";
import { Rect } from "react-native-svg";
import { useAuthCtx } from "../../auth-ctx/auth-ctx-provider";
import { gethoursAndMinutes } from "../get-stats";
import { getWeeklyStats } from "./getWeeklyStats";
import type { StatWithWeekNum } from "../stats";
import axios from "axios";
import Alert from "@/components/alert";

const filterChartData = (weeklyStats: StatWithWeekNum[]) => {
  let chartData: Record<string, number | string>[] = []
  weeklyStats.forEach((week) => {
    if (week.projects.length > 0) {
      let r: Record<string, number | string> = {
        weeknum: `${new Date(week.start_date).toLocaleDateString("en", { day: "2-digit", month: "short" })}-${new Date(week.end_date).toLocaleDateString("en", { day: "2-digit" })}`,
      }

      week.projects.forEach((prj) => {
        r[prj.name] = prj.total_seconds
      })

      chartData.push(r)
    }
  })

  return chartData
}

const getProjectsNames = async (username: string, apikey: string, start_date: Date, end_date: Date) => {
  const { data } = await axios.request({
    method: "GET",
    url: `https://hackatime.hackclub.com/api/v1/users/${username}/projects`,
    headers: {
      Authorization: `Bearer ${apikey}`
    },
    params: {
      start_date: start_date.toISOString(),
      end_date: end_date.toDateString()
    }
  })

  const prjList: string[] | undefined = data.projects

  if (!prjList) throw Error("Projects list is undefined")

  return prjList
}

interface Props {
  startDate: Date
  endDate: Date
  projects: string[]
}

export default function WeeklyProjectsTimeline({ startDate, endDate, projects }: Props) {
  const { user, userApikey } = useAuthCtx()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [weeklyStats, setWeeklyStats] = useState<StatWithWeekNum[] | null>(null)
  const [projectsNames, setProjectsNames] = useState<string[] | null>(null)

  const getWeekly = async (username: string, apikey: string, startDate: Date, endDate: Date) => {
    try {
      setLoading(true)
      setError(null)

      const statsPerWeek = await getWeeklyStats(startDate, endDate, username, apikey)
      const projectsNames = await getProjectsNames(username, apikey, startDate, endDate)

      setWeeklyStats(statsPerWeek)
      setProjectsNames(projectsNames)
      setLoading(false)
    } catch (e) {
      setError(`${e}`)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && userApikey) {
      getWeekly(user.username, userApikey, startDate, endDate)
    }
  }, [])

  useEffect(() => {
    if (user && userApikey) {
      getWeekly(user.username, userApikey, startDate, endDate)
    }
  }, [startDate, endDate])

  return (
    <StyledCard>
      <StyledText size={20} weight="bold">Project Timeline</StyledText>
      <StyledText size={15} type="seconday">Peer week</StyledText>
      <Alert msg={error} type="error" />
      <View style={{ flexDirection: "column", justifyContent: "center", alignItems: 'center' }}>
        {
          !loading && weeklyStats != null && projectsNames != null ?
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
                width: 200,
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
            <LoadingSkeleton height={350} />
        }
      </View>
    </StyledCard>
  )
}