import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";

export interface SpansRequest {
  spans: Span[];
}

export interface Span {
  start_time: number;
  end_time: number;
  duration: number;
}

type ChartData = {
  dayString: string
  hours: number[]
}

interface Props {
  start_date: string
  end_date: string
  projects: string[]
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const TIMES = ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "_"]
const CELL_SIZE = 20
const GAP = 5

const gethoursAndMinutes = (secs: number) => {
  const hours = Math.floor(secs / 3600)
  const minutes = Math.floor((secs - (hours * 3600)) / 60)

  return `${hours}h ${minutes}m`
}

export default function RhythmChart({ start_date, end_date, projects }: Props) {
  const [chartData, setChartData] = useState<ChartData[] | null>(null)
  const [topHours, setTopHours] = useState<number>(0)
  const [selectedHour, setSelectedHour] = useState<{
    hour: number,
    cellId: number,
    cellIndex: number
  } | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { user, userApikey } = useAuthCtx()

  useEffect(() => {
    const getSpans = async (username: string, apikey: string) => {
      try {
        setLoading(true)
        setError(null)

        const { data }: { data: SpansRequest } = await axios.request({
          method: "GET",
          url: `https://hackatime.hackclub.com/api/v1/users/${username}/heartbeats/spans`,
          params: {
            start_date,
            end_date,
            projects: projects.join(",")
          },
          headers: {
            Authorization: `Bearer ${apikey}`
          }
        })

        if (!data) throw Error("Data is undefined")

        const spans: Span[] = data.spans

        let result: ChartData[] = WEEK_DAYS.map((weekday) => {
          return {
            dayString: weekday,
            hours: Array.from({ length: 24 }, () => 0)
          }
        })
        let mosthours = 0
        spans.forEach((span) => {
          const date = new Date(span.start_time * 1000)
          const dayNumber = (date.getUTCDay() || 7) - 1

          const hours24 = Number(date.toLocaleString("en", { hour: "2-digit", hour12: false }))

          const addedHours = Number((result[dayNumber].hours[hours24] + span.duration).toFixed(2))

          if (addedHours > mosthours) mosthours = addedHours

          result[dayNumber].dayString = WEEK_DAYS[dayNumber]
          result[dayNumber].hours[hours24] = addedHours
        })

        setChartData(result)
        setTopHours(mosthours)
        setLoading(false)
      } catch (e) {
        setError(`${e}`)
        setLoading(false)
      }
    }

    if (user && userApikey) {
      getSpans(user.username, userApikey)
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
            <>
              {
                selectedHour ?
                  <Text>{gethoursAndMinutes(selectedHour.hour)} {selectedHour.cellIndex}:00-{selectedHour.cellIndex + 1}:00</Text>
                  :
                  null
              }
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{
                width: (CELL_SIZE + 3) * 30,
                justifyContent: "center",
              }}>
                <View style={{ width: (CELL_SIZE + 3) * 27, gap: GAP, marginBottom: 15 }}>
                  <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <Text style={{ width: 35, opacity: 0 }}>Hour</Text>
                    <View style={{ width: (CELL_SIZE + GAP) * 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      {
                        TIMES.map((v) => <Text style={{ fontSize: 10, opacity: 0.7 }} key={v}>{v}</Text>)
                      }
                    </View>
                  </View>
                  {
                    chartData.map((dayData, dayDataIndex) => {
                      return (
                        <View key={dayDataIndex} style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                          <Text style={{ width: 35, opacity: 0.7, fontSize: 12 }}>
                            {dayData.dayString}
                          </Text>
                          <Svg height={CELL_SIZE} width={(CELL_SIZE + GAP) * 24}>
                            {
                              dayData.hours.map((value, index) => {
                                const cellid = index * (CELL_SIZE + GAP) + dayDataIndex
                                const vsTopHour = Number((value / topHours).toFixed(2))
                                
                                return (
                                  <Rect
                                    key={index}
                                    onPress={() => setSelectedHour({
                                      hour: value,
                                      cellIndex: index,
                                      cellId: cellid
                                    })}
                                    x={index * (CELL_SIZE + GAP)}
                                    y="0"
                                    rx="5"
                                    ry="5"
                                    width={CELL_SIZE}
                                    height={CELL_SIZE}
                                    fillOpacity={vsTopHour >= 0.1 ?
                                      vsTopHour
                                      :
                                      0.1
                                    }
                                    stroke={"red"}
                                    strokeWidth={selectedHour?.cellId === cellid ? 1.5 : 0}
                                    strokeOpacity={1}
                                    fill={Number((value / 3600).toFixed(2)) >= 0.01 ?
                                      "blue"
                                      :
                                      "gray"}
                                  />
                                )
                              })
                            }
                          </Svg>
                        </View>
                      )
                    })
                  }
                </View>
              </ScrollView>
            </>
            :
            <Text>No data</Text>
      }
    </>
  )
}
