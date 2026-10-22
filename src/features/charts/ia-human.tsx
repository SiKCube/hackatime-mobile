import Alert from "@/components/alert";
import LoadingSkeleton from "@/components/loading-skeleton";
import { THEME } from "@/components/theme";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import axios from "axios";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { gethoursAndMinutes } from "../get-stats";

export interface MainRequest {
  total_seconds: number
}

interface BarData {
  texttime: string
  porcentage: number
}

const getTotalSecs = async (username: string, apikey: string, noia: boolean): Promise<number> => {
  const { data }: { data: MainRequest } = await axios.request({
    method: "GET",
    url: `https://hackatime.hackclub.com/api/v1/users/${username}/stats`,
    params: {
      total_seconds: true,
      no_ai_coding: noia
    },
    headers: {
      Authorization: `Bearer ${apikey}`
    }
  })

  if (!data) throw Error("No data in request")

  return data.total_seconds
}

const get100porcent = (value: number, your100: number): number => {
  const r = Number(((value * 100) / your100).toFixed(1))
  return r
}

export default function IaVsHumanChart() {
  const { user, userApikey } = useAuthCtx()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<[BarData, BarData] | null>(null)

  useEffect(() => {
    const getStat = async (username: string, apikey: string) => {
      try {
        setLoading(true)
        setError(null)

        const total = await getTotalSecs(username, apikey, false)
        const totalNotAI = await getTotalSecs(username, apikey, true)

        const iaCodingSecs = total - totalNotAI


        setChartData([
          {
            texttime: gethoursAndMinutes(totalNotAI),
            porcentage: get100porcent(totalNotAI, total)
          },
          {
            texttime: gethoursAndMinutes(iaCodingSecs),
            porcentage: get100porcent(iaCodingSecs, total)
          }
        ])
        setLoading(false)
      } catch (e) {
        setError(`${e}`)
        setLoading(false)
      }
    }

    if (userApikey && user) {
      getStat(user.username, userApikey)
    }
  }, [])

  return (
    <StyledCard>
      <StyledText weight="bold" size={20}>AI vs Human Coding</StyledText>
      <StyledText type="seconday" size={15}>Better by hand?</StyledText>
      <Alert msg={error} type="error" />
      {
        !loading && chartData ?
          <View style={{ marginTop: 20 }}>
            <View style={{ width: "100%", height: 20, flexDirection: "row" }}>
              <View style={{ width: `${chartData[1].porcentage}%`, height: 20, backgroundColor: THEME.primary, borderTopStartRadius: 100, borderBottomStartRadius: 100 }} />
              <View style={{ width: `${chartData[0].porcentage}%`, height: 20, backgroundColor: THEME.blue, borderTopEndRadius: 100, borderBottomEndRadius: 100 }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
              <View style={{ flexDirection: "column", justifyContent: "flex-start" }}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                  <View style={{ width: 10, height: 10, backgroundColor: THEME.primary, borderRadius: 100 }} />
                  <StyledText size={13} type="seconday">IA coding</StyledText>
                </View>
                <StyledText weight="bold" size={20}>{chartData[1].porcentage}%</StyledText>
                <StyledText size={13} type="seconday">{chartData[1].texttime}</StyledText>
              </View>
              <View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                  <StyledText size={13} type="seconday">Human coding</StyledText>
                  <View style={{ width: 10, height: 10, backgroundColor: THEME.blue, borderRadius: 100 }} />
                </View>
                <StyledText weight="bold" size={20}>{chartData[0].porcentage}%</StyledText>
                <StyledText size={13} type="seconday">{chartData[0].texttime}</StyledText>
              </View>
            </View>
          </View>
          :
          <LoadingSkeleton height={120} />
      }
    </StyledCard>
  )
}