import axios from "axios";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { BarChart } from "react-native-chart-kit/v2";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";

type ChartData = Record<string, number> | { days_div: string }

type ChartSerie = {
  yKey: string
  label: string
  // color: string
}

export interface ProjectsRequest {
  projects: Projects[];
}

export interface Projects {
  name: string;
  total_seconds: number;
  languages: string[];
  repo_url: string;
  total_heartbeats: number;
  first_heartbeat: string;
  last_heartbeat: string;
  most_recent_heartbeat: string;
  archived: boolean;
}

interface Props {
  projects: string[]
  start_date: string
  end_date: string
  interval_days: number
}

const getOneBarDataForPeriodOfTime = async (
  username: string, apikey: string,
  start_date: string, end_date: string,
  projects: string[],
  projectListTemplate: Record<string, number>
) => {
  const { data, status }: { data: ProjectsRequest, status: number } = await axios.request({
    method: "GET",
    url: `https://hackatime.hackclub.com/api/v1/users/${username}/projects/details`,
    params: {
      projects: projects.join(","),
      start_date,
      end_date,
    },
    headers: {
      Authorization: `Bearer ${apikey}`
    }
  })

  if (status !== 200) throw Error(`Request code ${status}`)

  const parsedData: ChartData[] = data.projects.map((prj): ChartData => {
    let barData = projectListTemplate

    barData[prj.name] = Number((prj.total_seconds / 3600).toFixed(2))

    return {
      days_div: `${new Date(start_date).toLocaleString("en", { month: "short", day: "2-digit" })} - ${new Date(end_date).toLocaleString("en", { month: "short", day: "2-digit" })}`,
      ...barData
    }
  })

  return parsedData
}

const getProjectsNames = async (username: string, apikey: string, start_date: string, end_date: string) => {
  const { data } = await axios.request({
    method: "GET",
    url: `https://hackatime.hackclub.com/api/v1/users/${username}/projects`,
    headers: {
      Authorization: `Bearer ${apikey}`
    },
    params: {
      start_date,
      end_date
    }
  })

  const prjList: string[] | undefined = data.projects

  if (!prjList) throw Error("Projects list is undefined")

  let projectListTemplate: Record<string, number> = {}
  let chartSeries: ChartSerie[] = []

  prjList.forEach((prjname) => {
    projectListTemplate[prjname] = 0
    chartSeries.push({ yKey: prjname, label: prjname })
  })

  return {
    projectListTemplate,
    chartSeries
  }
}

//.toISOString().slice(0, 10)

export default function ProjectsTimeline({ projects, start_date, end_date, interval_days }: Props) {
  const { user, userApikey } = useAuthCtx()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [chartData, setChartData] = useState<ChartData[] | null>(null)
  const [chartSeries, setChartSeries] = useState<ChartSerie[] | null>(null)

  useEffect(() => {
    const getData = async (username: string, apikey: string) => {
      try {
        setLoading(true)
        setError(null)

        const startDate = new Date(start_date).getTime()
        const endDate = new Date(end_date).getTime()

        if (startDate > endDate) throw Error("Invalid date parameters")

        const { chartSeries, projectListTemplate } = await getProjectsNames(username, apikey, start_date, end_date)

        let allChartData: ChartData[] = []

        let lastDate = new Date(startDate)
        while (true) {
          const appendDate = new Date(lastDate.getTime() + interval_days * 24 * 60 * 60 * 1000)

          const res = await getOneBarDataForPeriodOfTime(
            username, apikey,
            lastDate.toISOString().slice(0, 10),
            appendDate.toISOString().slice(0, 10),
            projects, projectListTemplate
          )
          allChartData.push(...res)

          if (appendDate.getTime() >= endDate) break

          lastDate = appendDate
        }

        allChartData.forEach((chart) => console.log(chart))

        setChartSeries(chartSeries)
        setChartData(allChartData)
        setLoading(false)
      } catch (e) {
        setError(`${e}`)
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
          <Text>Loading...</Text>
          :
          chartData ?
            <BarChart
              xKey="days_div"
              mode="stacked"
              barGapRatio={4}
              series={chartSeries as any}
              data={chartData as any}
              height={350}
              width={350}
              scrollable
              visiblePoints={8}
              formatYLabel={(value) => `${value}h`}
              interaction={{
                mode: "tap",
                deselectOnOutsidePress: true
              }}
            />
            :
            <Text>No data</Text>
      }
    </>
  )
}