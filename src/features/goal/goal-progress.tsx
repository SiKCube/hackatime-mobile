import Alert from "@/components/alert";
import LoadingSkeleton from "@/components/loading-skeleton";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { gethoursAndMinutes } from "../stats/get-stats";
import { useTheme } from "../theme/context/theme-ctx-provider";

export interface GoalRequest {
  data: Data;
}

export interface Data {
  grand_total: GrandTotal;
  goal: Goal;
}

export interface Goal {
  target_seconds: number;
  tracked_seconds: number;
  completion_percent: number;
  complete: boolean;
}

export interface GrandTotal {
  text: string;
  total_seconds: number;
}

const getLeftTime = () => {
  const today = new Date()
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0).getTime()
  const passtime = Math.round(86400 - ((today.getTime() - todayZero) / 1000))

  return gethoursAndMinutes(passtime)
}

export default function GoalProgress() {
  const [goal, setGoal] = useState<Data | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { user, userApikey } = useAuthCtx()

  const { themeData } = useTheme()
  
  const getGoal = async (userid: string, apikey: string) => {
    try {
      setError(null)
      setLoading(true)

      const { data }: { data?: GoalRequest } = await axios.request({
        url: `https://hackatime.hackclub.com/api/hackatime/v1/users/${userid}/statusbar/today`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${apikey}`
        },
      })

      if (!data) throw Error("Can't get goals")

      setGoal(data.data)
      setLoading(false)
    } catch (e) {
      setError(`${e}`)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && userApikey) {
      getGoal(user.id, userApikey)
    }
  }, [])

  return (
    <StyledCard>
      <Alert msg={error} type="error" />
      {
        goal && !loading ?
          <View style={{ flexDirection: "column", gap: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View>
                <StyledText type="seconday">
                  <StyledText type={goal.goal.complete ? "success" : undefined} weight="bold" size={18}>{gethoursAndMinutes(goal.goal.tracked_seconds)}</StyledText>
                  /
                  <StyledText type="seconday" size={13}>{gethoursAndMinutes(goal.goal.target_seconds)}</StyledText>
                </StyledText>
                <StyledText type="seconday" size={15}>{goal.goal.completion_percent}%</StyledText>
              </View>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                <View>
                  <StyledText weight="bold" type={goal.goal.complete ? "success" : "seconday"} size={15}>Daily goal</StyledText>
                  <StyledText type={goal.goal.complete ? "success" : "seconday"} size={12}>
                    {
                      goal.goal.complete ?
                        "Done!"
                        :
                        `${getLeftTime()} left today`
                    }
                  </StyledText>
                </View>
                <Ionicons
                  name={goal.goal.complete ? "checkmark-circle" : "time"}
                  size={30}
                  color={goal.goal.complete ? themeData.success : themeData.secondary}
                />
              </View>
            </View>
            <View style={{ gap: 2 }}>
              <Svg width={"100%"} height={10}>
                <Rect
                  x="0"
                  y="0"
                  rx="5"
                  ry="5"
                  width={"100%"}
                  height={10}
                  fill={themeData.surface_200}
                />
                <Rect
                  x="0"
                  y="0"
                  rx="5"
                  ry="5"
                  width={`${goal.goal.completion_percent}%`}
                  height={10}
                  fill={goal.goal.complete ? themeData.success : themeData.primary}
                />
              </Svg>
              <Pressable
                onPress={() => {
                  if (user && userApikey) {
                    getGoal(user.id, userApikey)
                  }
                }}
                style={{ flexDirection: "row", gap: 2, alignItems: "center", justifyContent: "flex-end" }}>
                <Ionicons
                  name={"reload-circle"}
                  size={10}
                  color={goal.goal.complete ? themeData.success : themeData.secondary}
                />
                <StyledText size={10} type="seconday">Click to reload</StyledText>
              </Pressable>
            </View>
          </View>
          :
          <LoadingSkeleton height={50} />
      }
    </StyledCard>
  )
}