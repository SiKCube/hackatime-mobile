import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";

export interface MainRequest {
  total_seconds: number
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
  const [chartData, setChartData] = useState<[number, number] | null>(null)


  useEffect(() => {
    const getStat = async (username: string, apikey: string) => {
      try {
        setLoading(true)
        setError(null)

        const total = await getTotalSecs(username, apikey, false)
        const totalNotAI = await getTotalSecs(username, apikey, true)

        const iaCodingSecs = total - totalNotAI


        setChartData([get100porcent(totalNotAI, total), get100porcent(iaCodingSecs, total)])
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
    <>
      <Text>{error}</Text>
      {
        loading ?
          <Text>Loading..</Text>
          :
          chartData ?
            <View>
              <View style={{ width: "100%", height: 30, flexDirection: "row", borderRadius: 100 }}>
                <View style={{ width: `${chartData[1]}%`, height: 30, backgroundColor: "red" }} />
                <View style={{ width: `${chartData[0]}%`, height: 30, backgroundColor: "green" }} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }} >
                <Text>IA coding: {chartData[1]}%</Text>
                <Text>Human coding: {chartData[0]}%</Text>
              </View>
            </View>
            :
            <Text>No data</Text>
      }
    </>
  )
}