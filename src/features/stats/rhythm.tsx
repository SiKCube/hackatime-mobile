import Alert from "@/components/alert";
import LoadingSkeleton from "@/components/loading-skeleton";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { useTheme } from "../theme/context/theme-ctx-provider";
import { gethoursAndMinutes } from "./get-stats";
import { useStatsCtx } from "./context/statsCtxProvider";

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
  start_date: Date
  end_date: Date
}

interface SelectedHour {
  hour: number,
  cellId: number,
  cellIndex: number,
  day: string
}

const WEEK_DAYS = ["Monday", "Tuesday", "Wednseday", "Thursday", "Friday", "Saturday", "Sunday"]
const TIMES = ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "_"]
const CELL_SIZE = 20
const GAP = 5

export default function RhythmChart({ start_date, end_date }: Props) {
  const [chartData, setChartData] = useState<ChartData[] | null>(null)
  const [topHours, setTopHours] = useState<number>(0)
  const [selectedHour, setSelectedHour] = useState<SelectedHour | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { user, userApikey } = useAuthCtx()
  const { projects } = useStatsCtx()
  const { themeData } = useTheme()

  const getSpans = async (username: string, apikey: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data }: { data: SpansRequest } = await axios.request({
        method: "GET",
        url: `https://hackatime.hackclub.com/api/v1/users/${username}/heartbeats/spans`,
        params: {
          start_date: start_date.toISOString(),
          end_date: end_date.toISOString(),
          filter_by_project: projects.join(",")
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
        const dayNumber = (date.getDay() || 7) - 1

        const hours24 = Number(date.getHours())

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

  useEffect(() => {
    if (user && userApikey) {
      getSpans(user.username, userApikey)
    }
  }, [])

  useEffect(() => {
    if (user && userApikey) {
      setSelectedHour(null)
      getSpans(user.username, userApikey)
    }
  }, [start_date, end_date])

  return (
    <StyledCard>
      <StyledText weight="bold" size={20}>Coding Rhythm</StyledText>
      <Alert type="error" msg={error} />
      <Pressable style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}
        onPress={() => setSelectedHour(null)}>
        {
          !loading && chartData ?
            <>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{
                width: (CELL_SIZE + 3) * 30,
                justifyContent: "center",
              }}>
                <View style={{ width: (CELL_SIZE + 3) * 27, gap: GAP, marginBottom: 15 }}>
                  <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <Text style={{ width: 35, opacity: 0 }}>Hour</Text>
                    <View style={{ width: (CELL_SIZE + GAP) * 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      {
                        TIMES.map((v) => <Text style={{ fontSize: 10, opacity: 0.7, color: themeData.secondary }} key={v}>{v}</Text>)
                      }
                    </View>
                  </View>
                  {
                    chartData.map((dayData, dayDataIndex) => {
                      return (
                        <View key={dayDataIndex} style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                          <Text style={{ width: 35, opacity: 0.7, fontSize: 12, color: themeData.secondary }}>
                            {dayData.dayString.slice(0, 3)}
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
                                      cellId: cellid,
                                      day: dayData.dayString
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
                                    stroke={themeData.primary}
                                    strokeWidth={selectedHour?.cellId === cellid ? 1 : 0}
                                    strokeOpacity={1}
                                    fill={Number((value / 3600).toFixed(2)) >= 0.01 ?
                                      themeData.primary
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
            <LoadingSkeleton height={250} />
        }
      </Pressable>
      {
        selectedHour ?
          <View>
            <View style={{ flexDirection: 'row', gap: 4, justifyContent: "center", alignItems: "center" }}>
              <StyledText type="seconday" size={15}>
                {selectedHour.day}, {selectedHour.cellIndex}:00-{selectedHour.cellIndex + 1}:00
              </StyledText>
              <View style={{ width: 4, height: 4, backgroundColor: themeData.secondary, borderRadius: 100 }} />
              <StyledText weight="bold" size={15}>
                {gethoursAndMinutes(selectedHour.hour)}
              </StyledText>
            </View>
          </View>
          :
          <View style={{ height: 20 }} />
      }
    </StyledCard>
  )
}
